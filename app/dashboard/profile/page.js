// app/dashboard/profile/page.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FadeIn, SlideUp } from '../../../components/Animations';

export default function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [profile, setProfile] = useState({
    name: 'Saudah Al',
    email: 'saudah@gmail.com',
    role: 'Calon Anggota',
    joinDate: '13 Agustus 2025',
    asalKampus: 'Universitas Hasanuddin',
    prodi: 'Teknik Informatika',
    semester: '3',
    noWa: '08123456789',
    avatar: '/slider/saudahlatarbiru.png',
  });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Akses Ditolak</h2>
          <p className="text-gray-600">Anda harus masuk untuk melihat profil.</p>
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
              Profil Saya
            </h1>
            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-16">
              Informasi pribadi Anda yang telah diisi saat mendaftar.
            </p>
          </FadeIn>

          <SlideUp delay={200}>
            <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <Image
                  src={profile.avatar}
                  alt="Profil"
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-sky-200 w-32 h-32 object-cover"
                />
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
                  <p className="text-gray-600">{profile.email}</p>
                  <p className="text-sm text-blue-600 font-medium">{profile.role}</p>
                  <p className="text-sm text-gray-500 mt-1">Tanggal Bergabung: {profile.joinDate}</p>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Asal Kampus</h3>
                  <p className="text-gray-700">{profile.asalKampus}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Program Studi</h3>
                  <p className="text-gray-700">{profile.prodi}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Semester</h3>
                  <p className="text-gray-700">{profile.semester}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Nomor WhatsApp</h3>
                  <p className="text-gray-700">{profile.noWa}</p>
                </div>
              </div>
            </div>
          </SlideUp>
        </div>
      </main>
    </div>
  );
}