// components/AuthWrapper.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthWrapper({ children, requiredRole = null }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Silakan login terlebih dahulu.');
      router.push('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      if (requiredRole && payload.role !== requiredRole) {
        alert(`Akses ditolak: Anda bukan ${requiredRole}.`);
        router.push(payload.role === 'admin' ? '/admin-dashboard' : '/');
        return;
      }

      if (!requiredRole && payload.role === 'admin' && !router.pathname.startsWith('/admin-dashboard')) {
        router.push('/admin-dashboard');
        return;
      }
    } catch (e) {
      console.error('Token tidak valid:', e);
      localStorage.clear();
      router.push('/login');
      return;
    }
  }, [router]);

  return <>{children}</>;
}