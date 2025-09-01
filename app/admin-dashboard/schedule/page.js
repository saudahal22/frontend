"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FadeIn, SlideUp } from "../../../components/Animations";
import { apiClient } from "../../../lib/apiClient";
import { getUserRole } from "../../../lib/auth";

export default function AdminSchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]); // 👈 Daftar user (id + nama)
  const [newSchedule, setNewSchedule] = useState({
    pendaftar_id: "",
    tanggal: "",
    jam_mulai: "",
    jam_selesai: "",
    tempat: "",
    catatan: "",
    jenis_jadwal: "pribadi",
    user_id: "", // 👈 tambah state untuk user_id
  });

  const router = useRouter();

  // 🔐 Cek role admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const role = getUserRole();
    if (!role || role !== "admin") {
      alert("Akses ditolak: Halaman ini hanya untuk admin.");
      router.push("/dashboard");
      return;
    }

    fetchUsers(); // 🔁 Ambil daftar user
    fetchSchedules(); // 🔁 Ambil jadwal
  }, [router]);

  // 🔁 Ambil daftar user dari /users (backend: GetUsersForJadwalHandler)
  const fetchUsers = async () => {
    try {
      const data = await apiClient("/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Gagal ambil daftar user:", err.message);
      // Tetap lanjutkan, mungkin tidak kritis
    }
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await apiClient("/jadwal/all");
      setSchedules(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Gagal memuat jadwal");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const {
        tanggal,
        jam_mulai,
        jam_selesai,
        user_id,
        pendaftar_id,
        ...rest
      } = newSchedule;

      const formatTime = (time) =>
        time && time.length === 5 ? `${time}:00` : time;

      // 🔢 Konversi ke number atau null
      const pendaftarIdNum = pendaftar_id ? parseInt(pendaftar_id, 10) : null;
      const userIdNum = user_id ? parseInt(user_id, 10) : null;

      // Validasi: jika jadwal pribadi, user_id wajib
      if (newSchedule.jenis_jadwal === "pribadi") {
        if (!userIdNum) {
          alert("Pilih user untuk jadwal pribadi.");
          return;
        }
      }

      // Validasi: pastikan tidak NaN
      if (isNaN(pendaftarIdNum) && pendaftar_id) {
        alert("ID Pendaftar harus berupa angka.");
        return;
      }

      const requestBody = {
        ...rest,
        tanggal,
        jam_mulai: formatTime(jam_mulai),
        jam_selesai: formatTime(jam_selesai),
        // Kirim sebagai number atau null (bukan string)
        pendaftar_id: pendaftarIdNum,
        user_id: userIdNum, // ✅ kirim user_id jika pribadi
      };

      // Hapus user_id jika jadwal umum (biar backend isi otomatis)
      if (newSchedule.jenis_jadwal === "umum") {
        delete requestBody.user_id;
      }

      await apiClient("/jadwal/create", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      alert("Jadwal berhasil dibuat!");
      setNewSchedule({
        pendaftar_id: "",
        tanggal: "",
        jam_mulai: "",
        jam_selesai: "",
        tempat: "",
        catatan: "",
        jenis_jadwal: "pribadi",
        user_id: "",
      });
      fetchSchedules();
    } catch (err) {
      console.error("Error creating schedule:", err);

      if (err.message.includes("1452")) {
        setError("Gagal membuat jadwal: ID Pendaftar tidak valid.");
      } else if (err.message.includes("User tujuan tidak ditemukan")) {
        setError("Gagal membuat jadwal: User tidak ditemukan.");
      } else if (err.message.includes("user_id")) {
        setError("Gagal membuat jadwal: User tidak valid.");
      } else if (err.message.includes("format")) {
        setError("Gagal membuat jadwal: Format data tidak valid.");
      } else {
        setError(`Gagal membuat jadwal: ${err.message}`);
      }
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const formatTime = (time) =>
        time && time.length === 5 ? `${time}:00` : time;

      // 🔧 Format ulang updates sebelum kirim
      const formattedUpdates = { ...updates };

      // ✅ Format tanggal: pastikan YYYY-MM-DD atau hapus jika null
      if (formattedUpdates.tanggal) {
        const date = new Date(formattedUpdates.tanggal);
        if (!isNaN(date)) {
          formattedUpdates.tanggal = date.toISOString().split("T")[0]; // → "2025-04-20"
        } else {
          delete formattedUpdates.tanggal;
        }
      }

      if (formattedUpdates.jam_mulai) {
        formattedUpdates.jam_mulai = formatTime(formattedUpdates.jam_mulai);
      }
      if (formattedUpdates.jam_selesai) {
        formattedUpdates.jam_selesai = formatTime(formattedUpdates.jam_selesai);
      }

      await apiClient(`/jadwal/update?id=${id}`, {
        method: "PUT",
        body: JSON.stringify(formattedUpdates),
      });

      alert("Jadwal diperbarui!");
      fetchSchedules();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus jadwal ini?")) return;
    try {
      await apiClient(`/jadwal/delete?id=${id}`, { method: "DELETE" });
      alert("Jadwal dihapus");
      fetchSchedules();
    } catch (err) {
      setError(err.message);
    }
  };

  const pendingRequests = schedules.filter((s) => s.pengajuan_perubahan);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Memuat jadwal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-900 mb-4">
            📅 Kelola Jadwal & Pengajuan
          </h1>
          <p className="text-center text-gray-600 mb-12">
            Tambah, edit, atau kelola pengajuan perubahan jadwal dari calon
            anggota.
          </p>
        </FadeIn>

        {error && (
          <div className="mb-8 p-4 text-sm rounded-lg bg-red-100 text-red-800 border border-red-200 text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Tambah Jadwal */}
          <SlideUp delay={200}>
            <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-6 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-blue-900 mb-6">
                ➕ Tambah Jadwal Baru
              </h2>
              <form onSubmit={handleCreate} className="space-y-4">
                {/* Dropdown Pilih User (untuk jadwal pribadi) */}
                {newSchedule.jenis_jadwal === "pribadi" && (
                  <select
                    value={newSchedule.user_id}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        user_id: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-900"
                    required
                  >
                    <option value="">Pilih User</option>
                    {users.length === 0 ? (
                      <option disabled>Memuat user...</option>
                    ) : (
                      users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.nama}
                        </option>
                      ))
                    )}
                  </select>
                )}

                <input
                  type="date"
                  required
                  value={newSchedule.tanggal}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, tanggal: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-900"
                />
                <input
                  type="time"
                  required
                  value={newSchedule.jam_mulai}
                  onChange={(e) =>
                    setNewSchedule({
                      ...newSchedule,
                      jam_mulai: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-900"
                />
                <input
                  type="time"
                  required
                  value={newSchedule.jam_selesai}
                  onChange={(e) =>
                    setNewSchedule({
                      ...newSchedule,
                      jam_selesai: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-900"
                />
                <input
                  type="text"
                  placeholder="Tempat"
                  required
                  value={newSchedule.tempat}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, tempat: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-900"
                />
                <input
                  type="text"
                  placeholder="Catatan (opsional)"
                  value={newSchedule.catatan}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, catatan: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-900"
                />
                <select
                  value={newSchedule.jenis_jadwal}
                  onChange={(e) =>
                    setNewSchedule({
                      ...newSchedule,
                      jenis_jadwal: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-900"
                >
                  <option value="pribadi">Pribadi</option>
                  <option value="umum">Umum</option>
                </select>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold transition"
                >
                  Tambah Jadwal
                </button>
              </form>
            </div>
          </SlideUp>

          {/* Daftar Jadwal */}
          <SlideUp delay={300}>
            <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-6 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-blue-900 mb-6">
                🗓 Daftar Jadwal ({schedules.length})
              </h2>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {schedules.map((s) => (
                  <div
                    key={s.id_jadwal}
                    className="p-3 bg-white/70 rounded-lg border border-sky-100"
                  >
                    <p className="font-medium text-gray-800">{s.tempat}</p>
                    <p className="text-xs text-gray-600">
                      {s.tanggal?.split("T")[0]} | {s.jam_mulai} -{" "}
                      {s.jam_selesai}
                    </p>
                    <p className="text-xs text-blue-600">{s.jenis_jadwal}</p>
                    <p className="text-xs text-gray-600">
                      Status: {s.konfirmasi_jadwal}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() =>
                          handleUpdate(s.id_jadwal, {
                            konfirmasi_jadwal: "dikonfirmasi",
                          })
                        }
                        className="text-green-500 text-xs hover:underline"
                      >
                        Setujui
                      </button>
                      <button
                        onClick={() =>
                          handleUpdate(s.id_jadwal, {
                            konfirmasi_jadwal: "ditolak",
                          })
                        }
                        className="text-red-500 text-xs hover:underline"
                      >
                        Tolak
                      </button>
                      <button
                        onClick={() => handleDelete(s.id_jadwal)}
                        className="text-gray-500 text-xs hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SlideUp>

          {/* Pengajuan Perubahan */}
          <div className="lg:col-span-2">
            <SlideUp delay={400}>
              <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-6 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-blue-900 mb-6">
                  📬 Pengajuan Perubahan ({pendingRequests.length})
                </h2>
                {pendingRequests.map((req) => (
                  <div
                    key={req.id_jadwal}
                    className="p-4 bg-white/70 rounded-xl border border-amber-100"
                  >
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-gray-800">
                        Pengajuan untuk Jadwal: {req.user_nama}
                      </h3>
                      {req.konfirmasi_jadwal === "dikonfirmasi" ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                          ✅ Telah Dikonfirmasi
                        </span>
                      ) : req.konfirmasi_jadwal === "ditolak" ? (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                          ❌ Ditolak
                        </span>
                      ) : (
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                          Menunggu
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mt-2">
                      Dari: {req.jam_mulai} →{" "}
                      {req.jam_mulai_diajukan || "Tidak diubah"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Tanggal:{" "}
                      {req.tanggal_diajukan?.split("T")[0] || "Tidak diubah"}
                    </p>
                    <p className="text-sm text-gray-700 italic mt-1">
                      {req.alasan_perubahan}
                    </p>

                    {/* Hanya tampilkan tombol jika belum dikonfirmasi/ditolak */}
                    {req.konfirmasi_jadwal === "belum" && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() =>
                            handleUpdate(req.id_jadwal, {
                              jam_mulai: req.jam_mulai_diajukan,
                              jam_selesai: req.jam_selesai_diajukan,
                              tanggal: req.tanggal_diajukan,
                              konfirmasi_jadwal: "dikonfirmasi",
                            })
                          }
                          className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-full transition"
                        >
                          Setujui & Update
                        </button>
                        <button
                          onClick={() =>
                            handleUpdate(req.id_jadwal, {
                              konfirmasi_jadwal: "ditolak",
                            })
                          }
                          className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full transition"
                        >
                          Tolak
                        </button>
                      </div>
                    )}

                    {/* Tampilkan status jika sudah diproses */}
                    {req.konfirmasi_jadwal !== "belum" && (
                      <p className="text-xs text-gray-500 mt-2">
                        Status:{" "}
                        {req.konfirmasi_jadwal === "dikonfirmasi"
                          ? "Disetujui"
                          : "Ditolak"}{" "}
                        oleh admin
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </SlideUp>
          </div>
        </div>
      </div>
    </div>
  );
}
