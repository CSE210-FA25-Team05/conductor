const path = require("path");
const fastify = require('fastify')({ logger: true });

const PORT = process.env.PORT || 3001;
const TOKEN_NAME = "token"
const TOKEN_VALUE = "randomToken"




// Register 
fastify.register(require("@fastify/cors"), {
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
});

fastify.register(require("@fastify/static"), {
    root: path.join(__dirname, "../../frontend"),
    prefix: "/",
});

fastify.register(require('@fastify/cookie'));


// placeholder authentication logic
async function authenticate(request, reply) {
    const token = request.cookies[TOKEN_NAME];
    reply.log.info({ cookies: request.cookies }, "Received cookies for protected route.");
    reply.log.info({ token: token }, "TOKENSSS");
    if (!token || token != TOKEN_VALUE) {
        reply.log.warn('No token found for protected route.');
        return reply.redirect('/error', 302);
    }
    reply.log.info("AUTHENTICATED TOKEN: ", token);
}

// Temp fronend routes
fastify.get("/", (request, reply) => {
    reply.sendFile("index.html");
});

fastify.get("/error", (request, reply) => {
    reply.sendFile("src/pages/error.html");
});

fastify.get("/protected", { preHandler: authenticate }, (request, reply) => {
    reply.sendFile("src/pages/dummy.html");
});

fastify.setNotFoundHandler((request, reply) => {
    reply.log.warn(`404 Not Found: ${request.method} ${request.url}`);
    return reply.status(404).sendFile("index.html");
});

// placeholder login logout functinality
fastify.post('/api/logout', async (request, reply) => {
    reply.clearCookie(TOKEN_NAME, { path: '/' });
    return reply.redirect('/', 302);
});

fastify.post('/api/login', async (request, reply) => {

    // Set the token as an HttpOnly cookie
    // HttpOnly: Prevents client-side JS from accessing the cookie
    // Secure: Only send over HTTPS
    // SameSite: Protects against CSRF
    reply.setCookie(TOKEN_NAME, TOKEN_VALUE, {
        httpOnly: true,
        secure: false, // Change for PROD!
        path: '/',
        maxAge: 3600,
        sameSite: 'lax',
    });
    reply.send({ message: 'Login successful!' });
});

fastify.get('/api/health', async (request, reply) => {
    return { ok: true, time: new Date().toISOString() };
});

fastify.listen({ port: PORT, host: 'localhost' }, (err) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`Backend API running on http://localhost:${PORT}`);
});
