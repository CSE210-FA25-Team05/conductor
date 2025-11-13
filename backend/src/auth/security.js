// backend/src/security.js

function isStrongPassword(password) {
  if (typeof password !== 'string') return false;
  if (password.length < 12) return false;

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  return hasUpper && hasLower && hasDigit && hasSymbol;
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  // very simple XSS-style cleanup: remove angle brackets
  return input.replace(/[<>]/g, '');
}

function hasRequiredRole(user, requiredRole) {
  if (!user || !Array.isArray(user.roles)) return false;
  if (!requiredRole) return true;
  return user.roles.includes(requiredRole);
}

module.exports = {
  isStrongPassword,
  sanitizeInput,
  hasRequiredRole,
};
