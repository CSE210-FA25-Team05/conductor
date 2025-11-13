const TOKEN_NAME = 'auth_token'
const TOKEN_VALUE = 'auth_token_value'

async function routes(fastify) {

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

}

module.exports = routes;

