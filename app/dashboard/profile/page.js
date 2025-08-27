// app/dashboard/profile/page.js
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FadeIn, SlideUp } from "../../../components/Animations";
import { apiClient } from "../../../lib/apiClient"; // ✅ Gunakan apiClient

export default function ProfilePage() {
  const [isLoggedIn] = useState(true);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      const data = await apiClient("/profile");

      setProfile({
        fullName: data.full_name || data.FullName,
        email: data.email || data.Email,
        statusKeanggotaan: data.status_keanggotaan || data.StatusKeanggotaan,
        profilePicture: data.profile_picture
          ? `/uploads/profile/${data.profile_picture}`
          : "/default-avatar.png",
        tanggalBergabung: data.tanggal_bergabung || data.TanggalBergabung,
      });
    } catch (err) {
      console.error("Gagal muat profil:", err);
      setError(err.message);
      setProfile({
        fullName: "Pengguna",
        email: "error@coconut.or.id",
        statusKeanggotaan: "Tidak Dikenal",
        profilePicture: "/default-avatar.png",
        tanggalBergabung: "-",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    const handleStorageChange = () => {
      fetchProfile();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleProfileClick = () => {
    setIsEditing(true);
  };

  const closeModal = () => {
    setIsEditing(false);
    setError("");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("full_name", profile.fullName);
    formData.append("profile_picture", file);

    try {
      const result = await apiClient("/profile/update", {
        method: "PUT",
        body: formData,
      });

      const uploadedFileName = result.data?.profile_picture;

      if (uploadedFileName) {
        setProfile((prev) => ({
          ...prev,
          profilePicture: `/uploads/profile/${uploadedFileName}?t=${Date.now()}`,
        }));
      }

      alert("Profil berhasil diperbarui!");
    } catch (err) {
      console.error("Gagal update profil:", err);
      setError(err.message);
      alert("Gagal mengunggah foto. Cek format (JPG/PNG) dan ukuran file.");
    } finally {
      setUploading(false);
      closeModal();
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Akses Ditolak</h2>
          <p className="text-gray-600">
            Anda harus masuk untuk melihat profil.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Memuat profil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <main className="relative overflow-hidden py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <FadeIn>
            <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-800 via-sky-600 to-blue-900 bg-clip-text text-transparent leading-tight tracking-tight">
              Profil Saya
            </h1>
            <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-16">
              Kelola informasi pribadi Anda di sini.
            </p>
          </FadeIn>

          <SlideUp delay={200}>
            <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-8 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <div
                  className="relative cursor-pointer group"
                  onClick={handleProfileClick}
                >
                  <img
                    src={profile.profilePicture}
                    alt="Profil"
                    width={120}
                    height={120}
                    className="rounded-full border-4 border-sky-200 w-32 h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <span className="text-white text-xs font-medium">
                      Ganti Foto
                    </span>
                  </div>
                </div>

                <div className="text-center md:text-left flex-1">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {profile.fullName}
                  </h2>
                  <p className="text-gray-600">{profile.email}</p>
                  <p className="text-sm text-blue-600 font-medium">
                    {profile.statusKeanggotaan}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Bergabung: {profile.tanggalBergabung}
                  </p>
                </div>
              </div>
            </div>
          </SlideUp>
        </div>
      </main>

      {/* Modal Ganti Foto */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Ganti Foto Profil
            </h3>
            <p className="text-sm text-gray-600 mb-5">
              Format: JPG, JPEG, PNG (maks 5MB)
            </p>

            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="block w-full bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-lg font-medium cursor-pointer transition mb-3"
            >
              {uploading ? "Mengunggah..." : "Pilih Foto"}
            </label>

            <button
              onClick={closeModal}
              disabled={uploading}
              className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
