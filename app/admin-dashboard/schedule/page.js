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
  const [users, setUsers] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    pendaftar_id: "",
    tanggal: "",
    jam_mulai: "",
    jam_selesai: "",
    tempat: "",
    catatan: "",
    jenis_jadwal: "pribadi",
    user_id: "",
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

    fetchUsers();
    fetchSchedules();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const data = await apiClient("/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Gagal ambil daftar user:", err.message);
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
      const { tanggal, jam_mulai, jam_selesai, user_id, pendaftar_id, ...rest } = newSchedule;

      const formatTime = (time) => (time && time.length === 5 ? `${time}:00` : time);

      const pendaftarIdNum = pendaftar_id ? parseInt(pendaftar_id, 10) : null;
      const userIdNum = user_id ? parseInt(user_id, 10) : null;

      if (newSchedule.jenis_jadwal === "pribadi" && !userIdNum) {
        alert("Pilih user untuk jadwal pribadi.");
        return;
      }

      if (isNaN(pendaftarIdNum) && pendaftar_id) {
        alert("ID Pendaftar harus berupa angka.");
        return;
      }

      const requestBody = {
        ...rest,
        tanggal,
        jam_mulai: formatTime(jam_mulai),
        jam_selesai: formatTime(jam_selesai),
        pendaftar_id: pendaftarIdNum,
        user_id: userIdNum,
      };

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
        setError("ID Pendaftar tidak valid.");
      } else if (err.message.includes("User tujuan tidak ditemukan")) {
        setError("User tidak ditemukan.");
      } else if (err.message.includes("user_id")) {
        setError("User tidak valid.");
      } else if (err.message.includes("format")) {
        setError("Format data tidak valid.");
      } else {
        setError(`Gagal membuat jadwal: ${err.message}`);
      }
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const formatTime = (time) => (time && time.length === 5 ? `${time}:00` : time);

      const formattedUpdates = { ...updates };

      if (formattedUpdates.tanggal) {
        const date = new Date(formattedUpdates.tanggal);
        if (!isNaN(date)) {
          formattedUpdates.tanggal = date.toISOString().split("T")[0];
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
      alert("Jadwal dihapus.");
      fetchSchedules();
    } catch (err) {
      setError(err.message);
    }
  };

  const pendingRequests = schedules.filter((s) => s.pengajuan_perubahan);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-lg text-slate-600">Memuat jadwal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md">
          <p className="text-red-600 text-lg font-medium">Error</p>
          <p className="text-slate-700 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <h1 className="text-3xl font-bold text-center text-slate-800 mb-4">
            Kelola Jadwal
          </h1>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Tambah jadwal baru, kelola daftar jadwal, dan tinjau pengajuan perubahan dari pengguna.
          </p>
        </FadeIn>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-center border border-red-100">
            <span className="font-medium">Error:</span> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tambah Jadwal */}
          <SlideUp delay={200}>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Tambah Jadwal Baru</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                {newSchedule.jenis_jadwal === "pribadi" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Pengguna</label>
                    <select
                      value={newSchedule.user_id}
                      onChange={(e) =>
                        setNewSchedule({ ...newSchedule, user_id: e.target.value })
                      }
                      required
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                    >
                      <option value="">Pilih pengguna</option>
                      {users.length === 0 ? (
                        <option disabled>Memuat daftar...</option>
                      ) : (
                        users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.nama}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={newSchedule.tanggal}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, tanggal: e.target.value })
                    }
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Jam Mulai</label>
                    <input
                      type="time"
                      required
                      value={newSchedule.jam_mulai}
                      onChange={(e) =>
                        setNewSchedule({ ...newSchedule, jam_mulai: e.target.value })
                      }
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Jam Selesai</label>
                    <input
                      type="time"
                      required
                      value={newSchedule.jam_selesai}
                      onChange={(e) =>
                        setNewSchedule({ ...newSchedule, jam_selesai: e.target.value })
                      }
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tempat</label>
                  <input
                    type="text"
                    placeholder="Contoh: Ruang Rapat 1"
                    required
                    value={newSchedule.tempat}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, tempat: e.target.value })
                    }
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Catatan (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Catatan tambahan"
                    value={newSchedule.catatan}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, catatan: e.target.value })
                    }
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Jadwal</label>
                  <select
                    value={newSchedule.jenis_jadwal}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, jenis_jadwal: e.target.value })
                    }
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                  >
                    <option value="pribadi">Pribadi</option>
                    <option value="umum">Umum</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  Tambah Jadwal
                </button>
              </form>
            </div>
          </SlideUp>

          {/* Daftar Jadwal */}
          <SlideUp delay={300}>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 h-full">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Daftar Jadwal ({schedules.length})
              </h2>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {schedules.length === 0 ? (
                  <p className="text-slate-500 text-center py-4 italic">Belum ada jadwal.</p>
                ) : (
                  schedules.map((s) => (
                    <div
                      key={s.id_jadwal}
                      className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:shadow transition"
                    >
                      <p className="font-medium text-slate-800 truncate">{s.tempat}</p>
                      <p className="text-sm text-slate-600">
                        {s.tanggal?.split("T")[0]} | {s.jam_mulai} – {s.jam_selesai}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">{s.jenis_jadwal}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        Status: <strong>{s.konfirmasi_jadwal}</strong>
                      </p>
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={() =>
                            handleUpdate(s.id_jadwal, { konfirmasi_jadwal: "dikonfirmasi" })
                          }
                          className="text-green-600 hover:text-green-800 text-sm font-medium transition"
                        >
                          Setujui
                        </button>
                        <button
                          onClick={() =>
                            handleUpdate(s.id_jadwal, { konfirmasi_jadwal: "ditolak" })
                          }
                          className="text-red-600 hover:text-red-800 text-sm font-medium transition"
                        >
                          Tolak
                        </button>
                        <button
                          onClick={() => handleDelete(s.id_jadwal)}
                          className="text-slate-500 hover:text-slate-700 text-sm font-medium transition"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </SlideUp>
        </div>

        {/* Pengajuan Perubahan */}
        <div className="mt-10">
          <SlideUp delay={400}>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Pengajuan Perubahan ({pendingRequests.length})
              </h2>
              {pendingRequests.length === 0 ? (
                <p className="text-slate-500 text-center py-4 italic">Tidak ada pengajuan saat ini.</p>
              ) : (
                <div className="space-y-5">
                  {pendingRequests.map((req) => (
                    <div
                      key={req.id_jadwal}
                      className="p-5 border border-amber-200 rounded-lg bg-amber-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-slate-800">
                            {req.user_nama || "Pengguna"}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {req.tanggal?.split("T")[0]} | {req.jam_mulai} →{" "}
                            {req.jam_mulai_diajukan || "-"}
                          </p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          req.konfirmasi_jadwal === "dikonfirmasi"
                            ? "bg-green-100 text-green-800"
                            : req.konfirmasi_jadwal === "ditolak"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {req.konfirmasi_jadwal === "dikonfirmasi"
                            ? "Disetujui"
                            : req.konfirmasi_jadwal === "ditolak"
                            ? "Ditolak"
                            : "Menunggu"}
                        </span>
                      </div>

                      <p className="text-sm text-slate-700 mt-3 italic">
                        "{req.alasan_perubahan}"
                      </p>

                      {req.konfirmasi_jadwal === "belum" && (
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() =>
                              handleUpdate(req.id_jadwal, {
                                jam_mulai: req.jam_mulai_diajukan,
                                jam_selesai: req.jam_selesai_diajukan,
                                tanggal: req.tanggal_diajukan,
                                konfirmasi_jadwal: "dikonfirmasi",
                              })
                            }
                            className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded transition"
                          >
                            Setujui & Perbarui
                          </button>
                          <button
                            onClick={() =>
                              handleUpdate(req.id_jadwal, { konfirmasi_jadwal: "ditolak" })
                            }
                            className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded transition"
                          >
                            Tolak
                          </button>
                        </div>
                      )}

                      {req.konfirmasi_jadwal !== "belum" && (
                        <p className="text-xs text-slate-500 mt-3">
                          Status diproses oleh admin.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </SlideUp>
        </div>
      </div>
    </div>
  );
}