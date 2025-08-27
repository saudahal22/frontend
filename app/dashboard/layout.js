'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Sidebar from '../../components/Sidebar';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (!pathname.startsWith('/dashboard')) return children;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Konten Utama */}
      <div className="flex-1 min-h-screen bg-white lg:ml-64 transition-all">
        {/* Navbar kecil (muncul hanya di mobile) */}
        <div className="p-4 lg:hidden">
          {/* tombol toggle bisa taruh di sini kalau mau */}
        </div>

        <main className="pt-4 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
