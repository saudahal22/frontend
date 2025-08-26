// app/admin-dashboard/schedule/page.js
'use client';

import { useState, useEffect } from 'react';
import { FadeIn, SlideUp } from '../../../components/Animations';

export default function AdminSchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    date: '',
    time: '',
    location: '',
    keterangan: '',
  });
  const [editId, setEditId] = useState(null);
  const [submitStatus, setSubmitStatus] = useState('');

  // Load dari localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('coconut_test_schedules')) || [];
    setSchedules(saved);
  }, []);

  // Simpan ke localStorage
  const saveToStorage = (data) => {
    try {
      localStorage.setItem('coconut_test_schedules', JSON.stringify(data));
      setSchedules(data);
      setSubmitStatus('Jadwal berhasil disimpan!');
      setTimeout(() => setSubmitStatus(''), 5000);
    } catch (error) {
      console.error('Gagal simpan ke localStorage:', error);
      setSubmitStatus('Gagal menyimpan jadwal.');
    }
  };

  // Handle submit (tambah/edit)
  const handleSubmit = (e) => {
    e.preventDefault();
    const { date, time, location, keterangan } = newSchedule;

    if (!date || !time || !location || !keterangan) {
      setSubmitStatus('Semua kolom wajib diisi.');
      return;
    }

    const schedule = {
      id: editId || Date.now(),
      date,
      time,
      location,
      keterangan,
    };

    const updated = editId
      ? schedules.map(s => (s.id === editId ? schedule : s))
      : [schedule, ...schedules];

    saveToStorage(updated);

    // Reset form
    setNewSchedule({ date: '', time: '', location: '', keterangan: '' });
    setEditId(null);
    setSubmitStatus(editId ? 'Jadwal diperbarui.' : 'Jadwal baru ditambahkan.');
  };

  // Edit jadwal
  const handleEdit = (schedule) => {
    setEditId(schedule.id);
    setNewSchedule({
      date: schedule.date,
      time: schedule.time,
      location: schedule.location,
      keterangan: schedule.keterangan,
    });
  };

  // Hapus jadwal
  const handleDelete = (id) => {
    const filtered = schedules.filter(s => s.id !== id);
    saveToStorage(filtered);
    setSubmitStatus('Jadwal dihapus.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-900 mb-4">
            📅 Kelola Jadwal Tes
          </h1>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Tambah, edit, atau hapus jadwal tes yang akan muncul di halaman calon anggota.
          </p>
        </FadeIn>

        {submitStatus && (
          <div className="mb-8 p-4 text-sm rounded-lg bg-blue-100 text-blue-800 border border-blue-200 text-center">
            {submitStatus}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form Tambah/Edit Jadwal */}
          <SlideUp delay={200}>
            <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-6 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-blue-900 mb-6">
                {editId ? '✏️ Edit Jadwal' : '➕ Tambah Jadwal Baru'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                  <input
                    type="text"
                    value={newSchedule.date}
                    onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                    placeholder="Contoh: 20 Agustus 2025"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Waktu</label>
                  <input
                    type="text"
                    value={newSchedule.time}
                    onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                    placeholder="Contoh: 09:00 - 11:00"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
                  <input
                    type="text"
                    value={newSchedule.location}
                    onChange={(e) => setNewSchedule({ ...newSchedule, location: e.target.value })}
                    placeholder="Contoh: Algo Cofee dan Snack"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                  <input
                    type="text"
                    value={newSchedule.keterangan}
                    onChange={(e) => setNewSchedule({ ...newSchedule, keterangan: e.target.value })}
                    placeholder="Contoh: Tes Soal / Tes Wawancara"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-sm"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-sky-600 text-white font-semibold py-3 rounded-full hover:from-blue-600 hover:to-sky-700 transition"
                  >
                    {editId ? 'Perbarui Jadwal' : 'Tambah Jadwal'}
                  </button>
                  {editId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditId(null);
                        setNewSchedule({ date: '', time: '', location: '', keterangan: '' });
                      }}
                      className="px-4 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>
          </SlideUp>

          {/* Daftar Jadwal */}
          <SlideUp delay={300}>
            <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-6 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-blue-900 mb-6">
                🗓️ Daftar Jadwal ({schedules.length})
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {schedules.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Belum ada jadwal.</p>
                ) : (
                  schedules.map((s, index) => (
                    <div
                      key={s.id}
                      className="p-4 bg-white/70 rounded-xl border border-sky-100 hover:shadow-md transition group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-gray-800">{s.date}</p>
                          <p className="text-sm text-gray-600">{s.time} | {s.location}</p>
                          <p className="text-sm text-blue-700 mt-1">📌 {s.keterangan}</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => handleEdit(s)}
                            className="text-blue-500 hover:text-blue-700 text-sm"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            ❌
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </SlideUp>
        </div>
      </div>
    </div>
  );
}