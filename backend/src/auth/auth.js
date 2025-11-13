const TOKEN_NAME = 'auth_token'

async function authenticate(request, reply) {
    const token = request.cookies[TOKEN_NAME];
    if (!token || token != TOKEN_VALUE) {
        return reply.redirect('/login', 302);
    }
    request.log.info("Authenticated");
}

module.exports = authenticate
