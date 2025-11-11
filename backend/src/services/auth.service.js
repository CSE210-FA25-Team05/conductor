'use strict';

/**
 * Auth Service
 * - Build Google OAuth URL and set CSRF state cookie
 * - Exchange authorization code → tokens
 * - Verify email_verified and UCSD domains
 * - Return a session token string (placeholder; swap to real JWT later)
 */

const { randomUUID } = require('crypto');
const { request } = require('undici');
const { OAuth2Client } = require('google-auth-library');
const oauthRepo = require('../repos/oauth.repo');

// Load config from environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const ALLOWED_EMAIL_SUFFIXES = (process.env.ALLOWED_EMAIL_SUFFIXES || '@ucsd.edu,@eng.ucsd.edu')
  .split(',')
  .map((s) => s.trim().toLowerCase());

// Must exactly match your Google Cloud Console redirect URI
const REDIRECT_URI = 'http://localhost:3001/auth/oauth/google/callback';

// Google OAuth client
const oauth = new OAuth2Client(GOOGLE_CLIENT_ID);

/**
 * Builds Google's authorize URL and stores a CSRF state in a cookie.
 */
exports.buildGoogleLoginUrl = (reply) => {
  const state = randomUUID();

  // Save state in a secure cookie for CSRF protection
  reply.setCookie('oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

/**
 * Handles the server-side callback (GET).
 * - Validates state
 * - Exchanges code->tokens
 * - Verifies email + domain
 * - Persists session/tokens via repo
 * - Returns a session token/string
 */
exports.handleGoogleCallback = async (req) => {
  const { code, state } = req.query;
  const savedState = req.cookies['oauth_state'];
  if (!code || !state || state !== savedState) throw new Error('Invalid OAuth state');

  const tokens = await exchangeCodeForTokens(code);
  const payload = await verifyIdToken(tokens.id_token);

  enforceEmailRules(payload);
  await persistSession(payload, tokens);

  // Return a simple session string; replace with a real JWT later if needed
  return JSON.stringify({ email: payload.email, name: payload.name });
};

/**
 * Optional endpoint for SPA/PKCE style:
 * the frontend posts { code, state } to exchange tokens server-side.
 */
exports.handleCodeExchangeFromBody = async (req) => {
  const body = req.body || {};
  const code = body.code;
  const state = body.state;
  const savedState = req.cookies['oauth_state'];
  if (!code || !state || state !== savedState) throw new Error('Invalid OAuth state');

  const tokens = await exchangeCodeForTokens(code);
  const payload = await verifyIdToken(tokens.id_token);

  enforceEmailRules(payload);
  await persistSession(payload, tokens);

  return JSON.stringify({ email: payload.email, name: payload.name });
};

/* ----------------- helpers ----------------- */

async function exchangeCodeForTokens(code) {
  const res = await request('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }).toString(),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  }).then((r) => r.body.json());

  if (!res.id_token) throw new Error('Token exchange failed');
  return res;
}

async function verifyIdToken(idToken) {
  const ticket = await new OAuth2Client(GOOGLE_CLIENT_ID).verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload) throw new Error('Invalid id_token');
  return payload;
}

function enforceEmailRules(payload) {
  if (!payload.email_verified) {
    throw new Error('Your Google email is not verified');
  }
  const email = (payload.email || '').toLowerCase();
  const allowed = ALLOWED_EMAIL_SUFFIXES.some((sfx) => email.endsWith(sfx));
  if (!allowed) throw new Error('Only UCSD emails are allowed');
}

async function persistSession(payload, tokens) {
  // Plug-in point: write to DB later (users/oauths)
  await oauthRepo.saveUserSession(payload, tokens);
}
