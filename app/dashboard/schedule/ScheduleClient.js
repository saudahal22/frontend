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
      alert("Akses ditolak: halaman ini hanya untuk pengguna.");
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

    if (
      (name === "jamMulaiDiajukan" || name === "jamSelesaiDiajukan") &&
      value.length > 5
    ) {
      newValue = value.slice(0, 5);
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
      alert("Alasan perubahan minimal 10 karakter.");
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
      alert("Pengajuan untuk jadwal ini sudah diajukan.");
      setSubmitting(false);
      return;
    }

    const formatTime = (time) =>
      time && time.length === 5 ? `${time}:00` : time;

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

      alert("Pengajuan perubahan berhasil dikirim.");
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
        setError("Anda tidak memiliki izin untuk mengubah jadwal ini.");
      } else if (err.message.includes("Sudah ada pengajuan")) {
        setError("Pengajuan perubahan sudah diajukan sebelumnya.");
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
      alert("Pengajuan berhasil dibatalkan.");
      fetchSchedules();
    } catch (err) {
      setError(`Gagal membatalkan pengajuan: ${err.message}`);
    }
  };

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
          <p className="text-red-600 font-medium">Terjadi kesalahan</p>
          <p className="text-slate-700 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <main className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h1 className="text-3xl font-bold text-center text-slate-800 mb-4">
              Jadwal Tes Anda
            </h1>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              Kelola jadwal tes yang telah dikonfirmasi. Ajukan perubahan jika
              diperlukan.
            </p>
          </FadeIn>

          {/* Daftar Jadwal */}
          <SlideUp delay={200}>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Jadwal Anda
              </h2>
              {schedules.length === 0 ? (
                <p className="text-slate-500 text-center py-4">
                  Belum ada jadwal yang tersedia.
                </p>
              ) : (
                <div className="space-y-5">
                  {schedules.map((j) => (
                    <div
                      key={j.id_jadwal}
                      className="p-5 border border-slate-200 rounded-lg bg-slate-50"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium text-slate-800">
                            {j.tempat}
                          </p>
                          <p className="text-sm text-slate-600">
                            {j.tanggal?.split("T")[0]} | {j.jam_mulai} –{" "}
                            {j.jam_selesai}
                          </p>
                          {j.catatan && (
                            <p className="text-sm text-slate-700 mt-1">
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
                            {j.jenis_jadwal === "pribadi" ? "Pribadi" : "Umum"}
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
                          {j.konfirmasi_jadwal === "dikonfirmasi"
                            ? "Dikonfirmasi"
                            : j.konfirmasi_jadwal === "ditolak"
                            ? "Ditolak"
                            : "Menunggu"}
                        </span>
                      </div>

                      {/* Status Pengajuan */}
                      {(() => {
                        // 1. Dalam proses pengajuan
                        if (j.pengajuan_perubahan) {
                          return (
                            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-sm">
                              <p className="font-semibold text-amber-900">
                                Pengajuan Perubahan
                              </p>
                              <p className="text-amber-800 mt-1">
                                {j.tanggal_diajukan && (
                                  <span>
                                    Tanggal:{" "}
                                    <strong>
                                      {j.tanggal_diajukan.split("T")[0]}
                                    </strong>{" "}
                                    |{" "}
                                  </span>
                                )}
                                {j.jam_mulai_diajukan && (
                                  <span>
                                    Waktu:{" "}
                                    <strong>
                                      {j.jam_mulai_diajukan} –{" "}
                                      {j.jam_selesai_diajukan}
                                    </strong>
                                  </span>
                                )}
                              </p>
                              <p className="text-amber-700 italic mt-1">
                                &quot;{j.alasan_perubahan}&quot;
                              </p>
                              <button
                                onClick={() => handleCancelRequest(j.id_jadwal)}
                                className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium transition"
                              >
                                Batalkan Pengajuan
                              </button>
                            </div>
                          );
                        }

                        // 2. Sudah dikonfirmasi (jadwal diperbarui)
                        if (
                          j.alasan_perubahan &&
                          !j.pengajuan_perubahan &&
                          j.konfirmasi_jadwal === "dikonfirmasi"
                        ) {
                          const tanggalBaru =
                            j.tanggal_diajukan?.split("T")[0] ||
                            j.tanggal?.split("T")[0];
                          const jamMulaiBaru =
                            j.jam_mulai_diajukan || j.jam_mulai;
                          const jamSelesaiBaru =
                            j.jam_selesai_diajukan || j.jam_selesai;

                          return (
                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm">
                              <p className="text-green-800 font-semibold">
                                ✅ Jadwal Diperbarui
                              </p>
                              <p className="text-green-700 mt-1">
                                <strong>Baru:</strong> {tanggalBaru} |{" "}
                                {jamMulaiBaru} – {jamSelesaiBaru}
                              </p>
                              <p className="text-green-600 text-xs mt-1">
                                Alasan: {j.alasan_perubahan}
                              </p>
                            </div>
                          );
                        }

                        // 3. Ditolak
                        if (
                          j.alasan_perubahan &&
                          !j.pengajuan_perubahan &&
                          j.konfirmasi_jadwal === "ditolak"
                        ) {
                          return (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm">
                              <p className="text-red-800 font-semibold">
                                ❌ Pengajuan Ditolak
                              </p>
                              <p className="text-red-600 text-xs mt-1">
                                Alasan: {j.alasan_perubahan}
                              </p>
                            </div>
                          );
                        }

                        return null;
                      })()}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </SlideUp>

          {/* Form Ajukan Perubahan */}
          <SlideUp delay={300}>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Ajukan Perubahan Jadwal
              </h2>

              {schedules.length === 0 ? (
                <p className="text-slate-500 mb-4">
                  Belum ada jadwal untuk diajukan perubahan.
                </p>
              ) : schedules.every(
                  (s) =>
                    s.konfirmasi_jadwal !== "dikonfirmasi" ||
                    s.pengajuan_perubahan
                ) ? (
                <p className="text-amber-600 mb-4">
                  Tidak ada jadwal yang dapat diajukan perubahan.
                  <br />
                  Pastikan jadwal sudah <strong>dikonfirmasi</strong> dan belum
                  memiliki pengajuan aktif.
                </p>
              ) : (
                <form onSubmit={handleSubmitRequest} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Pilih Jadwal
                    </label>
                    <select
                      name="idJadwal"
                      value={formData.idJadwal}
                      onChange={handleChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                      disabled={
                        schedules.filter(
                          (s) =>
                            s.konfirmasi_jadwal === "dikonfirmasi" &&
                            !s.pengajuan_perubahan
                        ).length === 0
                      }
                    >
                      <option value="">
                        Pilih jadwal yang ingin diubah...
                      </option>
                      {schedules
                        .filter(
                          (s) =>
                            s.konfirmasi_jadwal === "dikonfirmasi" &&
                            !s.pengajuan_perubahan
                        )
                        .map((s) => (
                          <option key={s.id_jadwal} value={s.id_jadwal}>
                            {s.tempat} - {s.tanggal?.split("T")[0]},{" "}
                            {s.jam_mulai} ({s.jenis_jadwal})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Tanggal Baru (Opsional)
                      </label>
                      <input
                        type="date"
                        name="tanggalDiajukan"
                        value={formData.tanggalDiajukan}
                        onChange={handleChange}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Jam Mulai Baru (Opsional)
                      </label>
                      <input
                        type="time"
                        name="jamMulaiDiajukan"
                        value={formData.jamMulaiDiajukan}
                        onChange={handleChange}
                        step="1"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Jam Selesai Baru (Opsional)
                      </label>
                      <input
                        type="time"
                        name="jamSelesaiDiajukan"
                        value={formData.jamSelesaiDiajukan}
                        onChange={handleChange}
                        step="1"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Alasan Perubahan
                    </label>
                    <textarea
                      name="alasanPerubahan"
                      value={formData.alasanPerubahan}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Jelaskan alasan perubahan jadwal (minimal 10 karakter)"
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-slate-800"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-3 rounded-lg font-semibold transition"
                  >
                    {submitting ? "Mengirim..." : "Kirim Pengajuan"}
                  </button>
                </form>
              )}
            </div>
          </SlideUp>
        </div>
      </main>
    </div>
  );
}
