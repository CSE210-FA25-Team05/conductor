const fastify = require('fastify')({logger: true});

const PORT = process.env.PORT || 3001;


fastify.get('/api/health', async (request, reply) => {
    return { ok: true, time: new Date().toISOString() };
});

fastify.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`Backend API running on http://localhost:${PORT}`);
});
