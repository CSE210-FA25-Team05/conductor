'use strict';

/**
 * Auth Repository
 *
 * - User storage (backed by Prisma/PostgreSQL)
 * - Session storage (sessionId → userId mapping, currently in-memory)
 */

const prisma = require('../../prisma');

// In-memory session store (can be moved to DB later if needed)
const sessions = new Map(); // sessionId -> { userId, createdAt, expiresAt }

/**
 * Upsert a user from a Google ID token payload.
 * If the user does not exist yet, we create a new row in the users table.
 * If the user already exists, we lightly update their profile fields.
 *
 * @param {object} payload - Google ID token payload
 * @returns {Promise<object>} user - Prisma users record
 */
async function upsertUserFromGooglePayload(payload) {
  const email = (payload.email || '').toLowerCase();
  if (!email) {
    throw new Error('Google payload does not contain an email');
  }

  const firstName = payload.given_name || null;
  const lastName = payload.family_name || null;
  const now = new Date();

  const user = await prisma.users.upsert({
    where: { email },
    create: {
      email,
      first_name: firstName,
      last_name: lastName,
      // global_role has a default of "student" in the DB
      last_login: now,
      // is_profile_complete has a default of false
    },
    update: {
      // Keep profile roughly in sync with Google data
      first_name: firstName,
      last_name: lastName,
      last_login: now,
    },
  });

  return user;
}

/**
 * Create a new session for a given user id.
 * This is currently stored in-memory and keyed by a random sessionId.
 *
 * @param {string} sessionId - randomly generated UUID
 * @param {number} userId - id of the authenticated user (users.id)
 * @param {Date}   expiresAt - session expiration time
 * @returns {Promise<object>} session object
 */
async function createSession(sessionId, userId, expiresAt) {
  const now = new Date();
  const session = {
    id: sessionId,
    userId,
    createdAt: now,
    expiresAt,
  };
  sessions.set(sessionId, session);
  return session;
}

/**
 * Look up the current user by session id.
 * Returns null if the session is missing, expired, or the user no longer exists.
 *
 * @param {string} sessionId
 * @returns {Promise<object|null>} user or null if not found/expired
 */
async function getUserBySessionId(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) {
    return null;
  }

  const now = new Date();
  if (session.expiresAt && session.expiresAt <= now) {
    // Session expired, clean it up.
    sessions.delete(sessionId);
    return null;
  }

  // Resolve the user associated with this session from the database.
  const user = await prisma.users.findUnique({
    where: { id: session.userId },
  });

  if (!user) {
    // If the user row was deleted, we can also clean up the session.
    sessions.delete(sessionId);
    return null;
  }

  return user;
}

/**
 * Optional helper to invalidate a session, e.g. on logout.
 *
 * @param {string} sessionId
 * @returns {Promise<void>}
 */
async function deleteSession(sessionId) {
  sessions.delete(sessionId);
}

module.exports = {
  upsertUserFromGooglePayload,
  createSession,
  getUserBySessionId,
  deleteSession,
};
