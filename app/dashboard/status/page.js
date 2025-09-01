// app/dashboard/status/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FadeIn, SlideUp } from '../../../components/Animations';
import { apiClient } from '../../../lib/apiClient';

export default function StatusPage() {
  const [status, setStatus] = useState('Menunggu Hasil');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [latestPendaftar, setLatestPendaftar] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  // 🔐 Cek token dan ambil data
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      // Decode JWT untuk cek expired
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;

      if (Date.now() > exp) {
        localStorage.removeItem('token');
        alert('Sesi telah berakhir. Silakan login kembali.');
        router.push('/login');
        return;
      }

      // Cek role (opsional: cegah admin masuk halaman user)
      if (payload.role === 'admin') {
        alert('Halaman ini hanya untuk peserta.');
        router.push('/admin-dashboard');
        return;
      }

      setIsLoggedIn(true);
      fetchMyPendaftar();
    } catch (err) {
      console.error('Token tidak valid:', err);
      localStorage.removeItem('token');
      alert('Token tidak valid. Silakan login kembali.');
      router.push('/login');
    }
  }, [router]);

  const fetchMyPendaftar = async () => {
    try {
      setLoading(true);
      setError('');
      
      // ✅ Gunakan endpoint khusus user
      const data = await apiClient('/pendaftar/my');

      if (!Array.isArray(data)) {
        throw new Error('Data respons tidak valid');
      }

      if (data.length > 0) {
        const latest = data[0];
        setLatestPendaftar(latest);
        setStatus(latest.status);
      } else {
        setStatus('Belum Mendaftar');
      }
    } catch (err) {
      console.error('Gagal memuat status:', err);
      // Jika error karena 401/403, sudah dihandle di apiClient
      setError(err.message || 'Gagal memuat status');
      setStatus('Gagal Memuat');
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = () => {
    fetchMyPendaftar();
  };

  // Tampilkan loading saat pengecekan token
  if (!isLoggedIn || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Memuat status...</p>
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
              Hasil seleksi akan diumumkan dalam 3–5 hari kerja.
            </p>
          </FadeIn>

          <SlideUp delay={200}>
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">Status Pendaftaran Anda</h2>

              {/* Status Card */}
              <div
                className={`p-6 rounded-2xl border-l-4 font-medium ${
                  status === 'diterima'
                    ? 'border-l-green-500 bg-green-50 text-green-800'
                    : status === 'ditolak'
                    ? 'border-l-red-500 bg-red-50 text-red-800'
                    : status === 'pending'
                    ? 'border-l-yellow-500 bg-yellow-50 text-yellow-800'
                    : 'border-l-gray-500 bg-gray-50 text-gray-800'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {status === 'diterima' && (
                    <span className="text-2xl">🎉</span>
                  )}
                  {status === 'ditolak' && (
                    <span className="text-2xl">💔</span>
                  )}
                  {status === 'pending' && (
                    <span className="text-2xl">⏳</span>
                  )}
                  {status === 'Belum Mendaftar' && (
                    <span className="text-2xl">📝</span>
                  )}
                  {status === 'Gagal Memuat' && (
                    <span className="text-2xl">⚠️</span>
                  )}
                  <span className="text-xl font-bold">
                    {status === 'diterima' && 'LULUS'}
                    {status === 'ditolak' && 'TIDAK LULUS'}
                    {status === 'pending' && 'MENUNGGU HASIL'}
                    {status === 'Belum Mendaftar' && 'BELUM DAFTAR'}
                    {status === 'Gagal Memuat' && 'GAGAL MEMUAT'}
                  </span>
                </div>

                <p className="text-sm">
                  {status === 'diterima' && (
                    <>Selamat! Anda diterima sebagai anggota Coconut. Instruksi selanjutnya akan diumumkan melalui website.</>
                  )}
                  {status === 'ditolak' && (
                    <>Terima kasih atas partisipasi Anda. Kami sangat menghargai usaha Anda. Tetap semangat!</>
                  )}
                  {status === 'pending' && (
                    <>Hasil seleksi akan diumumkan dalam waktu 3–5 hari kerja. Harap cek website secara berkala.</>
                  )}
                  {status === 'Belum Mendaftar' && (
                    <>Anda belum pernah mendaftar. Isi formulir pendaftaran untuk mengikuti seleksi.</>
                  )}
                  {status === 'Gagal Memuat' && (
                    <>Gagal memuat status. Periksa koneksi atau coba lagi nanti.</>
                  )}
                </p>
              </div>

              {/* Detail Pendaftar (jika ada) */}
              {latestPendaftar && (
                <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-600 space-y-2">
                  <p><strong>Nama:</strong> {latestPendaftar.nama_lengkap}</p>
                  <p><strong>Kampus:</strong> {latestPendaftar.asal_kampus}</p>
                  <p><strong>Program Studi:</strong> {latestPendaftar.prodi}</p>
                  <p><strong>Semester:</strong> {latestPendaftar.semester}</p>
                  <p><strong>Tanggal Daftar:</strong> {new Date(latestPendaftar.created_at).toLocaleDateString('id-ID')}</p>
                </div>
              )}

              {/* Tombol Aksi */}
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                {status === 'Belum Mendaftar' && (
                  <a
                    href="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium transition"
                  >
                    Daftar Sekarang
                  </a>
                )}

                {status === 'Gagal Memuat' && (
                  <button
                    onClick={handleRefresh}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-full text-sm font-medium transition"
                  >
                    Muat Ulang
                  </button>
                )}
              </div>
            </div>
          </SlideUp>

          {/* Error Message */}
          {error && status === 'Gagal Memuat' && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}