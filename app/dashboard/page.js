// app/dashboard/page.js
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FadeIn, SlideUp } from '../../components/Animations';

export default function DashboardCalonAnggota() {
  const [profile] = useState({
    name: 'Saudah Al',
    email: 'saudah@gmail.com',
    role: 'Calon Anggota',
    joinDate: '13 Agustus 2025',
    avatar: '/slider/saudahlatarbiru.png',
    status: 'Menunggu Verifikasi',
  });

  const upcomingEvents = [
    { date: '20 Agustus 2025', title: 'Pengerjaan Soal' },
    { date: '25 Agustus 2025', title: 'Tes Wawancara' },
  ];

  const announcements = [
    { title: 'Pastikan nomor telepon dan email yang terdaftar aktif agar mudah dihubungi.' },
    { title: 'Hasil seleksi hanya akan diumumkan melalui dashboard dan email resmi.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 ml-10">
      <main className="relative overflow-hidden py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <FadeIn>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-blue-800 via-sky-600 to-blue-900 bg-clip-text text-transparent leading-tight tracking-tight">
              Dashboard Calon Anggota
            </h1>
            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-16">
              Lihat perkembangan status Calon keanggotaan, jadwal kegiatan, dan informasi terbaru Anda di sini.
            </p>
          </FadeIn>

          {/* Profile Card */}
          <SlideUp delay={200}>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-6 mb-10">
              <Image
                src={profile.avatar}
                alt="Avatar"
                width={80}
                height={80}
                className="rounded-full"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{profile.name}</h2>
                <p className="text-gray-600">{profile.email}</p>
                <p className="text-sm text-gray-500">Bergabung: {profile.joinDate}</p>
                <span
                  className={`mt-2 inline-block px-3 py-1 text-sm rounded-full ${
                    profile.status === 'Dikonfirmasi'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {profile.status}
                </span>
              </div>
            </div>
          </SlideUp>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Progress Status */}
            <SlideUp delay={300}>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Progress Keanggotaan</h2>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-500 h-3 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">40% — Menunggu Verifikasi</p>
                  </div>
                </div>
              </div>
            </SlideUp>

            {/* Upcoming Events */}
            <SlideUp delay={400}>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Anda akan mengikuti 2 tahap tes:</h2>
                <ul className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span className="text-gray-700">{event.title}</span>
                      <span className="text-sm text-gray-500">{event.date}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </SlideUp>
          </div>

          {/* Announcements */}
          <SlideUp delay={500}>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Pengumuman</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {announcements.map((a, index) => (
                  <li key={index}>{a.title}</li>
                ))}
              </ul>
            </div>
          </SlideUp>
        </div>
      </main>
    </div>
  );
}