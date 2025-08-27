// lib/apiClient.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Ambil token dari localStorage (hanya di client)
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token'); // Pastikan login menyimpan token
  }
  return null;
};

export const apiClient = async (endpoint, options = {}) => {
  const token = getAuthToken();

  // Deteksi apakah ini multipart/form-data (upload file)
  const isMultipart = options.headers?.['Content-Type'] === 'multipart/form-data';

  // Default ke JSON kecuali multipart
  const defaultHeaders = !isMultipart
    ? { 'Content-Type': 'application/json' }
    : {};

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Jika respons tidak ada body (204 No Content)
    if (response.status === 204) {
      return null;
    }

    // Cek apakah respons adalah JSON
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