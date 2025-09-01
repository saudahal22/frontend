// app/dashboard/schedule/ScheduleClient.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FadeIn, SlideUp } from '../../../components/Animations';
import { apiClient } from '../../../lib/apiClient';
import { getUserRole, decodeToken } from '../../../lib/auth';

export default function ScheduleClient() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    idJadwal: '',
    tanggalDiajukan: '',
    jamMulaiDiajukan: '',
    jamSelesaiDiajukan: '',
    alasanPerubahan: '',
  });

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const role = getUserRole();
    if (role !== 'user') {
      alert('Akses ditolak: halaman ini hanya untuk user.');
      router.push('/admin-dashboard');
      return;
    }

    const claims = decodeToken(token);
    const userID = claims?.id_user;

    if (!userID) {
      setError('Gagal memuat data pengguna.');
      setLoading(false);
      return;
    }

    fetchSchedules();
  }, [router]);

  const fetchSchedules = async () => {
    try {
      const data = await apiClient('/jadwal/user');
      setSchedules(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'jamMulaiDiajukan' || name === 'jamSelesaiDiajukan') {
      if (value.length > 5) {
        newValue = value.slice(0, 5);
      }
    }

    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    const { idJadwal, alasanPerubahan, tanggalDiajukan, jamMulaiDiajukan, jamSelesaiDiajukan } = formData;

    if (!idJadwal) {
      alert('Pilih jadwal yang ingin diubah.');
      return;
    }

    if (!alasanPerubahan || alasanPerubahan.trim().length < 10) {
      alert('Alasan perubahan harus minimal 10 karakter.');
      return;
    }

    const formatTime = (time) => {
      if (!time) return null;
      return time.length === 5 ? `${time}:00` : time;
    };

    const body = {
      id_jadwal: parseInt(idJadwal),
      alasan_perubahan: alasanPerubahan.trim(),
      tanggal_diajukan: tanggalDiajukan || null,
      jam_mulai_diajukan: jamMulaiDiajukan ? formatTime(jamMulaiDiajukan) : null,
      jam_selesai_diajukan: jamSelesaiDiajukan ? formatTime(jamSelesaiDiajukan) : null,
    };

    try {
      await apiClient('/jadwal/ajukan', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      alert('Pengajuan berhasil dikirim!');
      setFormData({
        idJadwal: '',
        tanggalDiajukan: '',
        jamMulaiDiajukan: '',
        jamSelesaiDiajukan: '',
        alasanPerubahan: '',
      });
      fetchSchedules();
    } catch (err) {
      if (err.message.includes('Bukan jadwal Anda')) {
        setError('Anda tidak bisa mengubah jadwal ini.');
      } else if (err.message.includes('min')) {
        setError('Alasan perubahan harus minimal 10 karakter.');
      } else {
        setError(err.message);
      }
    }
  };

  const handleCancelRequest = async (idJadwal) => {
    if (!window.confirm('Batalkan pengajuan perubahan jadwal?')) return;

    try {
      await apiClient(`/jadwal/cancel-perubahan?id_jadwal=${idJadwal}`, {
        method: 'DELETE',
      });
      alert('Pengajuan dibatalkan');
      fetchSchedules();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Memuat jadwal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
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
              Jadwal Tes
            </h1>
            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-16">
              Jadwal tes yang telah dikonfirmasi. Pastikan Anda hadir tepat waktu.
            </p>
          </FadeIn>

          <SlideUp delay={200}>
            <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-8 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm mb-10">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">📅 Jadwal Anda</h2>
              {schedules.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Belum ada jadwal.</p>
              ) : (
                schedules.map((j) => (
                  <div key={j.id_jadwal} className="p-6 bg-white/70 rounded-xl border border-sky-100 mb-4 text-gray-900">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{j.tanggal?.split('T')[0]}</p>
                        <p>{j.jam_mulai} - {j.jam_selesai} | {j.tempat}</p>
                        <p>Status: {j.konfirmasi_jadwal === 'dikonfirmasi' ? '✅ Dikonfirmasi' : '⏳ Menunggu'}</p>
                        {j.catatan && <p className="text-sm mt-1"><strong>Catatan:</strong> {j.catatan}</p>}
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        j.konfirmasi_jadwal === 'dikonfirmasi' ? 'bg-green-100 text-green-800' :
                        j.konfirmasi_jadwal === 'ditolak' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {j.konfirmasi_jadwal}
                      </span>
                    </div>

                    {j.pengajuan_perubahan && (
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                        <p><strong>Pengajuan Ubah Jadwal:</strong></p>
                        <p>Dari: {j.jam_mulai} → {j.jam_mulai_diajukan || 'Tidak diubah'}</p>
                        <p>Tanggal: {j.tanggal_diajukan?.split('T')[0] || 'Tidak diubah'}</p>
                        <p>Alasan: {j.alasan_perubahan}</p>
                        <button
                          onClick={() => handleCancelRequest(j.id_jadwal)}
                          className="mt-2 text-red-600 text-xs hover:underline"
                        >
                          Batalkan Pengajuan
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </SlideUp>

          <SlideUp delay={300}>
            <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-8 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm mb-10">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">🔄 Ajukan Ubah Jadwal</h2>
              <form onSubmit={handleSubmitRequest} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Jadwal</label>
                  <select
                    name="idJadwal"
                    value={formData.idJadwal}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-gray-900"
                  >
                    <option value="">Pilih jadwal...</option>
                    {schedules
                      .filter(s => !s.pengajuan_perubahan)
                      .map((s) => (
                        <option key={s.id_jadwal} value={s.id_jadwal}>
                          {s.tempat} - {s.tanggal?.split('T')[0]}, {s.jam_mulai}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Baru (opsional)</label>
                    <input
                      type="date"
                      name="tanggalDiajukan"
                      value={formData.tanggalDiajukan}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Mulai Baru (opsional)</label>
                    <input
                      type="time"
                      name="jamMulaiDiajukan"
                      value={formData.jamMulaiDiajukan}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Selesai Baru (opsional)</label>
                    <input
                      type="time"
                      name="jamSelesaiDiajukan"
                      value={formData.jamSelesaiDiajukan}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alasan Pengajuan</label>
                  <textarea
                    name="alasanPerubahan"
                    value={formData.alasanPerubahan}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Minimal 10 karakter..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none resize-none text-gray-900"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-3 rounded-full hover:from-amber-600 hover:to-orange-700 transition shadow-md"
                >
                  Kirim Pengajuan
                </button>
              </form>
            </div>
          </SlideUp>
        </div>
      </main>
    </div>
  );
}
