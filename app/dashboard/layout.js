// app/dashboard/layout.js
'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '../../components/Sidebar';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  // Hanya gunakan layout ini di rute /dashboard
  if (!pathname.startsWith('/dashboard')) return children;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Konten Utama (tanpa Navbar) */}
      <div className="flex-1 lg:ml-64 min-h-screen bg-white">
        <main className="pt-10 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}