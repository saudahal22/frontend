// app/login/page.js
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FadeIn, SlideUp } from '../../components/Animations';
import Spinner from '../../components/Spinner';
import { apiClient } from '../../lib/apiClient';
import { useRouter } from 'next/navigation';
import { decodeToken } from '../../lib/auth'; // ✅ Gunakan dari auth.js

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 🔍 Fitur lihat password
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Semua field wajib diisi');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await apiClient('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      if (data.token) {
        // Simpan token
        localStorage.setItem('token', data.token);

        // Decode token untuk baca role
        const decoded = decodeToken(data.token);

        if (!decoded) {
          setError('Token tidak valid. Silakan coba lagi.');
          setLoading(false);
          return;
        }

        // Simpan data user (opsional, untuk keperluan frontend)
        localStorage.setItem(
          'coconut_user',
          JSON.stringify({
            id_user: decoded.id_user,
            username: decoded.username,
            full_name: decoded.full_name,
            role: decoded.role,
            profile_picture: decoded.profile_picture,
          })
        );

        // Beri tahu aplikasi bahwa login berhasil (untuk sinkronisasi tab)
        window.dispatchEvent(new Event('storage'));

        // Redirect berdasarkan role
        if (decoded.role === 'admin') {
          router.push('/admin-dashboard');
        } else {
          router.push('/'); // Arahkan ke beranda untuk user
        }

        // Refresh untuk memastikan state terbaru
        router.refresh();
      } else {
        setError('Login gagal: Token tidak diterima dari server.');
      }
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa kembali username dan password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <FadeIn>
        <div className="w-full max-w-4xl h-auto md:h-[600px] bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
          {/* Left Section - Illustration */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-sky-500 to-blue-600 text-white p-8 md:p-10 flex flex-col justify-center items-center">
            <div className="mt-10 w-full flex justify-center">
              <Image
                src="/Mobile-encryption-amico-1.png"
                alt="Login Illustration"
                width={300}
                height={250}
                className="w-full max-w-xs md:max-w-sm h-auto object-contain"
              />
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div className="w-full md:w-1/2 p-8 md:p-10 relative bg-gradient-to-br from-white to-sky-50 flex flex-col justify-center">
            {/* Logo di latar belakang (transparan) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Image
                src="/logo.png"
                alt="Coconut Logo"
                width={250}
                height={340}
                style={{
                  width: '250px',
                  height: '340px',
                  opacity: 0.1,
                  objectFit: 'contain',
                }}
                className="opacity-10"
              />
            </div>

            <div className="relative z-10">
              <SlideUp delay={300}>
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
              </SlideUp>

              {error && (
                <SlideUp delay={400}>
                  <p className="text-red-500 text-sm text-center mb-4 bg-red-50 p-3 rounded-lg">
                    {error}
                  </p>
                </SlideUp>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <SlideUp delay={400}>
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl shadow-sm 
                                 focus:ring-2 focus:ring-sky-400 focus:border-sky-500 
                                 bg-white text-gray-900 placeholder-gray-500 
                                 transition duration-200 ease-in-out
                                 disabled:bg-gray-100"
                      placeholder="Masukkan username"
                      disabled={loading}
                    />
                  </div>
                </SlideUp>

                <SlideUp delay={500}>
                  <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl shadow-sm 
                                 focus:ring-2 focus:ring-sky-400 focus:border-sky-500 
                                 bg-white text-gray-900 placeholder-gray-500 
                                 transition duration-200 ease-in-out
                                 disabled:bg-gray-100 pr-10"
                      placeholder="Masukkan password"
                      disabled={loading}
                    />
                    {/* 🔍 Tombol Lihat Password */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 focus:outline-none"
                      aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </SlideUp>

                <SlideUp delay={600}>
                  <div className="text-right">
                    <Link href="/forgot-password" className="text-sm text-sky-600 hover:underline hover:text-sky-800 transition">
                      Lupa Password?
                    </Link>
                  </div>
                </SlideUp>

                <SlideUp delay={700}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-900 to-sky-700 text-white py-3 rounded-xl 
                               hover:from-blue-800 hover:to-sky-600 
                               transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 
                               font-semibold flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <Spinner />
                        Logging in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </button>
                </SlideUp>
              </form>

              {/* Belum punya akun? */}
              <div className="text-center mt-6">
                <Link
                  href="/registrasi"
                  className="inline-block text-sm text-gray-600 hover:text-sky-700 font-medium 
                             transition-all duration-200 hover:underline hover:underline-offset-2"
                >
                  Belum punya akun? Daftar di sini
                </Link>
              </div>

              {/* 🔙 Tombol Kembali ke Beranda */}
              <div className="text-center mt-4">
                <Link
                  href="/"
                  className="inline-flex items-center space-x-1 text-sm text-gray-900 hover:text-blue-600 
                             transition-all duration-150 hover:underline"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Kembali ke Beranda</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
