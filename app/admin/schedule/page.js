'use client';

import { useState } from 'react';


export default function SchedulePage() {
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', location: '' });

  const [events, setEvents] = useState([
    { id: 1, title: 'Tes Tulis', date: '15 April 2025', time: '09:00 - 11:00', location: 'Algo Cofee dan Snack' },
    { id: 2, title: 'Wawancara', date: '12 Desember 2025', time: '13:00 - 17:00', location: 'Coconut Lab' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location) return;
    setEvents([{ id: Date.now(), ...newEvent }, ...events]);
    setNewEvent({ title: '', date: '', time: '', location: '' });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 pt-20 px-6 py-10">
        <div className="max-w-7xl mx-auto p-10">
          <h1 className="text-3xl font-bold text-blue-900 mb-6">Jadwal Tes</h1>
          <p className="text-gray-600 mb-8">Kelola jadwal tes calon anggota.</p>

          {/* Tambah Jadwal */}
          <div className="bg-white/90 p-8 rounded-2xl shadow-lg border border-white/50 backdrop-blur-sm mb-10">
            <h2 className="text-xl font-semibold mb-4">Tambah Jadwal Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Judul</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400"
                  placeholder="Contoh: Tes Wawancara"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Waktu</label>
                <input
                  type="text"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400"
                  placeholder="Contoh: 09:00 - 11:00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Lokasi</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400"
                  placeholder="Contoh: Algo Cofee dan Snack"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-6 py-2 rounded-full"
              >
                Tambah Jadwal
              </button>
            </form>
          </div>

          {/* Daftar Jadwal */}
          <div className="space-y-4">
            {events.map((e) => (
              <div key={e.id} className="p-6 bg-white/90 rounded-xl border border-sky-100 hover:shadow-md transition">
                <h3 className="font-semibold text-gray-800">{e.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{e.date} | {e.time}</p>
                <p className="text-sm text-gray-500">{e.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}