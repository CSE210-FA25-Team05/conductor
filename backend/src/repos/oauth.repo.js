'use strict';

/**
 * OAuth Repository (in-memory)
 * - Replace with Prisma/SQL later without touching services/routes.
 */

// Temporary in-memory storage: userId -> token info
const mem = new Map();

/**
 * Save or update a user's OAuth tokens in memory.
 * @param {object} payload - Google ID token payload (user info)
 * @param {object} tokens  - Token response from Google
 */
exports.saveUserSession = async (payload, tokens) => {
  mem.set(payload.sub, {
    email: payload.email,
    name: payload.name,
    tokens,
  });
  console.log(`[repo] Saved session for ${payload.email}`);
};
