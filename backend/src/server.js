'use strict';

require('dotenv').config();

const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const cookie = require('@fastify/cookie');

//ecosystem plugins
fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
fastify.register(cookie);

//decorators
fastify.register(require('./decorators/auth'));

//hooks
fastify.register(require('./hooks/profile-complete'));

//services
fastify.register(require('./services/auth'));
fastify.register(require('./services/lectures'));

//health check
fastify.get('/api/health', async () => {
  return { ok: true, time: new Date().toISOString() };
});

const PORT = process.env.PORT || 3001;

fastify.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Backend API running on http://localhost:${PORT}`);
});
