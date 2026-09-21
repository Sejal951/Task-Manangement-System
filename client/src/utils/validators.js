const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

export function isValidEmail(email) {
  return EMAIL_REGEX.test(email || '');
}

export function isValidPassword(password) {
  return PASSWORD_REGEX.test(password || '');
}

export function isRequired(value) {
  return value !== undefined && value !== null && String(value).trim().length > 0;
}
