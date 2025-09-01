'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FadeIn, SlideUp } from '../../../components/Animations';
import { apiClient } from '../../../lib/apiClient';
import { getUserRole } from '../../../lib/auth';

export default function AdminHasilPage() {
  const [hasil, setHasil] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();

  // 🔐 Cek role
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const role = getUserRole();
    if (!role) {
      router.push('/login');
      return;
    }

    if (role !== 'admin') {
      alert('Akses ditolak: Halaman ini hanya untuk admin.');
      router.push('/dashboard');
      return;
    }

    fetchHasil();
  }, [router]);

  const fetchHasil = async () => {
    try {
      setLoading(true);
      const data = await apiClient('/test/hasil');
      setHasil(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Gagal memuat hasil tes');
    } finally {
      setLoading(false);
    }
  };
  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600 font-medium">Memuat hasil tes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center p-6">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <p className="text-red-600 text-lg font-semibold">❌ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        <FadeIn>
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">📊 Hasil Tes Seleksi</h1>
          <p className="text-center text-gray-600 mb-8">Lihat hasil semua peserta tes.</p>
        </FadeIn>

        <SlideUp delay={200}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">📋 Daftar Hasil Tes</h2>
            </div>

            {/* Tabel untuk Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-sky-100 text-gray-800 uppercase text-sm font-semibold">
                  <tr>
                    <th className="px-6 py-4 text-left">Nama Pendaftar</th>
                    <th className="px-6 py-4 text-right">Skor Benar</th>
                    <th className="px-6 py-4 text-right">Skor Salah</th>
                    <th className="px-6 py-4 text-right">Nilai</th>
                    <th className="px-6 py-4 text-center">Waktu Mulai</th>
                    <th className="px-6 py-4 text-center">Selesai</th>
                    <th className="px-6 py-4 text-center">Durasi (menit)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {hasil.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-10 text-center text-gray-500 text-sm">
                        Belum ada peserta yang menyelesaikan tes.
                      </td>
                    </tr>
                  ) : (
                    hasil.map((h, i) => (
                      <tr key={i} className="hover:bg-sky-50 transition duration-150">
                        <td className="px-6 py-4 font-semibold text-gray-800">{h.pendaftar_name}</td>
                        <td className="px-6 py-4 text-right text-gray-700">{h.skor_benar}</td>
                        <td className="px-6 py-4 text-right text-gray-700">{h.skor_salah}</td>
                        <td
                          className={`px-6 py-4 text-right font-bold ${
                            h.nilai >= 75
                              ? 'text-green-700'
                              : h.nilai >= 50
                              ? 'text-yellow-600'
                              : 'text-red-700'
                          }`}
                        >
                          {h.nilai.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center text-xs text-gray-500 tabular-nums">
                          {h.waktu_mulai}
                        </td>
                        <td className="px-6 py-4 text-center text-xs text-gray-500 tabular-nums">
                          {h.waktu_selesai || '-'}
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-sm bg-gray-100 text-gray-800 rounded-lg w-20">
                          {h.durasi_menit || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Card untuk Mobile */}
            <div className="md:hidden divide-y divide-gray-200 p-4 space-y-4">
              {hasil.length === 0 ? (
                <p className="text-center text-gray-500 py-6 text-sm">Belum ada peserta yang menyelesaikan tes.</p>
              ) : (
                hasil.map((h, i) => (
                  <div key={i} className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-800 text-lg mb-3">{h.pendaftar_name}</h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Skor:</span>
                        <span>{h.skor_benar} benar, {h.skor_salah} salah</span>
                      </div>

                      <div className="flex justify-between font-bold text-lg">
                        <span>Nilai:</span>
                        <span
                          className={
                            h.nilai >= 75
                              ? 'text-green-700'
                              : h.nilai >= 50
                              ? 'text-yellow-600'
                              : 'text-red-700'
                          }
                        >
                          {h.nilai.toFixed(2)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 mt-3">
                        <div><strong>Mulai:</strong> {h.waktu_mulai}</div>
                        <div><strong>Selesai:</strong> {h.waktu_selesai || 'Belum'}</div>
                        <div><strong>Durasi:</strong> {h.durasi_menit || '-'} menit</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </SlideUp>

        {/* Refresh Button */}
        <div className="mt-6 text-center">
          <button
            onClick={fetchHasil}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-full text-sm font-medium transition"
          >
            🔁 Muat Ulang
          </button>
        </div>
      </div>

      {/* Styling Tambahan */}
      <style jsx>{`
        @media (max-width: 768px) {
          .text-lg {
            font-size: 1rem;
          }
        }
        .tabular-nums {
          font-variant-numeric: tabular-nums;
        }
        table {
          border-collapse: separate;
          border-spacing: 0;
        }
        th:first-child, td:first-child {
          border-top-left-radius: 0.75rem;
          border-bottom-left-radius: 0.75rem;
        }
        th:last-child, td:last-child {
          border-top-right-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
        }
      `}</style>
    </div>
  );
}