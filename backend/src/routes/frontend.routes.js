const authenticate = require('../auth/auth.js');

async function routes(fastify) {

    fastify.get("/login", (request, reply) => {
        reply.sendFile("pages/login.html");
    });

    // Protected route
    fastify.get("/", { preHandler: authenticate }, (request, reply) => {
        reply.sendFile("index.html");
    });

    fastify.get("/404", (request, reply) => {
        reply.sendFile("pages/404.html");
    });

}

module.exports = routes;
