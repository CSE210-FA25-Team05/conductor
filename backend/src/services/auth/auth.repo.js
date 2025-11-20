'use strict';

/**
 * Auth Repository
 *
 * - User storage (Prisma / PostgreSQL)
 * - Session storage
 */

const prisma = require('../../prisma');

/**
 * Upsert (create or update) a user record by email.
 *
 * @param {object} params
 * @param {string} params.email
 * @param {string|null} params.first_name
 * @param {string|null} params.last_name
 * @param {Date} params.last_login
 * @returns {Promise<object>} user - Prisma users record
 */
async function upsertUser({ email, first_name, last_name, last_login }) {
  if (!email) {
    throw new Error('Email is required for upsertUser');
  }

  const user = await prisma.users.upsert({
    where: { email },
    create: {
      email,
      first_name,
      last_name,
      last_login,
      // global_role and is_profile_complete use DB defaults
    },
    update: {
      first_name,
      last_name,
      last_login,
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
 * Get a user by email.
 *
 * @param {string} email
 * @returns {Promise<object|null>} user or null if not found
 */
async function getUserByEmail(email) {
  if (!email) {
    return null;
  }

  return await prisma.users.findUnique({
    where: { email },
  });
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
 * Update user profile fields (partial update supported).
 * Only updates fields that are explicitly provided (not undefined).
 *
 * @param {number} userId
 * @param {object} profileData - { first_name?, last_name?, pronouns? }
 * @param {boolean|undefined} isProfileComplete - optional flag to explicitly set profile completion
 * @returns {Promise<object>} updated user
 */
async function updateUserProfile(userId, profileData, isProfileComplete) {
  const { first_name, last_name, pronouns } = profileData;

  // Build update data object, only including fields that are explicitly provided
  const updateData = {};

  if (first_name !== undefined) {
    updateData.first_name = first_name;
  }
  if (last_name !== undefined) {
    updateData.last_name = last_name;
  }
  if (pronouns !== undefined) {
    updateData.pronouns = pronouns;
  }
  if (isProfileComplete !== undefined) {
    updateData.is_profile_complete = isProfileComplete;
  }
  const user = await prisma.users.update({
    where: { id: userId },
    data: updateData,
  });

  return user;
}

module.exports = {
  upsertUser,
  createSession,
  getUserByEmail,
  getUserBySessionId,
  deleteSession,
  updateUserProfile,
};
