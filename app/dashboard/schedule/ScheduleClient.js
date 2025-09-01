"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FadeIn, SlideUp } from "../../../components/Animations";
import { apiClient } from "../../../lib/apiClient";
import { getUserRole, decodeToken } from "../../../lib/auth";

export default function ScheduleClient() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    idJadwal: "",
    tanggalDiajukan: "",
    jamMulaiDiajukan: "",
    jamSelesaiDiajukan: "",
    alasanPerubahan: "",
  });

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const role = getUserRole();
    if (role !== "user") {
      alert("Akses ditolak: halaman ini hanya untuk user.");
      router.push("/admin-dashboard");
      return;
    }

    const claims = decodeToken(token);
    const userID = claims?.id_user;

    if (!userID) {
      setError("Gagal memuat data pengguna.");
      setLoading(false);
      return;
    }

    fetchSchedules();
  }, [router]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await apiClient("/jadwal/user");
      // Urutkan: dikonfirmasi dulu
      const sorted = Array.isArray(data)
        ? data.sort((a, b) => {
            if (
              a.konfirmasi_jadwal === "dikonfirmasi" &&
              b.konfirmasi_jadwal !== "dikonfirmasi"
            )
              return -1;
            if (
              a.konfirmasi_jadwal !== "dikonfirmasi" &&
              b.konfirmasi_jadwal === "dikonfirmasi"
            )
              return 1;
            return new Date(a.tanggal) - new Date(b.tanggal);
          })
        : [];
      setSchedules(sorted);
    } catch (err) {
      setError(err.message || "Gagal memuat jadwal");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "jamMulaiDiajukan" || name === "jamSelesaiDiajukan") {
      if (value.length > 5) {
        newValue = value.slice(0, 5);
      }
    }

    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const {
      idJadwal,
      alasanPerubahan,
      tanggalDiajukan,
      jamMulaiDiajukan,
      jamSelesaiDiajukan,
    } = formData;

    if (!idJadwal) {
      alert("Pilih jadwal yang ingin diubah.");
      setSubmitting(false);
      return;
    }

    if (!alasanPerubahan || alasanPerubahan.trim().length < 10) {
      alert("Alasan perubahan harus minimal 10 karakter.");
      setSubmitting(false);
      return;
    }

    const jadwal = schedules.find((j) => j.id_jadwal === parseInt(idJadwal));
    if (!jadwal) {
      setError("Jadwal tidak ditemukan.");
      setSubmitting(false);
      return;
    }

    if (jadwal.pengajuan_perubahan) {
      alert("Jadwal ini sudah memiliki pengajuan aktif.");
      setSubmitting(false);
      return;
    }

    const formatTime = (time) => {
      if (!time) return null;
      return time.length === 5 ? `${time}:00` : time;
    };

    const body = {
      id_jadwal: parseInt(idJadwal),
      alasan_perubahan: alasanPerubahan.trim(),
      tanggal_diajukan: tanggalDiajukan || null,
      jam_mulai_diajukan: jamMulaiDiajukan
        ? formatTime(jamMulaiDiajukan)
        : null,
      jam_selesai_diajukan: jamSelesaiDiajukan
        ? formatTime(jamSelesaiDiajukan)
        : null,
    };

    try {
      await apiClient("/jadwal/ajukan", {
        method: "POST",
        body: JSON.stringify(body),
      });

      alert("Pengajuan perubahan jadwal berhasil dikirim!");
      setFormData({
        idJadwal: "",
        tanggalDiajukan: "",
        jamMulaiDiajukan: "",
        jamSelesaiDiajukan: "",
        alasanPerubahan: "",
      });
      fetchSchedules();
    } catch (err) {
      if (err.message.includes("Bukan jadwal Anda")) {
        setError("Anda tidak berhak mengubah jadwal ini.");
      } else if (err.message.includes("Sudah ada pengajuan")) {
        setError("Pengajuan perubahan sudah diajukan.");
      } else {
        setError(`Gagal mengirim pengajuan: ${err.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRequest = async (idJadwal) => {
    if (!window.confirm("Batalkan pengajuan perubahan jadwal ini?")) return;

    try {
      await apiClient(`/jadwal/cancel-perubahan?id_jadwal=${idJadwal}`, {
        method: "DELETE",
      });
      alert("Pengajuan dibatalkan");
      fetchSchedules();
    } catch (err) {
      setError(`Gagal membatalkan: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <main className="relative overflow-hidden py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <FadeIn>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-blue-800 via-sky-600 to-blue-900 bg-clip-text text-transparent leading-tight tracking-tight">
              Jadwal Tes
            </h1>
            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-16">
              Jadwal tes yang telah dikonfirmasi. Pastikan Anda hadir tepat
              waktu.
            </p>
          </FadeIn>

          <SlideUp delay={200}>
            <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-8 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm mb-10">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                📅 Jadwal Anda
              </h2>
              {schedules.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Belum ada jadwal.
                </p>
              ) : (
                schedules.map((j) => (
                  <div
                    key={j.id_jadwal}
                    className="p-6 bg-white/70 rounded-xl border border-sky-100 mb-4 text-gray-900"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">
                          {j.tanggal?.split("T")[0]}
                        </p>
                        <p>
                          {j.jam_mulai} - {j.jam_selesai} | {j.tempat}
                        </p>
                        <p>Status: {j.konfirmasi_jadwal}</p>
                        {j.catatan && (
                          <p className="text-sm mt-1">
                            <strong>Catatan:</strong> {j.catatan}
                          </p>
                        )}
                        <span
                          className={`inline-block mt-1 text-xs px-2 py-1 rounded ${
                            j.jenis_jadwal === "pribadi"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {j.jenis_jadwal}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          j.konfirmasi_jadwal === "dikonfirmasi"
                            ? "bg-green-100 text-green-800"
                            : j.konfirmasi_jadwal === "ditolak"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {j.konfirmasi_jadwal === "dikonfirmasi" && "✅ "}
                        {j.konfirmasi_jadwal}
                      </span>
                    </div>

                    {/* 🔔 Status Pengajuan Perubahan (Aktif, Dikonfirmasi, atau Ditolak) */}
                    {(() => {
                      // 1. Masih dalam proses pengajuan
                      if (j.pengajuan_perubahan) {
                        return (
                          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                            <p>
                              <strong>Pengajuan Ubah Jadwal:</strong>
                            </p>
                            <p>
                              Dari: {j.jam_mulai} →{" "}
                              {j.jam_mulai_diajukan || "Tidak diubah"}
                            </p>
                            <p>
                              Tanggal:{" "}
                              {j.tanggal_diajukan?.split("T")[0] ||
                                "Tidak diubah"}
                            </p>
                            <p>Alasan: {j.alasan_perubahan}</p>
                            <button
                              onClick={() => handleCancelRequest(j.id_jadwal)}
                              className="mt-2 text-red-600 text-xs hover:underline"
                            >
                              Batalkan Pengajuan
                            </button>
                          </div>
                        );
                      }

                      // 2. Sudah dikonfirmasi oleh admin
                      if (
                        j.alasan_perubahan &&
                        !j.pengajuan_perubahan &&
                        j.konfirmasi_jadwal === "dikonfirmasi"
                      ) {
                        const tanggalBaru = j.tanggal_diajukan
                          ? j.tanggal_diajukan.split("T")[0]
                          : j.tanggal?.split("T")[0];
                        const jamMulaiBaru =
                          j.jam_mulai_diajukan || j.jam_mulai;
                        const jamSelesaiBaru =
                          j.jam_selesai_diajukan || j.jam_selesai;

                        return (
                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                            <p className="text-green-800 font-medium">
                              ✅ Pengajuan telah dikonfirmasi oleh admin
                            </p>
                            <p className="mt-1">
                              <strong>Jadwal diperbarui menjadi:</strong>
                            </p>
                            <p>
                              {tanggalBaru} | {jamMulaiBaru} - {jamSelesaiBaru}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              Alasan: {j.alasan_perubahan}
                            </p>
                          </div>
                        );
                      }

                      // 3. Ditolak oleh admin
                      if (
                        j.alasan_perubahan &&
                        !j.pengajuan_perubahan &&
                        j.konfirmasi_jadwal === "ditolak"
                      ) {
                        return (
                          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
                            <p className="text-red-800 font-medium">
                              ❌ Pengajuan perubahan ditolak oleh admin
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              Alasan: {j.alasan_perubahan}
                            </p>
                          </div>
                        );
                      }

                      return null;
                    })()}
                  </div>
                ))
              )}
            </div>
          </SlideUp>

          <SlideUp delay={300}>
            <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-8 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm mb-10">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                🔄 Ajukan Ubah Jadwal
              </h2>

              {/* Info jika tidak ada jadwal yang bisa diajukan */}
              {schedules.length === 0 && (
                <p className="text-gray-500 mb-4">
                  Belum ada jadwal sama sekali.
                </p>
              )}

              {schedules.length > 0 &&
                schedules.every(
                  (s) =>
                    s.konfirmasi_jadwal !== "dikonfirmasi" ||
                    s.pengajuan_perubahan
                ) && (
                  <p className="text-yellow-600 mb-4">
                    Tidak ada jadwal yang bisa diajukan perubahan.
                    <br />
                    Pastikan jadwal sudah <strong>dikonfirmasi</strong> dan
                    belum diajukan.
                  </p>
                )}

              <form onSubmit={handleSubmitRequest} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Jadwal
                  </label>
                  <select
                    name="idJadwal"
                    value={formData.idJadwal}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-gray-900"
                    disabled={
                      schedules.filter(
                        (s) =>
                          s.konfirmasi_jadwal === "dikonfirmasi" &&
                          !s.pengajuan_perubahan
                      ).length === 0
                    }
                  >
                    <option value="">Pilih jadwal...</option>
                    {schedules
                      .filter(
                        (s) =>
                          s.konfirmasi_jadwal === "dikonfirmasi" &&
                          !s.pengajuan_perubahan
                      )
                      .map((s) => (
                        <option key={s.id_jadwal} value={s.id_jadwal}>
                          {s.tempat} - {s.tanggal?.split("T")[0]}, {s.jam_mulai}{" "}
                          ({s.jenis_jadwal})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Baru (opsional)
                    </label>
                    <input
                      type="date"
                      name="tanggalDiajukan"
                      value={formData.tanggalDiajukan}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waktu Mulai Baru (opsional)
                    </label>
                    <input
                      type="time"
                      name="jamMulaiDiajukan"
                      value={formData.jamMulaiDiajukan}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-gray-900"
                      step="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waktu Selesai Baru (opsional)
                    </label>
                    <input
                      type="time"
                      name="jamSelesaiDiajukan"
                      value={formData.jamSelesaiDiajukan}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-gray-900"
                      step="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alasan Pengajuan
                  </label>
                  <textarea
                    name="alasanPerubahan"
                    value={formData.alasanPerubahan}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Minimal 10 karakter..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none resize-none text-gray-900"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full font-semibold py-3 rounded-full transition shadow-md ${
                    submitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                  }`}
                >
                  {submitting ? "Mengirim..." : "Kirim Pengajuan"}
                </button>
              </form>
            </div>
          </SlideUp>
        </div>
      </main>
    </div>
  );
}
