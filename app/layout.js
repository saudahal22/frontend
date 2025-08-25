'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

// Load font
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Daftar halaman yang TIDAK butuh navbar sama sekali
const NO_NAVBAR_PAGES = [
  '/login',
  '/registrasi',
  '/register',
  '/forgot-password',
  '/reset-password',
  
];

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Cek apakah halaman saat ini TIDAK butuh navbar
  // Termasuk: halaman spesifik + semua subhalaman di /dashboard
  const hideNavbar =
    NO_NAVBAR_PAGES.includes(pathname) ||
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/admin-dashboard');

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Hanya tampilkan Navbar jika bukan di halaman yang disembunyikan */}
        {!hideNavbar && <Navbar />}
        
        {/* Konten utama */}
        <main key={pathname}>
          {children}
        </main>
      </body>
    </html>
  );
}