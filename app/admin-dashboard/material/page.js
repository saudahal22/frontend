'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FadeIn, SlideUp } from '../../../components/Animations';
import { apiClient } from '../../../lib/apiClient';
import { getUserRole, isAuthenticated } from '../../../lib/auth';

export default function AdminMaterialPage() {
  const [soal, setSoal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newSoal, setNewSoal] = useState({
    nomor: '',
    pertanyaan: '',
    pilihan_a: '',
    pilihan_b: '',
    pilihan_c: '',
    pilihan_d: '',
    jawaban_benar: '',
  });
  const [editId, setEditId] = useState(null);

  const router = useRouter();

  // 🔐 Cek autentikasi dan role
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const role = getUserRole();
    if (role !== 'admin') {
      alert('Akses ditolak: Halaman ini hanya untuk admin.');
      router.push('/dashboard');
      return;
    }

    // ❌ Tidak fetch data karena /test/soal hanya untuk user
    // Data akan dikelola secara lokal
  }, [router]);

  // ✅ Submit: Tambah atau Edit Soal
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editId) {
        await apiClient(`/test/soal/update?id=${editId}`, {
          method: 'PUT',
          body: JSON.stringify(newSoal),
        });

        setSoal((prev) =>
          prev.map((s) => (s.id_soal === editId ? { ...newSoal, id_soal: editId } : s))
        );
        alert('Soal berhasil diperbarui');
      } else {
        await apiClient('/test/soal/create', {
          method: 'POST',
          body: JSON.stringify(newSoal),
        });

        const tempId = Date.now(); // ID sementara
        setSoal((prev) => [...prev, { ...newSoal, id_soal: tempId }]);
        alert('Soal berhasil ditambahkan (akan muncul setelah reload jika ada akses)');
      }

      // Reset form
      setNewSoal({
        nomor: '',
        pertanyaan: '',
        pilihan_a: '',
        pilihan_b: '',
        pilihan_c: '',
        pilihan_d: '',
        jawaban_benar: '',
      });
      setEditId(null);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan soal. Pastikan semua field terisi benar.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit Soal
  const handleEdit = (s) => {
    setEditId(s.id_soal);
    setNewSoal({ ...s });
  };

  // ✅ Hapus Soal
  const handleDelete = async (id) => {
    if (!window.confirm('Hapus soal ini?')) return;
    setLoading(true);
    try {
      await apiClient(`/test/soal/delete?id=${id}`, { method: 'DELETE' });
      setSoal((prev) => prev.filter((s) => s.id_soal !== id));
      alert('Soal berhasil dihapus');
    } catch (err) {
      setError(err.message || 'Gagal menghapus soal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <h1 className="text-3xl font-bold text-center text-blue-900 mb-4">📚 Kelola Soal Tes</h1>
          <p className="text-center text-gray-600 mb-12">
            Tambah, edit, atau hapus soal untuk tes seleksi.
          </p>
        </FadeIn>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form Tambah/Edit Soal */}
          <SlideUp delay={200}>
            <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-6 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-blue-900 mb-6">
                {editId ? '✏ Edit Soal' : '➕ Tambah Soal'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nomor */}
                <input
                  type="number"
                  name="nomor"
                  value={newSoal.nomor}
                  onChange={(e) =>
                    setNewSoal({ ...newSoal, nomor: parseInt(e.target.value) || '' })
                  }
                  placeholder="Nomor"
                  required
                  className="
                    w-full 
                    p-3 
                    border border-gray-300 rounded-lg 
                    text-gray-800 placeholder-gray-500
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-blue-500 
                    focus:border-blue-500
                    bg-white
                    font-medium
                    transition
                  "
                />

                {/* Pertanyaan */}
                <input
                  type="text"
                  name="pertanyaan"
                  value={newSoal.pertanyaan}
                  onChange={(e) =>
                    setNewSoal({ ...newSoal, pertanyaan: e.target.value })
                  }
                  placeholder="Pertanyaan"
                  required
                  className="
                    w-full 
                    p-3 
                    border border-gray-300 rounded-lg 
                    text-gray-800 placeholder-gray-500
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-blue-500 
                    focus:border-blue-500
                    bg-white
                    font-medium
                    transition
                  "
                />

                {/* Pilihan A-D */}
                {['a', 'b', 'c', 'd'].map((opt) => (
                  <input
                    key={opt}
                    type="text"
                    name={`pilihan_${opt}`}
                    value={newSoal[`pilihan_${opt}`]}
                    onChange={(e) =>
                      setNewSoal({ ...newSoal, [`pilihan_${opt}`]: e.target.value })
                    }
                    placeholder={`Pilihan ${opt.toUpperCase()}`}
                    required
                    className="
                      w-full 
                      p-3 
                      border border-gray-300 rounded-lg 
                      text-gray-800 placeholder-gray-500
                      focus:outline-none 
                      focus:ring-2 
                      focus:ring-blue-500 
                      focus:border-blue-500
                      bg-white
                      font-medium
                      transition
                    "
                  />
                ))}

                {/* Jawaban Benar */}
                <select
                  name="jawaban_benar"
                  value={newSoal.jawaban_benar}
                  onChange={(e) =>
                    setNewSoal({ ...newSoal, jawaban_benar: e.target.value })
                  }
                  required
                  className="
                    w-full 
                    p-3 
                    border border-gray-300 rounded-lg 
                    text-gray-800
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-blue-500 
                    focus:border-blue-500
                    bg-white
                    font-medium
                    transition
                    appearance-none
                    bg-gradient-to-r from-white to-gray-50
                  "
                >
                  <option value="" className="text-gray-700">Jawaban Benar</option>
                  <option value="A" className="text-green-700 font-semibold">A</option>
                  <option value="B" className="text-green-700 font-semibold">B</option>
                  <option value="C" className="text-green-700 font-semibold">C</option>
                  <option value="D" className="text-green-700 font-semibold">D</option>
                </select>

                {/* Tombol Submit & Batal */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-full font-semibold transition"
                  >
                    {loading ? 'Menyimpan...' : editId ? 'Perbarui' : 'Tambah'}
                  </button>
                  {editId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditId(null);
                        setNewSoal({
                          nomor: '',
                          pertanyaan: '',
                          pilihan_a: '',
                          pilihan_b: '',
                          pilihan_c: '',
                          pilihan_d: '',
                          jawaban_benar: '',
                        });
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-full transition"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>
          </SlideUp>

          {/* Daftar Soal (lokal) */}
          <SlideUp delay={300}>
            <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-6 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-blue-900 mb-6">
                📋 Daftar Soal ({soal.length})
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {soal.length === 0 ? (
                  <p className="text-gray-500 text-center italic">
                    Belum ada soal. Tambahkan soal baru.
                  </p>
                ) : (
                  soal.map((s) => (
                    <div
                      key={s.id_soal}
                      className="p-4 bg-white/70 rounded-lg border border-sky-100 hover:shadow-md transition"
                    >
                      <p className="font-semibold text-gray-800">
                        {s.nomor}. {s.pertanyaan}
                      </p>
                      <div className="text-sm text-gray-600 mt-1 space-y-1">
                        <p>A. {s.pilihan_a}</p>
                        <p>B. {s.pilihan_b}</p>
                        <p>C. {s.pilihan_c}</p>
                        <p>D. {s.pilihan_d}</p>
                      </div>
                      <p className="text-sm mt-1">
                        <strong className="text-green-700">Jawaban: {s.jawaban_benar}</strong>
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleEdit(s)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                        >
                          ✏ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s.id_soal)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium transition"
                        >
                          🗑 Hapus
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </SlideUp>
        </div>
      </div>
    </div>
  );
}