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
    // Test mode: bypass authentication in development
    const isTestMode =
      process.env.NODE_ENV === 'development' && process.env.TEST_MODE === 'true';

    if (isTestMode) {
      try {
        // Use a test user from the database (first user in seed data)
        const prisma = require('../prisma');
        const testUser = await prisma.users.findFirst({
          where: { deleted_at: null },
          orderBy: { id: 'asc' },
        });

        if (testUser) {
          req.user = {
            id: testUser.id,
            email: testUser.email,
            name: `${testUser.first_name} ${testUser.last_name}`,
          };
          fastify.log.info(
            { testMode: true, userId: testUser.id },
            'Test mode: using test user'
          );
          return; // Skip real authentication
        }
      } catch (error) {
        fastify.log.error({ error }, 'Test mode failed, falling back to normal auth');
      }
    }

    // Normal authentication flow
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
