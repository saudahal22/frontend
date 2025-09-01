// app/dashboard/profile/ProfileClient.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FadeIn, SlideUp } from "../../../components/Animations";
import { apiClient } from "../../../lib/apiClient";
import { getUserRole } from "../../../lib/auth";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cocopen-production.up.railway.app";

  // 🔐 Cek role
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
      alert('Akses ditolak: Halaman ini hanya untuk pengguna.');
      router.push('/admin-dashboard');
      return;
    }

    fetchProfile();

    const handleStorageChange = () => fetchProfile();
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-lg text-slate-600">Memuat profil...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-red-500">Gagal memuat profil.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
      <main className="py-12 px-4">
        <div className="max-w-md mx-auto">
          <FadeIn>
            <h1 className="text-3xl font-bold text-center text-slate-800 mb-4">
              Profil Saya
            </h1>
            <p className="text-center text-slate-600 mb-8">
              Kelola foto dan nama Anda di sini.
            </p>
          </FadeIn>

          <SlideUp delay={200}>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-center">
              {/* Foto Profil */}
              <div
                className="relative inline-block cursor-pointer mx-auto mb-6 group"
                onClick={handleProfileClick}
              >
                <img
                  src={profile.profilePicture}
                  alt="Foto Profil"
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-slate-200 w-32 h-32 object-cover transition-transform duration-300 group-hover:scale-105 shadow-md"
                />
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                  <span className="text-white text-sm font-medium">
                    Edit Profil
                  </span>
                </div>
              </div>

              {/* Nama & Info */}
              <h2 className="text-2xl font-bold text-slate-800 mb-1">
                {profile.fullName}
              </h2>
              <p className="text-slate-600 text-sm mb-2 truncate">{profile.email}</p>

              <div className="flex justify-center gap-4 text-sm mb-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full font-medium text-xs ${
                    profile.statusKeanggotaan === "Aktif"
                      ? "bg-green-100 text-green-800"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {profile.statusKeanggotaan}
                </span>
                <span className="text-slate-500">
                  Bergabung: {profile.tanggalBergabung}
                </span>
              </div>
            </div>
          </SlideUp>
        </div>
      </main>

      {/* Modal Edit Profil */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-5 text-center">Edit Profil</h3>

            <div className="mb-5">
              <label className="block text-left text-sm font-medium text-slate-700 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            {error && <p className="text-red-500 text-xs mb-4 text-center">{error}</p>}

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
              className="block w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition mb-3 cursor-pointer"
            >
              {uploading ? "Mengunggah..." : "Pilih Foto"}
            </label>

            <button
              onClick={closeModal}
              disabled={uploading}
              className="w-full border border-slate-300 text-slate-700 py-3 rounded-lg hover:bg-slate-50 transition font-medium"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}