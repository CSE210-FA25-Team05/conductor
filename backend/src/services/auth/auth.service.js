'use strict';

/**
 * Auth Service
 *
 * Responsibilities:
 * - Build Google OAuth login URL and set CSRF state cookie
 * - Exchange authorization code for tokens
 * - Verify Google ID token and email rules
 * - Create a session (UUID) and store it in the repository
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

  const user = await authRepo.upsertUserFromGooglePayload(payload);
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

  const user = await authRepo.upsertUserFromGooglePayload(payload);
  const sessionId = await createSessionForUser(user);

  return sessionId;
}

module.exports = {
  buildGoogleLoginUrl,
  handleGoogleCallback,
  handleCodeExchangeFromBody,
};
