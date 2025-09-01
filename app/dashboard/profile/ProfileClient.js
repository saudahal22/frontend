// app/dashboard/profile/ProfileClient.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FadeIn, SlideUp } from "../../../components/Animations";
import { apiClient } from "../../../lib/apiClient";
import { getUserRole } from "../../../lib/auth"; // ✅ Impor untuk cek role

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cocopen-production.up.railway.app";

  // 🔐 Cek role saat komponen dimount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const role = getUserRole();
    if (!role) {
      router.push("/login");
      return;
    }

    if (role !== 'user') {
      // ❌ Bukan user → redirect ke admin-dashboard
      alert('Akses ditolak: Halaman ini hanya untuk user.');
      router.push('/admin-dashboard');
      return;
    }

    // ✅ Jika user, ambil data profil
    fetchProfile();

    const handleStorageChange = () => {
      fetchProfile();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [router]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await apiClient("/profile");

      setProfile({
        fullName: data.nama_lengkap || data.full_name || data.FullName || "Pengguna",
        email: data.email || data.Email || "tidak diketahui",
        statusKeanggotaan: data.status_keanggotaan || data.StatusKeanggotaan || "Tidak Diketahui",
        profilePicture: data.profile_picture
          ? `${API_URL}/uploads/profile/${data.profile_picture}`
          : data.foto
            ? `${API_URL}/uploads/pendaftar/${data.foto}`
            : "/default-avatar.png",
        tanggalBergabung: data.tanggal_bergabung || data.TanggalBergabung || "-",
        asalKampus: data.asal_kampus || "-",
        prodi: data.prodi || "-",
        noWa: data.no_wa || "-",
        alasanMasuk: data.alasan_masuk || "-",
        pengetahuanCoconut: data.pengetahuan_coconut || "-",
      });
    } catch (err) {
      console.error("Gagal muat profil:", err);
      setError(err.message);

      setProfile({
        fullName: "Pengguna",
        email: "error@coconut.or.id",
        statusKeanggotaan: "Gagal Muat",
        profilePicture: "/default-avatar.png",
        tanggalBergabung: "-",
        asalKampus: "-",
        prodi: "-",
        noWa: "-",
        alasanMasuk: "-",
        pengetahuanCoconut: "-",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    setFullName(profile.fullName);
    setIsEditing(true);
  };

  const closeModal = () => {
    setIsEditing(false);
    setError("");
    setFullName("");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (!fullName.trim()) {
      setError("Nama lengkap wajib diisi");
      return;
    }

    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5MB.");
        return;
      }
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("full_name", fullName.trim());
    if (file) formData.append("profile_picture", file);

    try {
      const result = await apiClient("/profile/update", {
        method: "PUT",
        body: formData,
      });

      const updatedName = result.data?.full_name;
      const uploadedFileName = result.data?.profile_picture;

      setProfile((prev) => ({
        ...prev,
        fullName: updatedName || prev.fullName,
        profilePicture: uploadedFileName
          ? `${API_URL}/uploads/profile/${uploadedFileName}?t=${Date.now()}`
          : prev.profilePicture,
      }));

      alert("Profil berhasil diperbarui!");
    } catch (err) {
      console.error("Gagal update profil:", err);
      setError(err.message || "Gagal memperbarui profil.");
      alert("Gagal menyimpan perubahan. Cek koneksi Anda.");
    } finally {
      setUploading(false);
      closeModal();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Memuat profil...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Gagal memuat profil.</p>
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
                      Edit Profil
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

                  <div className="mt-4 text-sm text-gray-600 space-y-1">
                    {profile.asalKampus !== "-" && (
                      <p>Asal Kampus: <span className="font-medium">{profile.asalKampus}</span></p>
                    )}
                    {profile.prodi !== "-" && (
                      <p>Program Studi: <span className="font-medium">{profile.prodi}</span></p>
                    )}
                    {profile.noWa !== "-" && (
                      <p>No WA: <span className="font-medium">{profile.noWa}</span></p>
                    )}
                    {profile.alasanMasuk !== "-" && (
                      <p>Alasan: <span className="italic">{profile.alasanMasuk}</span></p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SlideUp>
        </div>
      </main>

      {/* Modal Edit Profil */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Edit Profil</h3>

            <div className="mb-4">
              <label className="block text-left text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <p className="text-sm text-gray-600 mb-4">Atau ganti foto profil:</p>

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
