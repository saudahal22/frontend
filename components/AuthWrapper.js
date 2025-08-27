// components/AuthWrapper.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthWrapper({ children, requiredRole = null }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      if (requiredRole && payload.role !== requiredRole) {
        if (payload.role === 'admin') {
          router.push('/admin-dashboard');
        } else {
          router.push('/');
        }
        return;
      }

      if (!requiredRole && payload.role === 'admin' && !router.pathname.startsWith('/admin-dashboard')) {
        router.push('/admin-dashboard');
        return;
      }
    } catch (e) {
      console.error("Token invalid:", e);
      localStorage.clear();
      router.push('/login');
      return;
    }
  }, [router]);

  return <>{children}</>;
}