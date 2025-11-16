'use strict';

/**
 * Auth Repository
 *
 * - User storage (Prisma / PostgreSQL)
 * - Session storage
 */

const prisma = require('../../prisma');

/**
 * Upsert a user from a Google ID token payload.
 *
 * @param {object} payload - Google ID token payload
 * @returns {Promise<object>} user - Prisma `users` record
 */
async function upsertUserFromGooglePayload(payload) {
  const email = (payload.email || '').toLowerCase();
  if (!email) {
    throw new Error('Google payload does not contain an email');
  }

  const firstName = payload.given_name || null;
  const lastName = payload.family_name || null;
  const now = new Date();

  // Prisma model is named `users` (plural, lowercase)
  const user = await prisma.users.upsert({
    where: { email },
    create: {
      email,
      first_name: firstName,
      last_name: lastName,
      // global_role defaults to "student"
      last_login: now,
      // is_profile_complete defaults to false
    },
    update: {
      first_name: firstName,
      last_name: lastName,
      last_login: now,
    },
  });

  return user;
}

/**
 * Create a new session for a given user id.
 * Sessions are stored in the `sessions` table.
 *
 * @param {string} sessionId - randomly generated UUID
 * @param {number} userId - id of the authenticated user (users.id)
 * @param {Date}   expiresAt - session expiration time
 * @returns {Promise<object>} session record
 */
async function createSession(sessionId, userId, expiresAt) {
  const session = await prisma.sessions.create({
    data: {
      session_id: sessionId,
      user_id: userId,
      expires_at: expiresAt,
    },
  });
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
  const session = await prisma.sessions.findUnique({
    where: { session_id: sessionId },
  });

  if (!session) {
    return null;
  }

  const now = new Date();
  if (session.expires_at && session.expires_at <= now) {
    // Session expired, clean it up.
    await prisma.sessions.delete({
      where: { session_id: sessionId },
    });
    return null;
  }

  // Resolve the user associated with this session from the database.
  const user = await prisma.users.findUnique({
    where: { id: session.user_id },
  });

  if (!user) {
    // If the user row was deleted, also clean up the session.
    await prisma.sessions.delete({
      where: { session_id: sessionId },
    });
    return null;
  }

  return user;
}

/**
 * Invalidate a session, e.g. on logout.
 *
 * @param {string} sessionId
 * @returns {Promise<void>}
 */
async function deleteSession(sessionId) {
  await prisma.sessions.deleteMany({
    where: { session_id: sessionId },
  });
}

/**
 * Update user profile fields and mark profile as complete.
 *
 * @param {number} userId
 * @param {object} profileData - { first_name, last_name, pronouns }
 * @returns {Promise<object>} updated user
 */
async function updateUserProfile(userId, profileData) {
  const { first_name, last_name, pronouns } = profileData;

  const user = await prisma.users.update({
    where: { id: userId },
    data: {
      first_name,
      last_name,
      pronouns,
      is_profile_complete: true,
    },
  });

  return user;
}

module.exports = {
  upsertUserFromGooglePayload,
  createSession,
  getUserBySessionId,
  deleteSession,
  updateUserProfile,
};
