// app/dashboard/status/page.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FadeIn, SlideUp } from '../../../components/Animations';

export default function StatusPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [resultStatus, setResultStatus] = useState('Menunggu Hasil');

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Akses Ditolak</h2>
          <p className="text-gray-600">Anda harus masuk untuk melihat status seleksi.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <main className="relative overflow-hidden py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <FadeIn>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-blue-800 via-sky-600 to-blue-900 bg-clip-text text-transparent leading-tight tracking-tight">
              Status Seleksi
            </h1>
            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-16">
              Hasil seleksi akan diumumkan melalui email dalam 3-5 hari.
            </p>
          </FadeIn>

          <SlideUp delay={200}>
            <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">Hasil Seleksi</h2>
              <div
                className={`p-6 rounded-2xl border-l-4 ${
                  resultStatus === 'Lulus'
                    ? 'border-l-green-500 bg-green-50'
                    : resultStatus === 'Tidak Lulus'
                    ? 'border-l-red-500 bg-red-50'
                    : 'border-l-yellow-500 bg-yellow-50'
                }`}
              >
                <h3 className="font-semibold text-gray-800">Status Anda</h3>
                <p className="text-lg font-bold mt-1">
                  {resultStatus === 'Lulus' && <span className="text-green-700">🎉 LULUS</span>}
                  {resultStatus === 'Tidak Lulus' && <span className="text-red-700">💔 TIDAK LULUS</span>}
                  {resultStatus === 'Menunggu Hasil' && <span className="text-yellow-700">⏳ MENUNGGU HASIL</span>}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {resultStatus === 'Lulus' && 'Selamat! Anda diterima sebagai anggota Coconut. Cek Email untuk instruksi selanjutnya.'}
                  {resultStatus === 'Tidak Lulus' && 'Terima kasih atas partisipasi Anda. Tetap semangat dan jangan menyerah!'}
                  {resultStatus === 'Menunggu Hasil' && 'Hasil seleksi akan diumumkan melalui email dalam waktu 3 - 5 hari.'}
                </p>
              </div>
            </div>
          </SlideUp>
        </div>
      </main>
    </div>
  );
}