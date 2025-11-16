'use strict';

/**
 * Auth Service
 *
 * Responsibilities:
 * - Build Google OAuth login URL and set CSRF state cookie
 * - Exchange authorization code for tokens
 * - Verify Google ID token and email rules
 * - Create a session (UUID) and store it in the repository
 * - Handle logout and profile-related logic
 */

const { randomUUID } = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const authRepo = require('./auth.repo');

// Configuration from environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI ||
  'http://localhost:3001/auth/oauth/google/callback';

// Only allow UCSD emails by default; can be overridden via env.
const ALLOWED_EMAIL_SUFFIXES = (
  process.env.ALLOWED_EMAIL_SUFFIXES || '@ucsd.edu'
)
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

// Session lifetime in milliseconds (7 days)
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// OAuth2 client
const oauthClient = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

/**
 * Build the Google OAuth login URL and set the CSRF state cookie.
 * @param {fastify.FastifyReply} reply
 * @returns {string} Google OAuth consent screen URL
 */
function buildGoogleLoginUrl(reply) {
  const state = randomUUID();

  // Store state in an HttpOnly cookie to mitigate CSRF.
  reply.setCookie('oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 10 * 60, // 10 minutes
  });

  const authUrl = oauthClient.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['openid', 'email', 'profile'],
    state,
    redirect_uri: GOOGLE_REDIRECT_URI,
  });

  return authUrl;
}



/**
 * Build the input object for insertUser() from a Google ID token payload.
 *
 * @param {object} payload - Google ID token payload
 * @returns {object} insertUser params
 */
function buildInsertUserInputFromGooglePayload(payload) {/**
* Build the input object for insertUser() from a Google ID token payload.
*
* @param {object} payload - Google ID token payload
* @returns {object} insertUser params
*/
function buildInsertUserInputFromGooglePayload(payload) {
 const email = (payload.email || '').toLowerCase();
 if (!email) {
   throw new Error('Google payload does not contain an email');
 }

 return {
   email,
   first_name: payload.given_name || null,
   last_name: payload.family_name || null,
   last_login: new Date(),
 };
}
  const email = (payload.email || '').toLowerCase();
  if (!email) {
    throw new Error('Google payload does not contain an email');
  }

  return {
    email,
    first_name: payload.given_name || null,
    last_name: payload.family_name || null,
    last_login: new Date(),
  };
}


/**
 * Exchange an authorization code for tokens.
 * @param {string} code
 * @returns {Promise<object>} tokens
 */
async function exchangeCodeForTokens(code) {
  const { tokens } = await oauthClient.getToken({
    code,
    redirect_uri: GOOGLE_REDIRECT_URI,
  });
  if (!tokens || !tokens.id_token) {
    throw new Error('Failed to retrieve tokens from Google');
  }
  return tokens;
}

/**
 * Verify the ID token and return the payload.
 * @param {string} idToken
 * @returns {Promise<object>} payload
 */
async function verifyIdToken(idToken) {
  const ticket = await oauthClient.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error('Google ID token payload is empty');
  }
  return payload;
}

/**
 * Enforce email rules (verified + allowed domains).
 * @param {object} payload
 */
function enforceEmailRules(payload) {
  if (!payload.email_verified) {
    throw new Error('Your Google email is not verified');
  }

  const email = (payload.email || '').toLowerCase();
  const allowed = ALLOWED_EMAIL_SUFFIXES.some((suffix) =>
    email.endsWith(suffix)
  );
  if (!allowed) {
    throw new Error('Only UCSD emails are allowed');
  }
}

/**
 * Create a new session for this user.
 * @param {object} user
 * @returns {Promise<string>} sessionId
 */
async function createSessionForUser(user) {
  const sessionId = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await authRepo.createSession(sessionId, user.id, expiresAt);
  return sessionId;
}

/**
 * Handle the standard OAuth callback flow (query string).
 * @param {fastify.FastifyRequest} req
 * @returns {Promise<string>} sessionId to be stored in cookie
 */
async function handleGoogleCallback(req) {
  const { code, state } = req.query;

  if (!code || typeof code !== 'string') {
    throw new Error('Missing authorization code');
  }
  if (!state || typeof state !== 'string') {
    throw new Error('Missing OAuth state');
  }

  const stateCookie = req.cookies?.oauth_state;
  if (!stateCookie || stateCookie !== state) {
    throw new Error('Invalid OAuth state (possible CSRF)');
  }

  const tokens = await exchangeCodeForTokens(code);
  const payload = await verifyIdToken(tokens.id_token);
  enforceEmailRules(payload);

  const insertParams = buildInsertUserInputFromGooglePayload(payload);
  const user = await authRepo.insertUser(insertParams);
  const sessionId = await createSessionForUser(user);

  return sessionId;
}

/**
 * Optional: handle SPA/PKCE-style flows where the code is in the request body.
 * @param {fastify.FastifyRequest} req
 * @returns {Promise<string>} sessionId
 */
async function handleCodeExchangeFromBody(req) {
  const { code, state } = req.body || {};

  if (!code || typeof code !== 'string') {
    throw new Error('Missing authorization code');
  }
  if (!state || typeof state !== 'string') {
    throw new Error('Missing OAuth state');
  }

  const stateCookie = req.cookies?.oauth_state;
  if (!stateCookie || stateCookie !== state) {
    throw new Error('Invalid OAuth state (possible CSRF)');
  }

  const tokens = await exchangeCodeForTokens(code);
  const payload = await verifyIdToken(tokens.id_token);
  enforceEmailRules(payload);

  const insertParams = buildInsertUserInputFromGooglePayload(payload);
  const user = await authRepo.insertUser(insertParams);
  const sessionId = await createSessionForUser(user);

  return sessionId;
}

/**
 * Logout: delete the session record (if any).
 * Route is responsible for clearing the cookie.
 *
 * @param {string | undefined} sessionId
 * @param {object} logger - fastify logger (req.log)
 */
async function logout(sessionId, logger) {
  if (!sessionId) {
    return;
  }

  try {
    await authRepo.deleteSession(sessionId);
  } catch (e) {
    // Do not block logout if session deletion fails.
    logger?.error(e, 'Failed to delete session during logout');
  }
}

/**
 * Build a standardized profile response object from a user record.
 * @param {object} user
 * @returns {object}
 */
function buildProfileResponse(user) {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    pronouns: user.pronouns,
    global_role: user.global_role,
    is_profile_complete: user.is_profile_complete,
  };
}

/**
 * Update current user's profile and mark it as complete.
 * @param {object} user - current user (from req.user)
 * @param {object} body - request body with profile fields
 * @returns {Promise<object>} normalized profile response
 */
async function updateCurrentUserProfile(user, body) {
  const { first_name, last_name, pronouns } = body || {};

  const updated = await authRepo.updateUserProfile(user.id, {
    first_name,
    last_name,
    pronouns,
  });

  return buildProfileResponse(updated);
}

module.exports = {
  buildGoogleLoginUrl,
  handleGoogleCallback,
  handleCodeExchangeFromBody,
  logout,
  buildProfileResponse,
  updateCurrentUserProfile,
};
