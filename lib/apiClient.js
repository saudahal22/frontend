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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login gagal');
  }

  return data;
};