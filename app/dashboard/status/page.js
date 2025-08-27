// app/dashboard/status/page.js
'use client';

import { useState, useEffect } from 'react';
import { FadeIn, SlideUp } from '../../../components/Animations';
import { apiClient } from '../../../lib/apiClient';

export default function StatusPage() {
  const [isLoggedIn] = useState(true);
  const [status, setStatus] = useState('Menunggu Hasil');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [latestPendaftar, setLatestPendaftar] = useState(null);

  // Ambil status pendaftaran dari backend
  const fetchStatus = async () => {
    try {
      // Ambil semua pendaftar (backend akan filter by userID via JWT)
      const data = await apiClient('/pendaftar/all');
      
      if (!Array.isArray(data)) {
        throw new Error('Respons data tidak valid');
      }

      // Ambil pendaftar terbaru (berdasarkan created_at)
      const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const latest = sorted[0];

      if (latest) {
        setLatestPendaftar(latest);
        setStatus(latest.status);
      } else {
        setStatus('Belum Mendaftar');
      }
    } catch (err) {
      console.error('Gagal muat status:', err);
      setError(err.message);
      setStatus('Gagal Memuat');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    // Dengarkan perubahan (jika admin update dari tab lain)
    const handleStorageChange = () => {
      fetchStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Memuat status seleksi...</p>
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

              {/* Tampilkan Status */}
              <div
                className={`p-6 rounded-2xl border-l-4 ${
                  status === 'diterima'
                    ? 'border-l-green-500 bg-green-50'
                    : status === 'ditolak'
                    ? 'border-l-red-500 bg-red-50'
                    : status === 'pending' || status === 'Menunggu Hasil'
                    ? 'border-l-yellow-500 bg-yellow-50'
                    : 'border-l-gray-500 bg-gray-50'
                }`}
              >
                <h3 className="font-semibold text-gray-800">Status Anda</h3>
                <p className="text-lg font-bold mt-1">
                  {status === 'diterima' && <span className="text-green-700">🎉 LULUS</span>}
                  {status === 'ditolak' && <span className="text-red-700">💔 TIDAK LULUS</span>}
                  {(status === 'pending' || status === 'Menunggu Hasil') && <span className="text-yellow-700">⏳ MENUNGGU HASIL</span>}
                  {status === 'Belum Mendaftar' && <span className="text-gray-700">📝 BELUM DAFTAR</span>}
                  {status === 'Gagal Memuat' && <span className="text-gray-700">⚠️ GAGAL MEMUAT</span>}
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  {status === 'diterima' && (
                    'Selamat! Anda diterima sebagai anggota Coconut. Cek Email untuk instruksi selanjutnya.'
                  )}
                  {status === 'ditolak' && (
                    'Terima kasih atas partisipasi Anda. Tetap semangat dan jangan menyerah!'
                  )}
                  {(status === 'pending' || status === 'Menunggu Hasil') && (
                    'Hasil seleksi akan diumumkan melalui email dalam waktu 3 - 5 hari.'
                  )}
                  {status === 'Belum Mendaftar' && (
                    'Anda belum pernah mendaftar. Silakan isi formulir pendaftaran untuk mengikuti seleksi.'
                  )}
                  {status === 'Gagal Memuat' && (
                    'Gagal memuat status. Periksa koneksi atau coba lagi nanti.'
                  )}
                </p>
              </div>

              {/* Detail Pendaftar (opsional) */}
              {latestPendaftar && (
                <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-600">
                  <p><strong>Nama:</strong> {latestPendaftar.nama_lengkap}</p>
                  <p><strong>Kampus:</strong> {latestPendaftar.asal_kampus}</p>
                  <p><strong>Program Studi:</strong> {latestPendaftar.prodi}</p>
                  <p><strong>Tanggal Daftar:</strong> {new Date(latestPendaftar.created_at).toLocaleDateString('id-ID')}</p>
                </div>
              )}

              {/* Tombol ke Formulir jika belum daftar */}
              {status === 'Belum Mendaftar' && (
                <div className="mt-6 text-center">
                  <a
                    href="/register"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium"
                  >
                    Daftar Sekarang
                  </a>
                </div>
              )}
            </div>
          </SlideUp>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}