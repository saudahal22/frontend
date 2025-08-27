// components/AuthWrapper.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthWrapper({ children, requiredRole = null }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Silakan login terlebih dahulu.');
      router.push('/login');
      setIsLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      if (requiredRole && payload.role !== requiredRole) {
        alert(`Akses ditolak: Anda bukan ${requiredRole}.`);
        router.push(payload.role === 'admin' ? '/admin-dashboard' : '/');
        setIsLoading(false);
        return;
      }
    } catch (e) {
      console.error('Token tidak valid:', e);
      localStorage.clear();
      router.push('/login');
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-700">Memeriksa akses...</p>
      </div>
    );
  }

  return <>{children}</>;
}