// components/AuthWrapper.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthWrapper({ children, requiredRole = null }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // 🔴 Cek: apakah sudah login?
    if (!token) {
      alert('Silakan login terlebih dahulu.');
      router.push('/login');
      return;
    }

    // 🔍 Decode token
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // 🔒 Cek role jika diperlukan
      if (requiredRole && payload.role !== requiredRole) {
        alert('Akses ditolak: Anda tidak memiliki izin.');
        if (payload.role === 'admin') {
          router.push('/admin-dashboard');
        } else {
          router.push('/');
        }
        return;
      }

      // 🔁 Jika admin buka dashboard user → redirect ke admin
      if (!requiredRole && payload.role === 'admin') {
        router.push('/admin-dashboard');
        return;
      }
    } catch (e) {
      // Token rusak
      alert('Sesi tidak valid. Silakan login ulang.');
      localStorage.clear();
      router.push('/login');
    }
  }, [router, requiredRole]);

  return <>{children}</>;
}