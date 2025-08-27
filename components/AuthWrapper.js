// components/AuthWrapper.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthWrapper({ children, requiredRole = null }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      // Redirect ke login, tapi tetap render children dulu
      router.push('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      if (requiredRole && payload.role !== requiredRole) {
        // Redirect ke halaman sesuai role
        if (payload.role === 'admin') {
          router.push('/admin-dashboard');
        } else {
          router.push('/');
        }
        return;
      }

      // Jika admin membuka halaman biasa, arahkan ke dashboard
      if (!requiredRole && payload.role === 'admin' && !router.pathname.startsWith('/admin-dashboard')) {
        router.push('/admin-dashboard');
        return;
      }
    } catch (e) {
      console.error("Gagal decode token:", e);
      localStorage.clear();
      router.push('/login');
      return;
    }
  }, [router]);

  // ✅ Render children selalu, meskipun sedang redirect
  return <>{children}</>;
}