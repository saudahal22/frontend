// app/admin-dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // ⬅️ tambahkan ini
import { FadeIn, SlideUp } from '../../components/Animations';
// ... import lainnya (AreaChart, Icons, dll)

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter(); // ⬅️ inisialisasi router
  const [stats, setStats] = useState({ /* ... */ });
  const [recentActivities, setRecentActivities] = useState([]);
  const [registrationData, setRegistrationData] = useState([]);

  // 🔐 Fungsi decode token
  const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  };

  const fetchData = async () => {
    try {
      const pendaftarRes = await apiClient('/pendaftar/all');
      // ... ambil data lainnya
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    // 🔴 Cek: apakah ada token?
    if (!token) {
      alert('Akses ditolak: Silakan login terlebih dahulu');
      router.push('/login');
      return;
    }

    // 🔴 Cek: apakah role admin?
    const decoded = decodeToken(token);
    if (!decoded) {
      alert('Token tidak valid. Silakan login ulang.');
      localStorage.clear();
      router.push('/login');
      return;
    }

    if (decoded.role !== 'admin') {
      alert('Akses ditolak: Anda tidak memiliki izin sebagai admin');
      router.push('/'); // atau ke halaman user
      return;
    }

    // ✅ Jika lolos semua cek, baru ambil data
    fetchData();

    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [router]);

  // ... render halaman (sudah ada)
}