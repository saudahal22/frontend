'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Simulasi login admin
    if (email === 'admin@coconut.or.id' && password === 'admin123') {
      localStorage.setItem('coconut_admin', JSON.stringify({ name: 'Admin Coconut' }));
      window.location.href = '/admin/dashboard';
    } else {
      alert('Email atau password salah.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Login Admin</h1>
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400"
              placeholder="admin@coconut.or.id"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400"
              placeholder="admin123"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-sky-600 hover:to-blue-700 transition"
          >
            Masuk
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          <Link href="/">Kembali ke Beranda</Link>
        </p>
      </div>
    </div>
  );
}