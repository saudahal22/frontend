'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FadeIn, SlideUp } from '../../components/Animations';
import { apiClient } from '../../lib/apiClient';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyPage() {
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('Memverifikasi email...');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token verifikasi tidak ditemukan.');
      return;
    }

    const verify = async () => {
      try {
        await apiClient(`/verify?token=${token}`, {
          method: 'GET',
        });
        setStatus('success');
        setMessage('Email Anda berhasil diverifikasi! Silakan login.');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Token verifikasi tidak valid atau sudah kadaluarsa.');
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <FadeIn>
        <div className="w-full max-w-4xl h-auto md:h-[600px] bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Section - Illustration */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-sky-500 to-blue-600 text-white p-8 md:p-10 flex flex-col justify-center items-center">
            <div className="mt-10 w-full flex justify-center">
              <Image
                src="/Mobile-encryption-amico-1.png"
                alt="Verify Email Illustration"
                width={300}
                height={250}
                className="w-full max-w-xs md:max-w-sm h-auto object-contain"
              />
            </div>
          </div>

          {/* Right Section - Status */}
          <div className="w-full md:w-1/2 p-8 md:p-10 relative bg-gradient-to-br from-white to-sky-50 flex flex-col justify-center">
            {/* Logo di latar belakang */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Image
                src="/logo.png"
                alt="Coconut Logo"
                width={120}
                height={120}
                style={{ width: '250px', height: '280px' }}
                className="opacity-10"
              />
            </div>

            <div className="relative z-10 text-center">
              <SlideUp delay={300}>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  Verifikasi Email
                </h2>
              </SlideUp>

              {status === 'loading' && (
                <div className="flex justify-center mb-4">
                  <div className="animate-spin h-8 w-8 border-4 border-sky-500 border-t-transparent rounded-full"></div>
                </div>
              )}

              <SlideUp delay={500}>
                <p
                  className={
                    status === 'success'
                      ? 'text-green-500 bg-green-50 p-4 rounded-lg text-sm'
                      : status === 'error'
                      ? 'text-red-500 bg-red-50 p-4 rounded-lg text-sm'
                      : 'text-gray-600'
                  }
                >
                  {message}
                </p>
              </SlideUp>

              <SlideUp delay={700} className="mt-6">
                <Link
                  href="/login"
                  className="text-sm text-sky-700 hover:text-sky-900 font-medium hover:underline transition-all"
                >
                  Kembali ke Login
                </Link>
              </SlideUp>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}