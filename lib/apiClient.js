// lib/apiClient.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  let data;
  try {
    data = await response.json();
  } catch (parseError) {
    throw new Error('Gagal memproses respons dari server');
  }

  if (!response.ok) {
    // Gunakan `error` jika tersedia, fallback ke `message`
    const errorMessage = data.error || data.message || 'Aksi gagal';
    throw new Error(errorMessage);
  }

  return data;
};