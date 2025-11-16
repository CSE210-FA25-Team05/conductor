'use strict';

/**
 * Auth Service Plugin
 *
 * This plugin wires the auth routes into the Fastify instance.
 */

const authRoutes = require('./auth.routes');

module.exports = async function authServicePlugin(fastify) {
  fastify.register(authRoutes);
  fastify.get('/me', { preHandler: fastify.authenticate }, async (req) => {
    // req.user is set in decorators/auth.js based on the sid cookie.
    return req.user;
  });
};
