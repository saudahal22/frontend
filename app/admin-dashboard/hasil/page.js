// app/admin-dashboard/hasil/page.js
'use client';

import { useState, useEffect } from 'react';
import { FadeIn, SlideUp } from '../../../components/Animations';
import { apiClient } from '../../../lib/apiClient';

export default function AdminHasilPage() {
  const [hasil, setHasil] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHasil = async () => {
    try {
      const data = await apiClient('/test/hasil');
      setHasil(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Gagal memuat hasil tes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHasil();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Memuat hasil tes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        <FadeIn>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-900 mb-2">📊 Hasil Tes Seleksi</h1>
          <p className="text-center text-gray-600 mb-8">Lihat hasil semua peserta tes.</p>
        </FadeIn>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-800 rounded-lg text-center text-sm animate-fade-in">
            {error}
          </div>
        )}

        <SlideUp delay={200}>
          <div className="bg-white rounded-2xl shadow-xl border border-white/50 backdrop-blur-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">📋 Daftar Hasil Tes</h2>
            </div>

            {/* Tabel untuk Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-sky-50/50 text-gray-700 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3">User ID</th>
                    <th className="px-6 py-3">Pendaftar ID</th>
                    <th className="px-6 py-3">Skor Benar</th>
                    <th className="px-6 py-3">Skor Salah</th>
                    <th className="px-6 py-3">Nilai</th>
                    <th className="px-6 py-3">Waktu Mulai</th>
                    <th className="px-6 py-3">Waktu Selesai</th>
                    <th className="px-6 py-3">Durasi (menit)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100">
                  {hasil.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-gray-500 text-sm">
                        Belum ada peserta yang menyelesaikan tes.
                      </td>
                    </tr>
                  ) : (
                    hasil.map((h, i) => (
                      <tr key={i} className="hover:bg-sky-50/40 transition">
                        <td className="px-6 py-4 text-xs sm:text-sm">{h.user_id}</td>
                        <td className="px-6 py-4 text-xs sm:text-sm">{h.pendaftar_id}</td>
                        <td className="px-6 py-4 text-xs sm:text-sm">{h.skor_benar}</td>
                        <td className="px-6 py-4 text-xs sm:text-sm">{h.skor_salah}</td>
                        <td className="px-6 py-4 font-bold text-xs sm:text-sm">{h.nilai.toFixed(2)}</td>
                        <td className="px-6 py-4 text-xs sm:text-sm">{h.waktu_mulai}</td>
                        <td className="px-6 py-4 text-xs sm:text-sm">{h.waktu_selesai || '-'}</td>
                        <td className="px-6 py-4 text-xs sm:text-sm">{h.durasi_menit || '-'}</td>
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
                  <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800 text-sm">User ID: {h.user_id}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          h.nilai >= 70
                            ? 'bg-green-100 text-green-800'
                            : h.nilai >= 50
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        Nilai: {h.nilai.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">Pendaftar ID: {h.pendaftar_id}</p>
                    <p className="text-xs text-gray-600">Skor: {h.skor_benar} benar, {h.skor_salah} salah</p>
                    <p className="text-xs text-gray-600">Mulai: {h.waktu_mulai}</p>
                    <p className="text-xs text-gray-600">Selesai: {h.waktu_selesai || 'Belum selesai'}</p>
                    <p className="text-xs text-gray-600">Durasi: {h.durasi_menit || '-'} menit</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </SlideUp>
      </div>

      {/* Animasi */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}