'use client';

import { useState, useEffect } from 'react';
import { FadeIn, SlideUp } from '../../components/Animations';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  Clock,
  CheckCircle2,
  Calendar,
  MessageCircle,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import AuthWrapper from '../../components/AuthWrapper';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalPendaftar: 0,
    pending: 0,
    diterima: 0,
    jadwalMendatang: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [registrationData, setRegistrationData] = useState([]);

  const fetchData = async () => {
    try {
      console.log("Mengambil data untuk dashboard...");

      const pendaftarRes = await apiClient('/pendaftar/all');
      const jadwalRes = await apiClient('/jadwal/all');
      const hasilRes = await apiClient('/test/hasil');

      const pendaftar = Array.isArray(pendaftarRes) ? pendaftarRes : [];
      const jadwal = Array.isArray(jadwalRes) ? jadwalRes : [];
      const hasil = Array.isArray(hasilRes) ? hasilRes : [];

      console.log("Data diterima:", { pendaftar, jadwal, hasil });

      // Hitung statistik
      const total = pendaftar.length;
      const pending = pendaftar.filter((p) => p.status === 'pending').length;
      const diterima = pendaftar.filter((p) => p.status === 'diterima').length;
      const jadwalMendatang = jadwal.filter((j) => new Date(j.tanggal) >= new Date()).length;

      setStats({ totalPendaftar: total, pending, diterima, jadwalMendatang });

      // Aktivitas terbaru
      const activities = [];

      // Pengajuan perubahan jadwal
      jadwal
        .filter((j) => j.pengajuan_perubahan)
        .slice(0, 3)
        .forEach((j) => {
          activities.push({
            name: j.pendaftar_nama || 'Calon Anggota',
            action: 'Mengajukan perubahan jadwal',
            time: 'Baru',
          });
        });

      // Hasil tes
      hasil
        .sort((a, b) => new Date(b.waktu_mulai) - new Date(a.waktu_mulai))
        .slice(0, 3)
        .forEach((h) => {
          activities.push({
            name: `User ID ${h.user_id}`,
            action: 'Menyelesaikan soal tes',
            time: new Date(h.waktu_mulai).toLocaleTimeString('id-ID'),
          });
        });

      // Pendaftar baru
      pendaftar
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3)
        .forEach((p) => {
          activities.push({
            name: p.nama_lengkap,
            action: 'Mendaftar sebagai calon anggota',
            time: new Date(p.created_at).toLocaleTimeString('id-ID'),
          });
        });

      setRecentActivities(activities.slice(0, 6));

      // Data grafik pertumbuhan (kumulatif)
      const dailyData = {};
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

      pendaftar.forEach((p) => {
        const day = new Date(p.created_at).getDay(); // 0 = Minggu
        const dayName = days[day];
        dailyData[dayName] = (dailyData[dayName] || 0) + 1;
      });

      let cumulative = 0;
      const data = days.map((day) => ({
        day,
        total: (cumulative += dailyData[day] || 0),
      }));

      setRegistrationData(data);
    } catch (err) {
      console.error('Gagal ambil data dashboard:', err);
      setError(err.message || 'Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 30000); // Refresh tiap 30 detik
    return () => clearInterval(interval);
  }, []);

  // Tampilkan loading
  if (loading) {
    return (
      <AuthWrapper requiredRole="admin">
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
          <p className="text-lg text-gray-600">Memuat dashboard admin...</p>
        </div>
      </AuthWrapper>
    );
  }

  // Tampilkan error
  if (error) {
    return (
      <AuthWrapper requiredRole="admin">
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg max-w-md text-center shadow-lg">
            <h3 className="font-bold text-lg">Gagal Memuat Dashboard</h3>
            <p className="mt-2 text-sm">{error}</p>
            <button
              onClick={fetchData}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </AuthWrapper>
    );
  }

  // Statistik Cards
  const statsCards = [
    {
      label: 'Total Calon Anggota',
      value: stats.totalPendaftar,
      icon: <Users size={22} />,
      color: 'from-blue-400 to-blue-600',
    },
    {
      label: 'Menunggu Verifikasi',
      value: stats.pending,
      icon: <Clock size={22} />,
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      label: 'Lulus Seleksi',
      value: stats.diterima,
      icon: <CheckCircle2 size={22} />,
      color: 'from-green-400 to-green-600',
    },
    {
      label: 'Jadwal Mendatang',
      value: stats.jadwalMendatang,
      icon: <Calendar size={22} />,
      color: 'from-purple-400 to-purple-600',
    },
  ];

  return (
    <AuthWrapper requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
        <main className="py-16">
          <div className="container mx-auto px-6 max-w-7xl">
            <FadeIn>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-800 via-sky-600 to-blue-900 bg-clip-text text-transparent leading-tight">
                    Dashboard Admin
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Pantau pendaftaran, seleksi, dan aktivitas anggota secara real-time.
                  </p>
                </div>
                <a
                  href="/admin-dashboard/schedule"
                  className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-xl shadow hover:scale-105 transition-transform duration-200 inline-block"
                >
                  + Tambah Jadwal
                </a>
              </div>
            </FadeIn>

            <SlideUp delay={200}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statsCards.map((stat, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-2xl shadow-md bg-white border border-gray-100 hover:shadow-lg transition-all duration-300"
                  >
                    <div
                      className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}
                    >
                      {stat.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </SlideUp>

            <SlideUp delay={250}>
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-12">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Pertumbuhan Pendaftar (1 Minggu)</h2>
                <div className="w-full h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={registrationData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="day" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorTotal)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </SlideUp>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SlideUp delay={300}>
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Calon Anggota Terbaru</h2>
                  <div className="space-y-4">
                    {recentActivities
                      .filter((act) => act.action.includes('Mendaftar'))
                      .slice(0, 4)
                      .map((act, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                          onClick={() => (window.location.href = '/admin-dashboard/status')}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 bg-gradient-to-br from-sky-200 to-sky-400 rounded-full flex items-center justify-center text-white font-bold">
                              {act.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-800">{act.name}</span>
                          </div>
                          <button className="text-xs bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-lg hover:scale-105 transition-transform duration-200">
                            Lihat Detail
                          </button>
                        </div>
                      ))}
                    {recentActivities.filter((act) => act.action.includes('Mendaftar')).length === 0 && (
                      <p className="text-gray-500 text-center py-4">Belum ada pendaftar baru.</p>
                    )}
                  </div>
                </div>
              </SlideUp>

              <SlideUp delay={400}>
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Aktivitas Terbaru</h2>
                  <div className="space-y-4">
                    {recentActivities.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Belum ada aktivitas.</p>
                    ) : (
                      recentActivities.map((act, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm p-3 rounded-lg hover:bg-gray-50 transition"
                        >
                          <div>
                            <p className="font-medium text-gray-800">{act.name}</p>
                            <p className="text-gray-600">{act.action}</p>
                          </div>
                          <span className="text-xs text-gray-500">{act.time}</span>
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
    </AuthWrapper>
  );
}