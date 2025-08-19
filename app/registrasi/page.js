'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FadeIn, SlideUp } from '../../components/Animations';
import { apiClient } from '../../lib/apiClient';
import { useRouter } from 'next/navigation';

// Komponen Spinner
function Spinner() {
  return (
    <svg
      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const errorRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      setError('Semua field wajib diisi');
      errorRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Format email tidak valid');
      errorRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi tidak cocok');
      errorRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await apiClient('/register', {
        method: 'POST',
        body: JSON.stringify({
          username,
          email,
          password,
          confirm_password: confirmPassword,
        }),
      });

      alert(data.message || 'Akun berhasil dibuat! Silakan cek email untuk verifikasi.');
      router.push('/login');
    } catch (err) {
      setError(err.message || 'Registrasi gagal. Coba lagi.');
      errorRef.current?.scrollIntoView({ behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      {/* Container utama: tetap di tengah */}
      <FadeIn>
        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Section - Illustration */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-sky-500 to-blue-600 text-white p-8 md:p-10 flex flex-col justify-center items-center">
            <div className="mt-10 w-full flex justify-center">
              <Image
                src="/Mobile-encryption-amico-1.png"
                alt="Register Illustration"
                width={300}
                height={250}
                className="w-full max-w-xs md:max-w-sm h-auto object-contain"
              />
            </div>
          </div>

          {/* Right Section - Register Form */}
          <div className="w-full md:w-1/2 p-8 md:p-10 relative bg-gradient-to-br from-white to-sky-50">
            {/* Logo di latar belakang (transparan) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Image
                  src="/logo.png"
                  alt="Coconut Logo"
                  width={250} // Lebar logo dalam piksel
                  height={340} // Tinggi logo dalam piksel
                  style={{
                    width: "250px", // Tetapkan lebar
                    height: "340px", // Tetapkan tinggi
                    opacity: 0.1, // Atur opasitas agar logo tampak transparan
                    objectFit: "contain", // Menjaga rasio aspek logo
                  }}
                  className="opacity-10"
                />
              </div>

            {/* Konten Form */}
            <div className="relative z-10 space-y-6">
              <SlideUp delay={300}>
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
                  Registrasi
                </h2>
              </SlideUp>

              {/* Error tetap muncul, tapi tidak geser card */}
              {error && (
                <SlideUp delay={400}>
                  <p
                    ref={errorRef}
                    className="text-red-500 text-sm text-center mb-4 bg-red-50 p-3 rounded-lg"
                  >
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
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl shadow-sm 
                                 focus:ring-2 focus:ring-sky-400 focus:border-sky-500 
                                 bg-white text-gray-900 placeholder-gray-500
                                 transition duration-200 ease-in-out
                                 disabled:bg-gray-100"
                      placeholder="Masukkan email"
                      disabled={loading}
                    />
                  </div>
                </SlideUp>

                <SlideUp delay={600}>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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

                <SlideUp delay={650}>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Konfirmasi Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl shadow-sm 
                                 focus:ring-2 focus:ring-sky-400 focus:border-sky-500 
                                 bg-white text-gray-900 placeholder-gray-500
                                 transition duration-200 ease-in-out
                                 disabled:bg-gray-100"
                      placeholder="Ulangi password"
                      disabled={loading}
                    />
                  </div>
                </SlideUp>

                <SlideUp delay={700}>
                  <div className="text-right">
                    <Link href="/forgot-password" className="text-sm text-sky-600 hover:underline hover:text-sky-800 transition">
                      Lupa Password?
                    </Link>
                  </div>
                </SlideUp>

                <SlideUp delay={800}>
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
                        Processing...
                      </>
                    ) : (
                      'Register'
                    )}
                  </button>
                </SlideUp>
              </form>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}