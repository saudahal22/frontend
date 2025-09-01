// lib/apiClient.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cocopen-production.up.railway.app';

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const apiClient = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const isFormData = options.body instanceof FormData;

  const defaultHeaders = isFormData
    ? {} // ❌ Jangan tambahkan Content-Type — biarkan browser atur
    : { 'Content-Type': 'application/json' };

  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  // ✅ Hapus Content-Type jika FormData, biar browser set otomatis
  if (isFormData && headers['Content-Type']) {
    delete headers['Content-Type'];
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      if (!response.ok) {
        throw new Error(text || 'Respons bukan JSON');
      }
      return text;
    }

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error || data.message || 'Aksi gagal';
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError') {
      throw new Error('Tidak dapat terhubung ke server. Periksa koneksi Anda.');
    }
    throw error;
  }
};
