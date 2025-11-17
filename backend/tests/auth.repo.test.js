// tests for backend/src/services/auth/auth.repo.js
const {
  upsertUserFromGooglePayload,
  createSession,
  getUserBySessionId,
  deleteSession,
} = require('../src/services/auth/auth.repo');

// We trust Google to provide valid payloads, so we won't test invalid payloads here.
describe('upsertUserFromGooglePayload', () => {
  test('should create a new user from Google payload', async () => {
    const payload = {
      sub: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
    };

    const user = await upsertUserFromGooglePayload(payload);

    expect(user).toBeDefined();
    expect(user.id).toBe('google-123');
    expect(user.email).toBe('test@example.com');
    expect(user.name).toBe('Test User');
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  test('should normalize email to lowercase', async () => {
    const payload = {
      sub: 'google-456',
      email: 'TEST@EXAMPLE.COM',
      name: 'Test User',
    };

    const user = await upsertUserFromGooglePayload(payload);

    expect(user.email).toBe('test@example.com');
  });

  test('should return existing user on duplicate email', async () => {
    const payload = {
      sub: 'google-789',
      email: 'duplicate@example.com',
      name: 'Original Name',
    };

    // First insert
    const user1 = await upsertUserFromGooglePayload(payload);
    const originalCreatedAt = user1.createdAt;

    // Second insert with same email
    const payload2 = {
      sub: 'google-999', // Different sub
      email: 'duplicate@example.com',
      name: 'New Name',
    };

    const user2 = await upsertUserFromGooglePayload(payload2);

    // Should return the same user (same id and createdAt)
    expect(user2.id).toBe(user1.id);
    expect(user2.createdAt).toBe(originalCreatedAt);
  });

  test('should update user name if changed', async () => {
    const payload1 = {
      sub: 'google-111',
      email: 'update@example.com',
      name: 'Old Name',
    };

    const user1 = await upsertUserFromGooglePayload(payload1);
    expect(user1.name).toBe('Old Name');

    // Update with new name
    const payload2 = {
      sub: 'google-111',
      email: 'update@example.com',
      name: 'New Name',
    };

    const user2 = await upsertUserFromGooglePayload(payload2);
    expect(user2.name).toBe('New Name');
    expect(user2.id).toBe(user1.id); // Same user
  });

  test('should handle missing name in payload', async () => {
    const payload = {
      sub: 'google-222',
      email: 'noname@example.com',
      // name is missing
    };

    const user = await upsertUserFromGooglePayload(payload);

    expect(user.name).toBe('');
  });

  test('should not update name if payload name is empty', async () => {
    const payload1 = {
      sub: 'google-333',
      email: 'keepname@example.com',
      name: 'Original Name',
    };

    await upsertUserFromGooglePayload(payload1);

    // Try to update with empty name
    const payload2 = {
      sub: 'google-333',
      email: 'keepname@example.com',
      name: '',
    };

    const user2 = await upsertUserFromGooglePayload(payload2);
    expect(user2.name).toBe('Original Name'); // Should keep original
  });

  test('should handle email with mixed case consistently', async () => {
    const payload1 = {
      sub: 'google-444',
      email: 'MixedCase@Example.COM',
      name: 'User 1',
    };

    const user1 = await upsertUserFromGooglePayload(payload1);

    const payload2 = {
      sub: 'google-555',
      email: 'mixedcase@example.com',
      name: 'User 2',
    };

    const user2 = await upsertUserFromGooglePayload(payload2);

    // Should be the same user (case-insensitive)
    expect(user1.id).toBe(user2.id);
  });
});

describe('createSession', () => {
  test('should create a new session', async () => {
    const sessionId = 'session-123';
    const userId = 'user-456';
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    const session = await createSession(sessionId, userId, expiresAt);

    expect(session).toBeDefined();
    expect(session.id).toBe(sessionId);
    expect(session.userId).toBe(userId);
    expect(session.expiresAt).toBe(expiresAt);
    expect(session.createdAt).toBeInstanceOf(Date);
  });

  test('should set createdAt to current time', async () => {
    const before = new Date();
    const session = await createSession('session-abc', 'user-123', new Date());
    const after = new Date();

    expect(session.createdAt.getTime()).toBeGreaterThanOrEqual(
      before.getTime()
    );
    expect(session.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  test('should allow multiple sessions for same user', async () => {
    const userId = 'user-multi';
    const expiresAt = new Date(Date.now() + 3600000);

    const session1 = await createSession('session-1', userId, expiresAt);
    const session2 = await createSession('session-2', userId, expiresAt);

    expect(session1.id).not.toBe(session2.id);
    expect(session1.userId).toBe(session2.userId);
  });

  test('should handle null and not defined for all fields', async () => {
    const session1 = await createSession(null, null, null);

    expect(session1.id).toBeNull();
    expect(session1.userId).toBeNull();
    expect(session1.expiresAt).toBeNull();

    const session2 = await createSession(undefined, undefined, undefined);

    expect(session2.id).toBeUndefined();
    expect(session2.userId).toBeUndefined();
    expect(session2.expiresAt).toBeUndefined();
  });
});

describe('getUserBySessionId', () => {
  test('should return user for valid session', async () => {
    // Create a user
    const payload = {
      sub: 'user-valid',
      email: 'valid@example.com',
      name: 'Valid User',
    };
    const user = await upsertUserFromGooglePayload(payload);

    // Create a session
    const sessionId = 'valid-session';
    const expiresAt = new Date(Date.now() + 3600000);
    await createSession(sessionId, user.id, expiresAt);

    // Retrieve user by session
    const retrievedUser = await getUserBySessionId(sessionId);

    expect(retrievedUser).toBeDefined();
    expect(retrievedUser.id).toBe(user.id);
    expect(retrievedUser.email).toBe('valid@example.com');
  });

  test('should return null for non-existent session', async () => {
    const user = await getUserBySessionId('non-existent-session');

    expect(user).toBeNull();
  });

  test('should return null for invalid session id', async () => {
    const user1 = await getUserBySessionId(null);
    expect(user1).toBeNull();

    const user2 = await getUserBySessionId(undefined);
    expect(user2).toBeNull();
  });

  test('should return null for expired session', async () => {
    // Create a user
    const payload = {
      sub: 'user-expired',
      email: 'expired@example.com',
      name: 'Expired User',
    };
    const user = await upsertUserFromGooglePayload(payload);

    // Create an expired session (0.1 second in the past)
    const sessionId = 'expired-session';
    const expiresAt = new Date(Date.now() - 100);
    await createSession(sessionId, user.id, expiresAt);

    // Try to retrieve user
    const retrievedUser = await getUserBySessionId(sessionId);

    expect(retrievedUser).toBeNull();
  });

  test('should delete expired session when accessed', async () => {
    // Create user and expired session
    const payload = {
      sub: 'user-cleanup',
      email: 'cleanup@example.com',
      name: 'Cleanup User',
    };
    const user = await upsertUserFromGooglePayload(payload);

    const sessionId = 'cleanup-session';
    const expiresAt = new Date(Date.now() - 100);
    await createSession(sessionId, user.id, expiresAt);

    // Access expired session (should delete it)
    await getUserBySessionId(sessionId);

    // Try again - should still be null
    const secondAttempt = await getUserBySessionId(sessionId);
    expect(secondAttempt).toBeNull();
  });

  test('should handle session with no expiration', async () => {
    // Create user
    const payload = {
      sub: 'user-noexpire',
      email: 'noexpire@example.com',
      name: 'No Expire User',
    };
    const user = await upsertUserFromGooglePayload(payload);

    // Create session with null expiration
    const sessionId = 'noexpire-session';
    await createSession(sessionId, user.id, null);

    // Should retrieve user successfully
    const retrievedUser = await getUserBySessionId(sessionId);
    expect(retrievedUser).toBeDefined();
    expect(retrievedUser.id).toBe(user.id);
  });

  test('should return null if session user does not exist', async () => {
    // Create a session with a userId that doesn't exist
    const sessionId = 'orphan-session';
    const expiresAt = new Date(Date.now() + 3600000);
    await createSession(sessionId, 'non-existent-user-id', expiresAt);

    const user = await getUserBySessionId(sessionId);

    expect(user).toBeNull();
  });

  test('should handle session expiring exactly now', async () => {
    const payload = {
      sub: 'user-exactexpire',
      email: 'exactexpire@example.com',
      name: 'Exact Expire User',
    };
    const user = await upsertUserFromGooglePayload(payload);

    const sessionId = 'exact-expire-session';
    const now = new Date();
    await createSession(sessionId, user.id, now);

    // Slight delay to ensure expiration
    await new Promise((resolve) => setTimeout(resolve, 10));

    const retrievedUser = await getUserBySessionId(sessionId);
    expect(retrievedUser).toBeNull();
  });
});

describe('deleteSession', () => {
  test('should delete an existing session', async () => {
    // Create user and session
    const payload = {
      sub: 'user-delete',
      email: 'delete@example.com',
      name: 'Delete User',
    };
    const user = await upsertUserFromGooglePayload(payload);

    const sessionId = 'delete-session';
    const expiresAt = new Date(Date.now() + 3600000);
    await createSession(sessionId, user.id, expiresAt);

    // Verify session exists
    let retrievedUser = await getUserBySessionId(sessionId);
    expect(retrievedUser).toBeDefined();

    // Delete session
    await deleteSession(sessionId);

    // Verify session is gone
    retrievedUser = await getUserBySessionId(sessionId);
    expect(retrievedUser).toBeNull();
  });
});
