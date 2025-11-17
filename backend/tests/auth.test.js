// backend/src/decorators/auth.js

jest.mock('../src/services/auth/auth.repo');

const { describe, test, expect, beforeEach } = require('@jest/globals');
const Fastify = require('fastify');
const authDecorators = require('../src/decorators/auth');
const authRepo = require('../src/services/auth/auth.repo');

describe('Auth Decorators', () => {
  let app;

  beforeEach(async () => {
    jest.clearAllMocks();

    app = Fastify();

    await app.register(require('@fastify/cookie'));
    await app.register(authDecorators);

    app.get(
      '/protected',
      {
        preHandler: app.authenticate,
      },
      async (req, reply) => {
        return { user: req.user };
      }
    );

    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  test('should return 401 when sid cookie is missing', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/protected',
    });

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toEqual({ error: 'Not authenticated' });
  });

  test('should return 401 when session is invalid', async () => {
    authRepo.getUserBySessionId.mockResolvedValue(null);

    const response = await app.inject({
      method: 'GET',
      url: '/protected',
      cookies: { sid: 'invalid-session-id' },
    });

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toEqual({
      error: 'Session expired or invalid',
    });
  });

  test('should attach user to request when session is valid', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@ucsd.edu',
      name: 'Test User',
    };

    authRepo.getUserBySessionId.mockResolvedValue(mockUser);

    const response = await app.inject({
      method: 'GET',
      url: '/protected',
      cookies: { sid: 'valid-session-id' },
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ user: mockUser });
  });

  test('should call getUserBySessionId with correct session ID', async () => {
    authRepo.getUserBySessionId.mockResolvedValue({
      id: 'user-123',
      email: 'test@ucsd.edu',
    });

    await app.inject({
      method: 'GET',
      url: '/protected',
      cookies: { sid: 'my-session-123' },
    });

    expect(authRepo.getUserBySessionId).toHaveBeenCalledWith('my-session-123');
  });

  test('should handle repo errors gracefully', async () => {
    authRepo.getUserBySessionId.mockRejectedValue(
      new Error('Database connection failed')
    );

    const response = await app.inject({
      method: 'GET',
      url: '/protected',
      cookies: { sid: 'session-123' },
    });

    // Should return 500 (Fastify's default error handling)
    expect(response.statusCode).toBe(500);
  });
});
