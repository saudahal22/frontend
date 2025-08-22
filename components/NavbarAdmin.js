'use client';

import { useState } from 'react'; // ✅ HARUS diimpor
import Link from 'next/link';
import Image from 'next/image';

export default function NavbarAdmin() {
  const [isOpen, setIsOpen] = useState(false); // ✅ pakai useState

  const handleLogout = () => {
    if (confirm('Yakin ingin keluar dari sesi admin?')) {
      localStorage.removeItem('coconut_admin');
      window.location.href = '/';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg shadow-lg py-3">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="Coconut Logo"
            width={32}
            height={32}
            className="h-8 w-auto"
          />
          <span className="font-bold text-gray-900 text-lg">Coconut Admin</span>
        </div>

        <div className="hidden sm:flex space-x-8">
          <Link href="/admin/dashboard" className="text-gray-800 hover:text-sky-600 font-medium transition">
            Dashboard
          </Link>
          <Link href="/admin/members" className="text-gray-800 hover:text-sky-600 font-medium transition">
            Kelola Pendaftar
          </Link>
          <Link href="/admin/schedule" className="text-gray-800 hover:text-sky-600 font-medium transition">
            Jadwal Tes
          </Link>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="h-10 w-10 rounded-full overflow-hidden border-2 border-sky-500 hover:border-sky-600 focus:outline-none"
          >
            <Image
              src="/slider/saudahlatarbiru.png"
              alt="Admin Profil"
              width={40}
              height={40}
              className="object-cover"
            />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <Link
                href="/admin/profile"
                className="block px-4 py-2 text-sm text-gray-800 hover:bg-sky-50"
                onClick={() => setIsOpen(false)}
              >
                Profil Saya
              </Link>
              <hr className="border-gray-200 my-1" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            <Link
              href="/admin/dashboard"
              className="block px-3 py-2 text-base text-gray-800 hover:bg-sky-50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/members"
              className="block px-3 py-2 text-base text-gray-800 hover:bg-sky-50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Kelola Pendaftar
            </Link>
            <Link
              href="/admin/schedule"
              className="block px-3 py-2 text-base text-gray-800 hover:bg-sky-50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Jadwal Tes
            </Link>
            <hr className="border-gray-200" />
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-base text-red-600 hover:bg-red-50 rounded-lg"
            >
              Keluar
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}