// backend/tests/security.test.js
const {
  isStrongPassword,
  sanitizeInput,
  hasRequiredRole,
} = require('../src/auth/security');

describe('isStrongPassword', () => {
  test('rejects short passwords', () => {
    expect(isStrongPassword('Ab1!')).toBe(false);
  });

  test('accepts a long complex password', () => {
    expect(isStrongPassword('StrongPassw0rd!')).toBe(true);
  });

  test('rejects password without symbol', () => {
    expect(isStrongPassword('StrongPassw0rd')).toBe(false);
  });
});

describe('sanitizeInput', () => {
  test('removes angle brackets used in HTML tags', () => {
    const input = '<script>alert(1)</script>';
    const output = sanitizeInput(input);
    expect(output).not.toMatch(/[<>]/);
  });
});

describe('hasRequiredRole', () => {
  test('returns true when user has the role', () => {
    const user = { roles: ['user', 'admin'] };
    expect(hasRequiredRole(user, 'admin')).toBe(true);
  });

  test('returns false when user does not have the role', () => {
    const user = { roles: ['user'] };
    expect(hasRequiredRole(user, 'admin')).toBe(false);
  });

  test('handles missing user object', () => {
    expect(hasRequiredRole(null, 'admin')).toBe(false);
  });
});
