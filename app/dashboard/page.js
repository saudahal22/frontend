// app/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FadeIn, SlideUp } from '../../components/Animations';

export default function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [profile, setProfile] = useState({
    name: 'Saudah Al',
    email: 'saudah@gmail.com',
    role: 'Calon Anggota',
    joinDate: '13 Agustus 2025',
    avatar: '/slider/saudahlatarbiru.png',
  });

  const [resultStatus] = useState('Menunggu Hasil');
  const [scheduleStatus] = useState('Dikonfirmasi');
  const [testSchedule] = useState([
    { date: '15 April 2025', time: '09:00 - 11:00', location: 'Algo cofee dan Snack' },
  ]);

  const [newDate, setNewDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Wawancara Anda telah dikonfirmasi untuk 16 Agustus 2025.', time: '2 jam lalu', read: false },
    { id: 2, message: 'Pengajuan perubahan jadwal sedang diproses.', time: '1 hari lalu', read: true },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(prev => [
        { 
          id: Date.now(), 
          message: 'Jadwal Tes anda akan dilaksanakan 14 Agustus 2025 pukul 09.00 - 17.00 WITA', 
          time: 'Baru', 
          read: false 
        },
        ...prev,
      ]);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmitReschedule = (e) => {
    e.preventDefault();
    if (!newDate || !reason.trim()) {
      setSubmitStatus('Mohon isi tanggal dan alasan.');
      return;
    }
    setSubmitStatus('Terima kasih, permintaan Anda segera diproses oleh panitia.');
    setNewDate('');
    setReason('');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Akses Ditolak</h2>
          <p className="text-gray-600">Anda harus masuk untuk melihat dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <main className="relative overflow-hidden py-24">
        <div className="container mx-auto px-6 max-w-6xl pb-40">
          <FadeIn>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-800 via-sky-600 to-blue-900 bg-clip-text text-transparent leading-tight">
              Dashboard Calon Anggota
            </h1>
            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-16">
              Selamat datang kembali, {profile.name}. Kelola aktivitas dan jadwal Anda di sini.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Kolom Kiri */}
            <div className="lg:col-span-2 space-y-8">
              {/* Informasi Profil */}
              <SlideUp delay={200}>
                <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-8 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
                    <span className="w-2 h-2 bg-sky-500 rounded-full mr-3"></span>
                    Informasi Profil
                  </h2>
                  <div className="flex items-center space-x-6 mb-6">
                    <Image
                      src={profile.avatar}
                      alt="Profil"
                      width={80}
                      height={80}
                      className="rounded-full border-4 border-sky-200"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{profile.name}</h3>
                      <p className="text-gray-600">{profile.email}</p>
                      <p className="text-sm text-blue-600 font-medium">{profile.role}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Tanggal Bergabung</span>
                      <p className="font-medium text-gray-800">{profile.joinDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Status</span>
                      <p className="font-medium text-green-600">Aktif</p>
                    </div>
                  </div>
                </div>
              </SlideUp>

              {/* Status & Kelulusan */}
              <SlideUp delay={300}>
                <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-8 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Status & Hasil Seleksi
                  </h2>
                  <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200 mb-6">
                    <p className="text-lg font-semibold text-blue-800">
                      Jadwal Tes: <span className="text-green-600">{scheduleStatus}</span>
                    </p>
                    <p className="text-gray-700 mt-2">Jadwal Anda telah dikonfirmasi. Siapkan perangkat dan dokumen Anda.</p>
                  </div>
                  <div
                    className={`p-6 rounded-2xl border-l-4 ${
                      resultStatus === 'Lulus'
                        ? 'border-l-green-500 bg-green-50'
                        : resultStatus === 'Tidak Lulus'
                        ? 'border-l-red-500 bg-red-50'
                        : 'border-l-yellow-500 bg-yellow-50'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-800">Hasil Seleksi</h3>
                    <p className="text-lg font-bold mt-1">
                      {resultStatus === 'Lulus' && <span className="text-green-700">🎉 LULUS</span>}
                      {resultStatus === 'Tidak Lulus' && <span className="text-red-700">💔 TIDAK LULUS</span>}
                      {resultStatus === 'Menunggu Hasil' && <span className="text-yellow-700">⏳ MENUNGGU HASIL</span>}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {resultStatus === 'Lulus' && 'Selamat! Anda diterima sebagai anggota Coconut. Cek WhatsApp untuk instruksi selanjutnya.'}
                      {resultStatus === 'Tidak Lulus' && 'Terima kasih atas partisipasi Anda. Tetap semangat dan jangan menyerah!'}
                      {resultStatus === 'Menunggu Hasil' && 'Hasil seleksi akan diumumkan melalui email dan WhatsApp dalam 3-5 hari kerja.'}
                    </p>
                  </div>
                </div>
              </SlideUp>

              {/* Jadwal Tes */}
              <SlideUp delay={400}>
                <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-8 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
                    <span className="w-2 h-2 bg-sky-600 rounded-full mr-3"></span>
                    Jadwal Tes
                  </h2>
                  {testSchedule.map((test, index) => (
                    <div key={index} className="p-5 bg-white/70 rounded-xl border border-sky-100 mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">{test.date}</p>
                          <p className="text-gray-600">{test.time} | {test.location}</p>
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                          Dikonfirmasi
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </SlideUp>

              {/* Pengajuan Ubah Jadwal */}
              <SlideUp delay={500}>
                <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-8 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    Pengajuan Ubah Jadwal Tes
                  </h2>
                  <form onSubmit={handleSubmitReschedule} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Baru</label>
                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Alasan</label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows="3"
                        placeholder="Tuliskan alasan perubahan jadwal..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold px-6 py-2 rounded-full hover:from-sky-600 hover:to-blue-700 transition-all duration-300 shadow"
                    >
                      Ajukan Perubahan
                    </button>
                  </form>
                  {submitStatus && (
                    <p className="mt-4 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">{submitStatus}</p>
                  )}
                </div>
              </SlideUp>
            </div>

            {/* Kolom Kanan: Notifikasi */}
            <SlideUp delay={600}>
              <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-8 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm h-fit">
                <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-sky-700 rounded-full mr-3"></span>
                  Pemberitahuan
                </h2>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {notifications.length === 0 ? (
                    <p className="text-gray-500 text-sm">Tidak ada pemberitahuan.</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 rounded-xl border-l-4 ${
                          notif.read
                            ? 'border-gray-300 bg-gray-50'
                            : 'border-blue-500 bg-blue-50'
                        }`}
                      >
                        <p className={`text-sm ${notif.read ? 'text-gray-700' : 'text-blue-800 font-medium'}`}>
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </SlideUp>
          </div>
        </div>
      </main>
    </div>
  );
}