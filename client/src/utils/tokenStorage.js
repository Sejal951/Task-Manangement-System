const TOKEN_KEY = 'tmp_token';
const USER_KEY = 'tmp_user';

function getStore(remember) {
  return remember ? window.localStorage : window.sessionStorage;
}

export function saveSession({ token, user, remember }) {
  clearSession();
  const store = getStore(remember);
  store.setItem(TOKEN_KEY, token);
  store.setItem(USER_KEY, JSON.stringify(user));
}

export function loadSession() {
  const store = window.localStorage.getItem(TOKEN_KEY)
    ? window.localStorage
    : window.sessionStorage;
  const token = store.getItem(TOKEN_KEY);
  const rawUser = store.getItem(USER_KEY);
  if (!token || !rawUser) return null;
  try {
    return { token, user: JSON.parse(rawUser) };
  } catch {
    return null;
  }
}

export function clearSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(USER_KEY);
}
