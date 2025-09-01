// lib/auth.js

/**
 * Decode JWT token
 * @param {string} token - JWT dari localStorage
 * @returns {object|null}
 */
export const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    console.error('Gagal decode token:', e);
    return null;
  }
};

/**
 * Ambil role dari token
 * @returns {string|null} 'user', 'admin', atau null
 */
export const getUserRole = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) return null;

  const decoded = decodeToken(token);

  // Cek expired
  if (decoded?.exp && Date.now() / 1000 > decoded.exp) {
    console.warn('Token sudah expired');
    return null;
  }

  return decoded?.role || null;
};

/**
 * Cek apakah user sudah login
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) return false;

  const decoded = decodeToken(token);
  if (!decoded) return false;

  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
};
