"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiClient } from "../../lib/apiClient";
import { useRouter } from "next/navigation";

// Komponen Spinner
function Spinner() {
  return (
    <svg
      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

// Komponen Modal Sukses
function SuccessModal({ isOpen, onClose, onConfirm, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center transform transition-all animate-fade-in">
        {/* Ikon Sukses */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Pesan */}
        <h3 className="text-xl font-bold text-gray-800 mb-3">Berhasil!</h3>
        <p className="text-gray-600 mb-6 text-sm leading-relaxed">{message}</p>

        {/* Tombol Aksi */}
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition"
          >
            Login Sekarang
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 rounded-lg text-sm font-medium transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();
  const errorRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error
    setError("");
    setLoading(true);

    // Validasi frontend
    if (!username || !email || !password || !confirmPassword) {
      setError("Semua field wajib diisi");
      errorRef.current?.scrollIntoView({ behavior: "smooth" });
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Format email tidak valid");
      errorRef.current?.scrollIntoView({ behavior: "smooth" });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi tidak cocok");
      errorRef.current?.scrollIntoView({ behavior: "smooth" });
      setLoading(false);
      return;
    }

    try {
      const data = await apiClient("/register", {
        method: "POST",
        body: JSON.stringify({
          username,
          email,
          password,
          confirm_password: confirmPassword,
        }),
      });

      // Tampilkan modal sukses
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.message || "Gagal mendaftar. Coba lagi.");
      errorRef.current?.scrollIntoView({ behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Halaman Utama */}
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
          {/* Left Section - Illustration */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-sky-500 to-blue-600 text-white p-8 md:p-10 flex flex-col justify-center items-center">
            <div className="mt-10 w-full flex justify-center">
              <Image
                src="/Mobile-encryption-amico-1.png"
                alt="Register Illustration"
                width={300}
                height={250}
                className="w-full max-w-xs md:max-w-sm h-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="w-full md:w-1/2 p-8 md:p-10 relative bg-gradient-to-br from-white to-sky-50">
            {/* Logo Latar Belakang */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Image
                src="/logo.png"
                alt="Coconut Logo"
                width={250}
                height={340}
                className="w-[250px] h-[340px] object-contain opacity-10"
              />
            </div>

            <div className="relative z-10 space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
                Registrasi
              </h2>

              {/* Error Message */}
              {error && (
                <p
                  ref={errorRef}
                  className="text-red-500 text-sm text-center mb-4 bg-red-50 p-3 rounded-lg"
                >
                  {error}
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm 
                               focus:ring-2 focus:ring-sky-400 focus:border-sky-500 
                               bg-white text-gray-900 placeholder-gray-500
                               transition duration-200 ease-in-out disabled:bg-gray-100"
                    placeholder="Masukkan username"
                    disabled={loading}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm 
                               focus:ring-2 focus:ring-sky-400 focus:border-sky-500 
                               bg-white text-gray-900 placeholder-gray-500
                               transition duration-200 ease-in-out disabled:bg-gray-100"
                    placeholder="Masukkan email"
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm 
                               focus:ring-2 focus:ring-sky-400 focus:border-sky-500 
                               bg-white text-gray-900 placeholder-gray-500
                               transition duration-200 ease-in-out disabled:bg-gray-100"
                    placeholder="Masukkan password"
                    disabled={loading}
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm 
                               focus:ring-2 focus:ring-sky-400 focus:border-sky-500 
                               bg-white text-gray-900 placeholder-gray-500
                               transition duration-200 ease-in-out disabled:bg-gray-100"
                    placeholder="Ulangi password"
                    disabled={loading}
                  />
                </div>

               

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-900 to-sky-700 text-white py-3 rounded-xl 
                             hover:from-blue-800 hover:to-sky-600 
                             transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 
                             font-semibold flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Spinner />
                      Memproses...
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
                <div className="mt-4 text-center text-sm">
                  <span className="text-gray-600">Sudah punya akun?</span>{" "}
                  <Link
                    href="/login"
                    className="text-sky-600 font-medium hover:underline"
                  >
                    Masuk
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Sukses */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onConfirm={() => {
          setShowSuccessModal(false);
          router.push("/login");
        }}
        message="Akun berhasil dibuat! Silakan cek email Anda untuk verifikasi."
      />
    </>
  );
}
