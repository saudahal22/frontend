'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FadeIn, SlideUp } from '../../components/Animations';
import { apiClient } from '../../lib/apiClient';
import { useRouter, useSearchParams } from 'next/navigation';

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

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const errorRef = useRef(null);
  const successRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('Semua field wajib diisi');
      errorRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi tidak cocok');
      errorRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (password.length < 8) {
      setError('Password minimal 8 karakter');
      errorRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      const data = await apiClient('/reset-password', {
        method: 'PUT',
        body: JSON.stringify({
          token,
          new_password: password,
          confirm_new_password: confirmPassword,
        }),
      });

      setSuccess(data.message || 'Password berhasil direset. Silakan login.');
      setPassword('');
      setConfirmPassword('');

      // Redirect ke login setelah 3 detik
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Gagal mereset password. Token mungkin sudah kadaluarsa.');
      errorRef.current?.scrollIntoView({ behavior: 'smooth' });
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
                alt="Reset Password Illustration"
                width={300}
                height={250}
                className="w-full max-w-xs md:max-w-sm h-auto object-contain"
              />
            </div>
          </div>

          {/* Right Section - Form */}
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
                  Reset Password
                </h2>
              </SlideUp>

              <p className="text-center text-gray-600 mb-6 text-sm">
                Masukkan password baru Anda untuk mereset password.
              </p>

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

              {success && (
                <SlideUp delay={400}>
                  <p
                    ref={successRef}
                    className="text-green-500 text-sm text-center mb-4 bg-green-50 p-3 rounded-lg"
                  >
                    {success}
                  </p>
                </SlideUp>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <SlideUp delay={500}>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password Baru
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
                      placeholder="Masukkan password baru"
                      disabled={loading}
                    />
                  </div>
                </SlideUp>

                <SlideUp delay={600}>
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
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
                      placeholder="Ulangi password baru"
                      disabled={loading}
                    />
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
                        Memproses...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </SlideUp>
              </form>

              <SlideUp delay={800}>
                <div className="text-center mt-8">
                  <p className="text-sm text-gray-600">
                    Ingat password?{' '}
                    <Link
                      href="/login"
                      className="text-sky-700 hover:text-sky-900 font-medium hover:underline hover:underline-offset-2 transition-all duration-150"
                    >
                      Kembali ke Login
                    </Link>
                  </p>
                </div>
              </SlideUp>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}