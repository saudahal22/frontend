// components/Sidebar.js
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { href: '/dashboard', label: 'Beranda', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10h3m10-11l2 2v10h-3m-6 0v-4m-3 0l2-2" />
      </svg>
    ) },
  
    { href: '/dashboard/schedule', label: 'Jadwal Tes', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14V7H5v14z" />
      </svg>
    ) },
    { href: '/dashboard/material', label: 'Soal Tes', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v13m0-13C10.8 5.5 9.2 5 7.5 5S4.2 5.5 3 6.3v13C4.2 18.5 5.8 18 7.5 18s3.3.5 4.5 1.3m0-13C13.2 5.5 14.8 5 16.5 5s3.3.5 4.5 1.3v13C19.8 18.5 18.2 18 16.5 18s-3.3.5-4.5 1.3" />
      </svg>
    ) },
    { href: '/dashboard/status', label: 'Status Seleksi', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6H5v6h4zm0 0V9h4v10H9zm4 0h4v-6h-4v6zm0 0V5h4v14h-4z" />
      </svg>
    ) },
  ];

  return (
    <>
      {/* Tombol Hamburger (selalu muncul di mobile) */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 text-gray-700 bg-white p-2 rounded-md shadow-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <span className="text-xl font-semibold text-gray-800"></span>
        </div>

        {/* Menu Navigasi */}
        <nav className="mt-4 flex-1 px-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm rounded-lg mb-1 transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-50 text-sky-800 border-r-4 border-sky-600'
                    : 'text-gray-700 hover:bg-sky-50 hover:text-sky-700'
                }`}
                onClick={() => setIsOpen(false)} // Tutup otomatis saat pilih menu
              >
                <span className={`${isActive ? 'text-sky-600' : 'text-gray-500'} mr-3`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Tombol Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              if (confirm('Yakin ingin keluar dari akun Anda?')) {
                localStorage.removeItem('coconut_user');
                window.location.href = '/';
              }
            }}
            className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Keluar
          </button>
        </div>
      </aside>

      {/* Overlay (hanya muncul di mobile ketika sidebar terbuka) */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
