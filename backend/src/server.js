const path = require("path");
const fastify = require('fastify')({ logger: true });

const PORT = process.env.PORT || 3001;

fastify.register(require("@fastify/cors"), {
    origin: "http://127.0.0.1:3001",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
});

fastify.register(require("@fastify/static"), {
    root: path.join(__dirname, "../../frontend"),
    prefix: "/",
});
fastify.get("/", (request, reply) => {
    reply.sendFile("index.html");
});

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
