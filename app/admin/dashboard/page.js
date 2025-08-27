// app/dashboard/admin/page.js
'use client';

import { useState } from 'react';
import { FadeIn, SlideUp } from '../../../components/Animations';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Users, Clock, CheckCircle2, Calendar } from 'lucide-react';

export default function AdminDashboard() {
  const [stats] = useState([
    { label: 'Total Calon Anggota', value: '42', icon: <Users size={22} />, color: 'from-blue-400 to-blue-600' },
    { label: 'Menunggu Verifikasi', value: '5', icon: <Clock size={22} />, color: 'from-yellow-400 to-yellow-600' },
    { label: 'Lulus Seleksi', value: '12', icon: <CheckCircle2 size={22} />, color: 'from-green-400 to-green-600' },
    { label: 'Jadwal Mendatang', value: '3', icon: <Calendar size={22} />, color: 'from-purple-400 to-purple-600' },
  ]);

  const recentActivities = [
    { name: 'Saudah Al', action: 'Menyelesaikan soal tes', time: '2 menit lalu' },
    { name: 'Rafael Silva', action: 'Menyelesaikan soal tes', time: '5 menit lalu' },
    { name: 'Nadia Putri', action: 'Mengajukan perubahan jadwal', time: '10 menit lalu' },
  ];

  const registrationData = [
    { day: 'Senin', total: 5 },
    { day: 'Selasa', total: 9 },
    { day: 'Rabu', total: 15 },
    { day: 'Kamis', total: 20 },
    { day: 'Jumat', total: 30 },
    { day: 'Sabtu', total: 37 },
    { day: 'Minggu', total: 42 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <main className="relative overflow-hidden py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Header */}
          <FadeIn>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
              <div>
                <h1 className="text-2xl pt-10 sm:text-3xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-blue-800 via-sky-600 to-blue-900 bg-clip-text text-transparent leading-tight tracking-tight">
              Dashboard Admin
            </h1>
                <p className="text-gray-600 mt-2">
                  Pantau pendaftaran, seleksi, dan aktivitas anggota secara real-time.
                </p>
              </div>
              <button className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-xl shadow hover:scale-105 transition">
                + Tambah Jadwal
              </button>
            </div>
          </FadeIn>

          {/* Stats Cards */}
          <SlideUp delay={200}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl shadow-md bg-white border border-gray-100 hover:shadow-lg transition-all"
                >
                  <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                    {stat.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </SlideUp>

          {/* Grafik Pendaftar */}
          <SlideUp delay={250}>
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Pertumbuhan Pendaftar (1 Minggu)</h2>
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={registrationData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
                    <XAxis dataKey="day" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </SlideUp>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calon Anggota Baru */}
            <SlideUp delay={300}>
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Calon Anggota Terbaru</h2>
                <div className="space-y-4">
                  {['Saudah Al', 'Rafael Silva', 'Nadia Putri', 'Andi Pratama'].map((name, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-sky-200 to-sky-400 rounded-full flex items-center justify-center text-white font-bold">
                          {name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800">{name}</span>
                      </div>
                      <button
                        className="text-xs bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-lg hover:scale-105 transition"
                        onClick={() => (window.location.href = '/dashboard/admin/candidates/' + index)}
                      >
                        Lihat Detail
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </SlideUp>

            {/* Aktivitas Terbaru */}
            <SlideUp delay={400}>
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Aktivitas Terbaru</h2>
                <div className="space-y-4">
                  {recentActivities.map((act, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-3 rounded-lg hover:bg-gray-50 transition">
                      <div>
                        <p className="font-medium text-gray-800">{act.name}</p>
                        <p className="text-gray-600">{act.action}</p>
                      </div>
                      <span className="text-xs text-gray-500">{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SlideUp>
          </div>
        </div>
      </main>
    </div>
  );
}
