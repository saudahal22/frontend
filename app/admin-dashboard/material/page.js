"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FadeIn, SlideUp } from "../../../components/Animations";
import { apiClient } from "../../../lib/apiClient";
import { getUserRole, isAuthenticated } from "../../../lib/auth";

export default function AdminMaterialPage() {
  const [soal, setSoal] = useState([]);
  const [testConfig, setTestConfig] = useState({
    judul: "Tes Seleksi",
    deskripsi: "",
    durasi_menit: 60,
    waktu_mulai: "",
    waktu_selesai: "",
    aktif: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newSoal, setNewSoal] = useState({
    nomor: "",
    pertanyaan: "",
    pilihan_a: "",
    pilihan_b: "",
    pilihan_c: "",
    pilihan_d: "",
    jawaban_benar: "",
  });
  const [editId, setEditId] = useState(null);

  const router = useRouter();

  // 🔹 Ambil soal
  const fetchSoal = async () => {
    try {
      const data = await apiClient("/test/admin/soal");
      if (Array.isArray(data)) setSoal(data);
    } catch (err) {
      setError("Gagal muat soal: " + (err.message || ""));
    }
  };

  // 🔹 Ambil konfigurasi tes
  const fetchTestConfig = async () => {
    try {
      const data = await apiClient("/test/config");
      setTestConfig({
        judul: data.judul || "Tes Seleksi",
        deskripsi: data.deskripsi || "",
        durasi_menit: data.durasi_menit || 60,
        waktu_mulai: data.waktu_mulai
          ? new Date(data.waktu_mulai).toISOString().slice(0, 16)
          : "",
        waktu_selesai: data.waktu_selesai
          ? new Date(data.waktu_selesai).toISOString().slice(0, 16)
          : "",
        aktif: data.aktif ?? true,
      });
    } catch (err) {
      console.warn("Konfigurasi tes belum tersedia.");
    }
  };

  // 🔹 Simpan konfigurasi tes
  const handleSaveConfig = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...testConfig,
        waktu_mulai: testConfig.waktu_mulai
          ? new Date(testConfig.waktu_mulai).toISOString()
          : null,
        waktu_selesai: testConfig.waktu_selesai
          ? new Date(testConfig.waktu_selesai).toISOString()
          : null,
      };

      await apiClient("/test/config", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      alert("Konfigurasi berhasil disimpan!");
    } catch (err) {
      setError("Gagal menyimpan: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Cek role
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const role = getUserRole();
    if (role !== "admin") {
      alert("Akses ditolak: Halaman ini hanya untuk admin.");
      router.push("/dashboard");
      return;
    }

    fetchSoal();
    fetchTestConfig();
  }, [router]);

  // ✅ Tambah/Edit Soal
  const handleSubmitSoal = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (editId) {
        await apiClient(`/test/soal/update?id=${editId}`, {
          method: "PUT",
          body: JSON.stringify(newSoal),
        });
      } else {
        await apiClient("/test/soal/create", {
          method: "POST",
          body: JSON.stringify(newSoal),
        });
      }

      await fetchSoal();
      setNewSoal({
        nomor: "",
        pertanyaan: "",
        pilihan_a: "",
        pilihan_b: "",
        pilihan_c: "",
        pilihan_d: "",
        jawaban_benar: "",
      });
      setEditId(null);
      alert(editId ? "Soal diperbarui" : "Soal ditambahkan");
    } catch (err) {
      setError(err.message || "Gagal menyimpan soal");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s) => {
    setEditId(s.id_soal);
    setNewSoal({ ...s });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus soal ini?")) return;
    setLoading(true);
    try {
      await apiClient(`/test/soal/delete?id=${id}`, { method: "DELETE" });
      await fetchSoal();
      alert("Soal dihapus.");
    } catch (err) {
      setError(err.message || "Gagal menghapus soal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <h1 className="text-4xl font-extrabold text-center text-slate-800 mb-4">
            Admin Panel
          </h1>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Kelola soal ujian dan pengaturan waktu tes seleksi secara efisien.
          </p>
        </FadeIn>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-center border border-red-100">
            <span className="font-medium">Error:</span> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Soal */}
          <SlideUp delay={200}>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                {editId ? "Edit Soal" : "Tambah Soal Baru"}
              </h2>
              <form onSubmit={handleSubmitSoal} className="space-y-4">
                <input
                  type="number"
                  placeholder="Nomor"
                  value={newSoal.nomor}
                  onChange={(e) =>
                    setNewSoal({
                      ...newSoal,
                      nomor: parseInt(e.target.value) || "",
                    })
                  }
                  required
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 placeholder-slate-500"
                />
                <input
                  type="text"
                  placeholder="Pertanyaan"
                  value={newSoal.pertanyaan}
                  onChange={(e) =>
                    setNewSoal({ ...newSoal, pertanyaan: e.target.value })
                  }
                  required
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 placeholder-slate-500"
                />
                {["a", "b", "c", "d"].map((opt) => (
                  <input
                    key={opt}
                    type="text"
                    placeholder={`Pilihan ${opt.toUpperCase()}`}
                    value={newSoal[`pilihan_${opt}`]}
                    onChange={(e) =>
                      setNewSoal({
                        ...newSoal,
                        [`pilihan_${opt}`]: e.target.value,
                      })
                    }
                    required
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 placeholder-slate-500"
                  />
                ))}
                <select
                  value={newSoal.jawaban_benar}
                  onChange={(e) =>
                    setNewSoal({ ...newSoal, jawaban_benar: e.target.value })
                  }
                  required
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                >
                  <option value="">Jawaban Benar</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition"
                  >
                    {loading ? "Menyimpan..." : editId ? "Perbarui" : "Tambah"}
                  </button>
                  {editId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditId(null);
                        setNewSoal({
                          nomor: "",
                          pertanyaan: "",
                          pilihan_a: "",
                          pilihan_b: "",
                          pilihan_c: "",
                          pilihan_d: "",
                          jawaban_benar: "",
                        });
                      }}
                      className="bg-slate-400 hover:bg-slate-500 text-white py-3 px-4 rounded-lg transition"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>
          </SlideUp>

          {/* Daftar Soal */}
          <SlideUp delay={300}>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-800">
                  Daftar Soal
                </h2>
                <button
                  onClick={fetchSoal}
                  disabled={loading}
                  className="text-sm bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-700 px-3 py-1 rounded transition"
                >
                  Muat Ulang
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {soal.length === 0 ? (
                  <p className="text-slate-500 text-center py-4 italic">
                    Belum ada soal.
                  </p>
                ) : (
                  soal.map((s) => (
                    <div
                      key={s.id_soal}
                      className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:shadow transition"
                    >
                      <p className="font-medium text-slate-800 line-clamp-2">
                        {s.nomor}. {s.pertanyaan}
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        Jawaban: <strong>{s.jawaban_benar}</strong>
                      </p>
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => handleEdit(s)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s.id_soal)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium transition"
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

          {/* Atur Waktu Tes */}
          <SlideUp delay={400}>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 h-full flex flex-col">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                Pengaturan Tes
              </h2>

              <div className="space-y-4 flex-1">
                <input
                  type="text"
                  placeholder="Judul Tes"
                  value={testConfig.judul}
                  onChange={(e) =>
                    setTestConfig({ ...testConfig, judul: e.target.value })
                  }
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                />
                <textarea
                  placeholder="Deskripsi (opsional)"
                  value={testConfig.deskripsi}
                  onChange={(e) =>
                    setTestConfig({ ...testConfig, deskripsi: e.target.value })
                  }
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-20 text-slate-800 resize-none"
                />
                <input
                  type="number"
                  placeholder="Durasi (menit)"
                  value={testConfig.durasi_menit}
                  onChange={(e) =>
                    setTestConfig({
                      ...testConfig,
                      durasi_menit: parseInt(e.target.value) || 60,
                    })
                  }
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                />
                <input
                  type="datetime-local"
                  value={testConfig.waktu_mulai}
                  onChange={(e) =>
                    setTestConfig({
                      ...testConfig,
                      waktu_mulai: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                />
                <input
                  type="datetime-local"
                  value={testConfig.waktu_selesai}
                  onChange={(e) =>
                    setTestConfig({
                      ...testConfig,
                      waktu_selesai: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                />
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={testConfig.aktif}
                    onChange={(e) =>
                      setTestConfig({ ...testConfig, aktif: e.target.checked })
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-slate-800 font-medium">Tes Aktif</span>
                </label>
              </div>

              {/* Tombol di bagian bawah */}
              <div className="mt-6">
                <button
                  onClick={handleSaveConfig}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-3 rounded-lg font-semibold transition"
                >
                  Simpan Pengaturan
                </button>
              </div>
            </div>
          </SlideUp>
        </div>
      </div>
    </div>
  );
}
