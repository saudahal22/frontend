'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FadeIn, SlideUp } from '../../components/Animations';
import Spinner from '../../components/Spinner';
import { apiClient } from '../../lib/apiClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // LoginPage.js - handleSubmit
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
      localStorage.setItem('token', data.token);
    }

    if (data.user) {
      localStorage.setItem('coconut_user', JSON.stringify(data.user));
    }

    window.dispatchEvent(new Event('storage'));

    // 🔁 Redirect berdasarkan role
    if (data.user?.role === 'admin') {
      router.push('/admin-dashboard');
    } else {
      router.push('/');
    }

    router.refresh();
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
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
                  Login
                </h2>
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
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
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
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl shadow-sm 
                                 focus:ring-2 focus:ring-sky-400 focus:border-sky-500 
                                 bg-white text-gray-900 placeholder-gray-500 
                                 transition duration-200 ease-in-out
                                 disabled:bg-gray-100"
                      placeholder="Masukkan password"
                      disabled={loading}
                    />
                  </div>
                </SlideUp>

                <SlideUp delay={600}>
                  <div className="text-right">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-sky-600 hover:underline hover:text-sky-800 transition"
                    >
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
              <SlideUp delay={800}>
                <div className="text-center mt-6">
                  <Link
                    href="/registrasi"
                    className="inline-block text-sm text-gray-600 hover:text-sky-700 font-medium 
                               transition-all duration-200 hover:underline hover:underline-offset-2"
                  >
                    Belum punya akun? Daftar di sini
                  </Link>
                </div>
              </SlideUp>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}