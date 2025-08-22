'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function NavbarDashboard() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Opsional: hapus data login
    localStorage.removeItem('user');
    // Redirect ke beranda
    window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg shadow-lg py-3">
      <div className="flex items-center justify-between px-4">
        {/* Kiri: Hamburger Menu */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-900 hover:bg-gray-100 focus:outline-none"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"}
            />
          </svg>
        </button>

        {/* Tengah: Kosong (tidak ada logo) */}
        <div className="flex-1"></div>

        {/* Kanan: Profil Ikon */}
        <Link href="/dashboard">
          <button className="h-10 w-10 rounded-full overflow-hidden border-2 border-sky-500 hover:border-sky-600 focus:outline-none">
            <Image
              src="/slider/saudahlatarbiru.png"
              alt="Profil Pengguna"
              width={40}
              height={40}
              className="object-cover"
            />
          </button>
        </Link>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 font-bold">
          <div className="px-4 py-2 space-y-1 text-center">
            <Link
              href="/dashboard/soal"
              className="block px-3 py-2 text-base font-medium text-gray-800 hover:bg-sky-100 hover:text-sky-800 rounded-lg transition"
              onClick={() => setIsOpen(false)}
            >
              Soal Tes
            </Link>
            <Link
              href="/dashboard/jadwal"
              className="block px-3 py-2 text-base font-medium text-gray-800 hover:bg-sky-100 hover:text-sky-800 rounded-lg transition"
              onClick={() => setIsOpen(false)}
            >
              Jadwal Tes
            </Link>
            <Link
              href="/dashboard"
              className="block px-3 py-2 text-base font-medium text-gray-800 hover:bg-sky-100 hover:text-sky-800 rounded-lg transition"
              onClick={() => setIsOpen(false)}
            >
              Profil Saya
            </Link>
            <hr className="border-gray-200" />
            <button
              onClick={handleLogout}
              className="block w-full text-center px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              Keluar
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}