// components/NavbarWrapper.js
'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar'; // Pastikan jalur benar

// Daftar rute yang tidak ingin menampilkan navbar
const HIDDEN_NAVBAR_ROUTES = ['/registrasi', '/register', '/login', '/forgot-password'];

export default function NavbarWrapper() {
  const pathname = usePathname();
  const showNavbar = !HIDDEN_NAVBAR_ROUTES.includes(pathname);

  return showNavbar ? <Navbar /> : null;
}