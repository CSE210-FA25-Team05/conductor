'use strict';

/**
 * Auth Repository
 *
 * This module represents the data access layer for authentication:
 * - User storage (currently in-memory; replace with Prisma/DB later)
 * - Session storage (sessionId → userId mapping)
 */

// In-memory stores (replace with DB when ready)
const users = new Map();      // email -> user
const sessions = new Map();   // sessionId -> { userId, createdAt, expiresAt }

/**
 * Upsert a user from a Google ID token payload.
 * @param {object} payload - Google ID token payload
 * @returns {Promise<object>} user - normalized user object
 */
async function upsertUserFromGooglePayload(payload) {
  const email = payload.email.toLowerCase();
  let existing = users.get(email);

  if (!existing) {
    // In a real DB, use an auto-increment ID or UUID primary key.
    existing = {
      id: payload.sub, // use Google sub as temporary user id
      email,
      name: payload.name || '',
      createdAt: new Date(),
    };
    users.set(email, existing);
  } else {
    // Example of a light "update" when profile changes
    if (payload.name && payload.name !== existing.name) {
      existing.name = payload.name;
    }
  }

  return existing;
}

/**
 * Create a new session for a given user id.
 * @param {string} sessionId - randomly generated UUID
 * @param {string} userId - id of the authenticated user
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

  // Resolve the user associated with this session.
  for (const user of users.values()) {
    if (user.id === session.userId) {
      return user;
    }
  }
  return null;
}

/**
 * Optional helper to invalidate a session, e.g. on logout.
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
