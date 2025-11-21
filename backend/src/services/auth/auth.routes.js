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
 *       → Delete session + clear session cookie
 * - GET  /me/profile
 *       → Get current user's profile
 * - POST /me/profile
 *       → Update current user's profile and mark it complete
 */

const authSchemas = require('./auth.schemas');
const AuthRepo = require('./auth.repo');
const AuthService = require('./auth.service');

async function routes(fastify) {
  const authRepo = new AuthRepo(fastify.db);
  const authService = new AuthService(authRepo);

  // Redirect user to Google's consent screen
  fastify.get(
    '/auth/oauth/google',
    {
      schema: {
        summary: 'Initiate Google OAuth2 login flow',
        tags: ['Auth'],
        response: {
          302: { type: 'null' },
        },
      },
    },
    async (req, reply) => {
      const url = authService.buildGoogleLoginUrl(reply);
      req.log.info({ authUrl: url }, 'OAuth authorize URL');
      return reply.redirect(url);
    }
  );

  // Google redirect target (server-side exchange with query params)
  fastify.get(
    '/auth/oauth/google/callback',
    {
      schema: {
        summary: 'OAuth Callback (not to be used directly by client)',
        description: 'Callback used by Google to complete OAuth2 login flow',
        tags: ['Auth'],
        response: {
          302: { type: 'null' },
        },
      },
    },
    async (req, reply) => {
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
        reply.redirect(process.env.FRONTEND_URL || 'http://localhost:3000/');
      } catch (e) {
        req.log.error(e);
        reply.redirect(
          `${process.env.FRONTEND_URL || 'http://localhost:3000/index.html'}?error=${encodeURIComponent(
            e.message
          )}`
        );
      }
    }
  );

  // Logout: delete session + clear cookie
  fastify.post(
    '/auth/logout',
    {
      schema: {
        summary: 'Logout user',
        tags: ['Auth'],
        response: {
          200: {
            type: 'object',
            properties: {
              ok: { type: 'boolean' },
            },
          },
        },
      },
    },
    async (req, reply) => {
      const sessionId = req.cookies?.sid;

      await authService.logout(sessionId, req.log);

      reply.clearCookie('sid', { path: '/' });
      reply.send({ ok: true });
    }
  );

  // Get current user's profile
  fastify.get(
    '/me/profile',
    {
      preHandler: fastify.authenticate,
      schema: {
        summary: 'Fetch user profile',
        tags: ['Profile'],
        response: {
          200: authSchemas.UserProfile,
        },
      },
    },
    async (req) => {
      const profile = authService.buildProfileResponse(req.user);
      return profile;
    }
  );

  // Set current user's profile
  fastify.post(
    '/me/profile',
    {
      preHandler: fastify.authenticate,
      schema: {
        summary: 'Update user profile',
        tags: ['Profile'],
        body: authSchemas.UpdateProfileParams,
        response: {
          200: {
            type: 'object',
            properties: {
              ok: { type: 'boolean' },
              user: authSchemas.UserProfile,
            },
          },
        },
      },
    },
    async (req, reply) => {
      const user = req.user;
      const body = req.body;

      // Validate request body format
      if (!body || typeof body !== 'object') {
        return reply.code(400).send({
          error: 'Invalid request body. Expected JSON object.',
        });
      }

      const updatedProfile = await authService.updateCurrentUserProfile(
        user,
        body
      );

      return {
        ok: true,
        user: updatedProfile,
      };
    }
  );

  fastify.get(
    '/me',
    {
      preHandler: fastify.authenticate,
      schema: {
        summary: 'Get user info (deprecated, use /me/profile)',
        tags: ['Profile'],
        response: {
          200: authSchemas.UserProfile,
        },
      },
    },
    async (req) => {
      // req.user is set in decorators/auth.js based on the sid cookie.
      return req.user;
    }
  );
}

module.exports = routes;
