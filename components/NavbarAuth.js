'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function NavbarAuth() {
  return (
    <nav className="bg-white/20 backdrop-blur-md fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={40} height={40} className="h-10" />
        </Link>

        {/* Tombol berbeda tergantung halaman */}
        {typeof window !== 'undefined' && (
          <div>
            {window.location.pathname === '/login' ? (
              <Link href="/register">
                <button className="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800">
                  Daftar
                </button>
              </Link>
            ) : (
              <Link href="/login">
                <button className="bg-amber-500 text-white px-5 py-2 rounded-full hover:bg-amber-600">
                  Masuk
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}