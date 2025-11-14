'use strict';

/**
 * Auth Routes
 *
 * - GET  /auth/oauth/google
 *       → Redirect to Google with CSRF state cookie
 * - GET  /auth/oauth/google/callback
 *       → Server-side exchange, create session, set "sid" cookie
 * - POST /auth/oauth/google/add_token
 *       → Optional SPA/PKCE flow, same behavior as callback
 * - POST /auth/logout
 *       → Clear session cookie
 */

const authService = require('./auth.service');

async function routes(fastify) {
  // Redirect user to Google's consent screen
  fastify.get('/auth/oauth/google', async (req, reply) => {
    const url = authService.buildGoogleLoginUrl(reply);
    req.log.info({ authUrl: url }, 'OAuth authorize URL');
    return reply.redirect(url);
  });

  // Google redirect target (server-side exchange with query params)
  fastify.get('/auth/oauth/google/callback', async (req, reply) => {
    try {
      const sessionId = await authService.handleGoogleCallback(req);

      // Set sid cookie (sessionId → userId is stored in auth.repo)
      reply.setCookie('sid', sessionId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      reply.clearCookie('oauth_state', { path: '/' });
      reply.redirect(process.env.FRONTEND_URL || 'http://localhost:3000/app.html');
    } catch (e) {
      req.log.error(e);
      reply.redirect(
        `${process.env.FRONTEND_URL || 'http://localhost:3000/index.html'}?error=${encodeURIComponent(
          e.message
        )}`
      );
    }
  });

  // Optional: SPA/PKCE-style code exchange
  fastify.post('/auth/oauth/google/add_token', async (req, reply) => {
    try {
      const sessionId = await authService.handleCodeExchangeFromBody(req);

      reply.setCookie('sid', sessionId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
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
    // We only clear the cookie here; you can also delete the session in repo if needed.
    reply.clearCookie('sid', { path: '/' });
    reply.send({ ok: true });
  });
}

module.exports = routes;
