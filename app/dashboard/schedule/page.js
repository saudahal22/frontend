// app/dashboard/schedule/page.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FadeIn, SlideUp } from '../../../components/Animations';

export default function SchedulePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const [testSchedule] = useState([
    { date: '20 Agustus 2025', time: '09:00 - 11:00', location: 'Algo Cofee dan Snack' , keterangan: 'Tes Soal'},
    { date: '25 Agustus 2025', time: '13:00 - 15:00', location: 'Algo Cofee dan Snack', keterangan: 'Tes Wawancara' },
  ]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Akses Ditolak</h2>
          <p className="text-gray-600">Anda harus masuk untuk melihat jadwal.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 ml-10">
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
            <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">Daftar Jadwal Tes</h2>
              {testSchedule.map((test, index) => (
                <div key={index} className="p-6 bg-white/70 rounded-xl border border-sky-100 mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{test.date}</p>
                      <p className="text-gray-600">{test.time} | {test.location}</p>
                        <p className="text-gray-600">Keterangan: {test.keterangan}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                      Dikonfirmasi
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </SlideUp>
        </div>
      </main>
    </div>
  );
}