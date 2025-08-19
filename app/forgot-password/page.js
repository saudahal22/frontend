"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn, SlideUp } from "../../components/Animations";
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const errorRef = useRef(null);
  const successRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email wajib diisi");
      setSuccess("");
      errorRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Format email tidak valid");
      setSuccess("");
      errorRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await apiClient("/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      setSuccess(data.message || "Link reset password sudah dikirim ke email.");
      setEmail("");
      setTimeout(() => {
        router.push("/login");
      }, 3000); // Redirect setelah 3 detik
    } catch (err) {
      setError(err.message || "Gagal mengirim link reset. Coba lagi.");
      successRef.current?.scrollIntoView({ behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <FadeIn>
        <div className="w-full max-w-4xl h-auto md:h-[600px] bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
          {/* Left Section - Illustration */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-sky-500 to-blue-600 text-white p-8 md:p-10 flex flex-col justify-center items-center">
            <div className="mt-10 w-full flex justify-center">
              <Image
                src="/Mobile-encryption-amico-1.png"
                alt="Forgot Password Illustration"
                width={300}
                height={250}
                className="w-full max-w-xs md:max-w-sm h-auto object-contain"
              />
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="w-full md:w-1/2 p-8 md:p-10 relative bg-gradient-to-br from-white to-sky-50 flex flex-col justify-center">
            {/* Logo di latar belakang (transparan) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Image
                src="/logo.png"
                alt="Coconut Logo"
                width={120}
                height={120}
                style={{ width: "250px", height: "280px" }}
                className="opacity-10"
              />
            </div>

            <div className="relative z-10">
              <SlideUp delay={300}>
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
                  Lupa Password?
                </h2>
              </SlideUp>

              <p className="text-center text-gray-600 mb-6 text-sm">
                Masukkan email Anda, kami akan kirimkan link untuk mereset
                password.
              </p>

              {error && (
                <SlideUp delay={400}>
                  <p
                    ref={errorRef}
                    className="text-red-500 text-sm text-center mb-4 bg-red-50 p-3 rounded-lg"
                  >
                    {error}
                  </p>
                </SlideUp>
              )}

              {success && (
                <SlideUp delay={400}>
                  <p
                    ref={successRef}
                    className="text-green-500 text-sm text-center mb-4 bg-green-50 p-3 rounded-lg"
                  >
                    {success}
                  </p>
                </SlideUp>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <SlideUp delay={500}>
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
                                 transition duration-200 ease-in-out
                                 disabled:bg-gray-100"
                      placeholder="Masukkan email Anda"
                      disabled={loading}
                    />
                  </div>
                </SlideUp>

                <SlideUp delay={600}>
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
                        Mengirim...
                      </>
                    ) : (
                      "Kirim Link Reset"
                    )}
                  </button>
                </SlideUp>
              </form>

              <SlideUp delay={700}>
                <div className="text-center mt-8">
                  <p className="text-sm text-gray-600">
                    Sudah ingat password?{" "}
                    <Link
                      href="/login"
                      className="
          text-sky-700 hover:text-sky-900 
          font-medium 
          hover:underline hover:underline-offset-2
          transition-all duration-150
        "
                    >
                      Kembali ke Login
                    </Link>
                  </p>
                </div>
              </SlideUp>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
