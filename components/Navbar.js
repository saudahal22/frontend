// components/Navbar.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { apiClient } from "../lib/apiClient"; // ✅ Gunakan apiClient

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState("/default-avatar.png");
  const [loading, setLoading] = useState(true);

  // 🔹 Ambil API URL dari .env.local
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  // Cek login & ambil profil
  const loadUserData = async () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("coconut_user");

    if (token && user) {
      setIsLoggedIn(true);
      try {
        const data = await apiClient("/profile");

        const photoPath = data.profile_picture; // Misal: "saudah_123.jpg"
        const photoUrl = photoPath
          ? `${API_URL}/uploads/profile/${photoPath}?t=${Date.now()}` // Cache busting
          : "/default-avatar.png";

        setProfilePicture(photoUrl);
      } catch (err) {
        console.error("Gagal muat profil:", err);
        setProfilePicture("/default-avatar.png");
      }
    } else {
      setIsLoggedIn(false);
      setProfilePicture("/default-avatar.png");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUserData();

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    const handleStorageChange = () => loadUserData(); // ✅ Update saat profil berubah

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", handleStorageChange); // Termasuk dari upload foto

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [pathname]);

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari akun Anda?")) {
      localStorage.removeItem("coconut_user");
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setProfilePicture("/default-avatar.png");
      setIsOpen(false);
      window.dispatchEvent(new Event("storage")); // Notifikasi ke komponen lain
      window.location.href = "/";
    }
  };

  if (loading) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg py-2" : "bg-white shadow-lg py-2"
      }`}
    >
      {/* Desktop Navbar */}
      <div className="hidden sm:flex items-center justify-between px-6 md:px-16">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logococonut1.png"
              alt="Logo Coconut - Beranda"
              width={100}
              height={100}
              priority
              className="h-10 w-auto transition-transform hover:scale-105 duration-300"
            />
          </Link>
        </div>

        {/* Menu Links */}
        <div className="flex space-x-6 text-center pl-10">
          {[
            { href: "/", label: "Beranda" },
            { href: "/about", label: "Tentang" },
            { href: "/activity", label: "Aktivitas" },
            { href: "/contact", label: "Kontak" },
          ].map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative inline-block px-5 py-2 font-medium rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg ${
                  isActive
                    ? "text-sky-600 font-semibold"
                    : "text-gray-800 group"
                }`}
              >
                {item.label}
                {!isActive && (
                  <>
                    <span className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300"></span>
                    <span className="absolute inset-0 flex items-center justify-center text-gray-800 group-hover:text-white transition-colors duration-300 pointer-events-none">
                      {item.label}
                    </span>
                  </>
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="relative group">
              <Link href="/dashboard/profile">
                <button
                  type="button"
                  className="h-10 w-10 rounded-full overflow-hidden border-2 border-sky-500 hover:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-transform hover:scale-105"
                  aria-label="Profil Pengguna"
                >
                  <Image
                    src={profilePicture}
                    alt="Profil Pengguna"
                    width={40}
                    height={40}
                    className="object-cover"
                    unoptimized // ✅ Karena dari /uploads/ (bukan di public/)
                  />
                </button>
              </Link>
            </div>
          ) : (
            <>
              <Link href="/login">
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-4 rounded-full transition-transform hover:scale-105 duration-300 hover:shadow-md"
                >
                  Masuk
                </button>
              </Link>
              <Link href="/registrasi">
                <button
                  type="button"
                  className="bg-black hover:bg-gray-700 text-white font-bold py-1.5 px-4 rounded-full transition-transform hover:scale-105 duration-300 hover:shadow-md"
                >
                  Daftar
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="sm:hidden flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logococonut1.png"
            alt="Logo Coconut"
            width={100}
            height={100}
            className="h-8 w-auto"
          />
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
          aria-label={isOpen ? "Tutup menu" : "Buka menu"}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
          <div className="px-4 pt-2 pb-4 space-y-2 text-center">
            {[
              { href: "/", label: "Beranda" },
              { href: "/about", label: "Tentang" },
              { href: "/activity", label: "Aktivitas" },
              { href: "/contact", label: "Kontak" },
            ].map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 text-base font-medium rounded-lg transition ${
                    isActive
                      ? "bg-sky-600 text-white"
                      : "text-gray-800 hover:bg-sky-100 hover:text-sky-800"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="flex justify-center space-x-4 mt-4">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard/profile" onClick={() => setIsOpen(false)}>
                    <button
                      type="button"
                      className="bg-sky-600 text-white font-bold py-1.5 px-4 rounded-full text-sm transition hover:scale-105"
                    >
                      Profil
                    </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    type="button"
                    className="bg-red-500 text-white font-bold py-1.5 px-4 rounded-full text-sm transition hover:scale-105"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <button
                      type="button"
                      className="bg-blue-500 text-white font-bold py-1.5 px-4 rounded-full text-sm transition hover:scale-105"
                    >
                      Masuk
                    </button>
                  </Link>
                  <Link href="/registrasi">
                    <button
                      type="button"
                      className="bg-black text-white font-bold py-1.5 px-4 rounded-full text-sm transition hover:scale-105"
                    >
                      Daftar
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}