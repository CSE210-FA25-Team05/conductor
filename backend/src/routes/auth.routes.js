'use strict';
/**
 * Auth Routes (whiteboard-style paths)
 * - GET  /auth/oauth/google                  → redirect to Google
 * - GET  /auth/oauth/google/callback         → server-side exchange & session
 * - POST /auth/oauth/google/add_token        → optional SPA/PKCE code exchange
 * - POST /auth/logout                        → clear session cookie
 */

const authService = require('../services/auth.service');

async function routes(fastify) {
  // Redirect user to Google's consent screen
  fastify.get('/auth/oauth/google', async (req, reply) => {
    const url = authService.buildGoogleLoginUrl(reply);
    req.log.info({ authUrl: url }, 'OAuth authorize URL');
    return reply.redirect(url);
  });

  // Google redirect target (server-side exchange)
  fastify.get('/auth/oauth/google/callback', async (req, reply) => {
    try {
      const jwt = await authService.handleGoogleCallback(req);
      reply.setCookie('sid', jwt, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // set true in production (HTTPS)
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
      reply.clearCookie('oauth_state', { path: '/' });
      reply.redirect('http://localhost:3000/app.html');
    } catch (e) {
      req.log.error(e);
      reply.redirect(`http://localhost:3000/index.html?error=${encodeURIComponent(e.message)}`);
    }
  });

  // Optional: if you ever do SPA+PKCE and want to post {code} to the backend
  fastify.post('/auth/oauth/google/add_token', async (req, reply) => {
    try {
      // expects JSON body: { code, state } (and optionally { redirectUri })
      const jwt = await authService.handleCodeExchangeFromBody(req);
      reply.setCookie('sid', jwt, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
      reply.clearCookie('oauth_state', { path: '/' });
      reply.send({ ok: true });
    } catch (e) {
      req.log.error(e);
      reply.code(400).send({ error: e.message || 'Token exchange failed' });
    }
  });

  // Logout: clear session cookie
  fastify.post('/auth/logout', async (req, reply) => {
    reply.clearCookie('sid', { path: '/' });
    reply.send({ ok: true });
  });
}

module.exports = routes;
