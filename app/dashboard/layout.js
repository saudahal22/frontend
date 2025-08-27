// app/dashboard/layout.js
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
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex-1 min-h-screen bg-white lg:ml-64 transition-all">
        <main className="pt-4 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}