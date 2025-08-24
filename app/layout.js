'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Daftar halaman yang TIDAK menampilkan navbar sama sekali
const NO_NAVBAR_PAGES = [
  '/login',
  '/registrasi',
  '/register',
  '/forgot-password',
  '/reset-password', 
  '/admin',
];

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Cek apakah halaman saat ini tidak butuh navbar
  const hideNavbar = NO_NAVBAR_PAGES.includes(pathname);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {!hideNavbar && <Navbar />}
        <main key={pathname}>{children}</main>
      </body>
    </html>
  );
}