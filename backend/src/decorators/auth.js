'use strict';

/**
 * Auth decorators
 *
 * - fastify.authenticate(req, reply)
 *      Reads the "sid" cookie, resolves the current user from the session
 *      repository, and attaches it to req.user. Sends 401 if unauthenticated.
 */

const fp = require('fastify-plugin');
const authRepo = require('../services/auth/auth.repo');

module.exports = fp(async function authDecorators(fastify, opts) {
  fastify.decorate('authenticate', async function (req, reply) {
    const sessionId = req.cookies?.sid;
    if (!sessionId) {
      return reply.code(401).send({ error: 'Not authenticated' });
    }

    const user = await authRepo.getUserBySessionId(sessionId);
    if (!user) {
      return reply.code(401).send({ error: 'Session expired or invalid' });
    }

    req.user = user;
  });
});
