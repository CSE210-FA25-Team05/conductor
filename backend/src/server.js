const path = require("path");
const fastify = require('fastify')({ logger: true });

const authRoutes = require('./routes/auth.routes.js');
const frontendRoutes = require('./routes/frontend.routes.js');


const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';
const FRONTEND_DIR = '../../frontend';

fastify.register(require('@fastify/cookie'), {
    secret: process.env.SESSION_SECRET || 'dev-secret',
});

fastify.register(require("@fastify/static"), {
    root: path.join(__dirname, FRONTEND_DIR),
    prefix: "/",
});

// Register routes
fastify.register(authRoutes);
fastify.register(frontendRoutes);

fastify.get('/api/health', async (request, reply) => {
    return { ok: true, time: new Date().toISOString() };
});

// Handle 404
fastify.setNotFoundHandler((request, reply) => {
    return reply.status(404).sendFile("${FRONTEND_DIR}/pages/404.html");
});

fastify.listen({ port: PORT, host: HOST }, (err) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`Backend API running on http://${HOST}:${PORT}`);
});
