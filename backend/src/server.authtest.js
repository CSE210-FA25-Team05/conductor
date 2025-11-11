'use strict';
require('dotenv').config();


const fastify = require('fastify')({ logger: true });
const cookie = require('@fastify/cookie');
const cors = require('@fastify/cors');

// register routes file
const authRoutes = require('./routes/auth.routes');

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// CORS: allow frontend to call /me with cookies
fastify.register(cors, {
  origin: FRONTEND_URL,
  credentials: true,
});

// Cookies (for oauth_state + sid)
fastify.register(cookie, {
  secret: process.env.SESSION_SECRET || 'dev-secret',
});

// Health check
fastify.get('/api/health', async () => {
  return { ok: true, time: new Date().toISOString() };
});

// Auth routes:
// GET  /auth/oauth/google
// GET  /auth/oauth/google/callback
// POST /auth/oauth/google/add_token
// POST /auth/logout
fastify.register(authRoutes);

/**
 * Optional: /me for quick session verification in the temp frontend.
 * Since we set `sid` to a simple string (JSON), just try to parse it.
 * In production you will replace this with a real JWT verification.
 */
fastify.get('/me', async (req, reply) => {
  const token = req.cookies?.sid;
  if (!token) return reply.code(401).send({ error: 'Not logged in' });
  try {
    const user = JSON.parse(token); // { email, name }
    return user;
  } catch {
    return reply.code(401).send({ error: 'Session invalid' });
  }
});

fastify.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Backend API running on http://localhost:${PORT}`);
});