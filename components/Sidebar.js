// components/Sidebar.js
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true); // default: terbuka di desktop

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Menu untuk Calon Anggota
  const menuItems = [
    { href: '/dashboard', label: 'Beranda', icon: '🏠' },
    { href: '/dashboard/profile', label: 'Profil Saya', icon: '👤' },
    { href: '/dashboard/schedule', label: 'Jadwal Tes', icon: '📅' },
    { href: '/dashboard/material', label: 'Soal Tes', icon: '📚' },
    { href: '/dashboard/status', label: 'Status Seleksi', icon: '📊' },
  ];

  return (
    <>
      {/* Tombol Hamburger (selalu muncul di kiri atas) */}
      <button
        onClick={toggleSidebar}
        className="fixed left-4 z-50 text-black rounded-lg shadow-md flex items-center justify-center w-8 h-7 hover:bg-sky-700 transition"
        aria-label={isOpen ? 'Tutup sidebar' : 'Buka sidebar'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            // X Icon (tutup)
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            // Hamburger Icon (☰)
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-16'
        }`}
      >
        {/* Header: Kosong (tidak ada logo atau teks) */}
        <div className="p-4 border-b border-gray-200"></div>

        {/* Menu Navigasi */}
        <nav className="mt-4 flex-1 px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-3 text-sm rounded-lg mb-1 transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-100 text-sky-800 font-medium'
                    : 'text-gray-700 hover:bg-sky-50 hover:text-sky-700'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {isOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              if (confirm('Yakin ingin keluar dari akun Anda?')) {
                localStorage.removeItem('coconut_user');
                window.location.href = '/';
              }
            }}
            className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <span>🚪</span>
            {isOpen && <span className="ml-3">Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Overlay saat sidebar terbuka di mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}