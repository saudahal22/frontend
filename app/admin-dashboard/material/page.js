// app/admin-dashboard/material/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FadeIn, SlideUp } from '../../../components/Animations';
import { apiClient } from '../../../lib/apiClient';
import { getUserRole } from '../../../lib/auth'; // ✅ Gunakan langsung

export default function AdminMaterialPage() {
  const [soal, setSoal] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // 🔐 Cek role langsung tanpa API call
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const role = getUserRole();
    if (!role) {
      router.push('/login');
      return;
    }

    if (role !== 'admin') {
      alert('Akses ditolak: Halaman ini hanya untuk admin.');
      router.push('/dashboard');
      return;
    }

    // ✅ Jika admin, ambil data
    fetchSoal();
  }, [router]);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await apiClient(`/test/soal/update?id=${editId}`, {
          method: 'PUT',
          body: JSON.stringify(newSoal),
        });
      } else {
        await apiClient('/test/soal/create', {
          method: 'POST',
          body: JSON.stringify(newSoal),
        });
      }
      alert(editId ? 'Soal diperbarui' : 'Soal ditambahkan');
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
      fetchSoal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (s) => {
    setEditId(s.id_soal);
    setNewSoal({
      nomor: s.nomor,
      pertanyaan: s.pertanyaan,
      pilihan_a: s.pilihan_a,
      pilihan_b: s.pilihan_b,
      pilihan_c: s.pilihan_c,
      pilihan_d: s.pilihan_d,
      jawaban_benar: s.jawaban_benar,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus soal ini?')) return;
    try {
      await apiClient(`/test/soal/delete?id=${id}`, { method: 'DELETE' });
      alert('Soal dihapus');
      fetchSoal();
    } catch (err) {
      setError(err.message);
    }
  };

  // Tampilkan loading saat ambil data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Memuat soal...</p>
      </div>
    );
  }

  // Tampilkan error jika ada
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
          <h1 className="text-3xl font-bold text-center text-blue-900 mb-4">📚 Kelola Soal Tes</h1>
          <p className="text-center text-gray-600 mb-12">Tambah, edit, atau hapus soal untuk tes seleksi.</p>
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
                <input
                  type="number"
                  name="nomor"
                  value={newSoal.nomor}
                  onChange={handleChange}
                  placeholder="Nomor"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="pertanyaan"
                  value={newSoal.pertanyaan}
                  onChange={handleChange}
                  placeholder="Pertanyaan"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                {['a', 'b', 'c', 'd'].map((opt) => (
                  <input
                    key={opt}
                    type="text"
                    name={`pilihan_${opt}`}
                    value={newSoal[`pilihan_${opt}`]}
                    onChange={handleChange}
                    placeholder={`Pilihan ${opt.toUpperCase()}`}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                ))}
                <select
                  name="jawaban_benar"
                  value={newSoal.jawaban_benar}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Jawaban Benar</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold transition"
                  >
                    {editId ? 'Perbarui' : 'Tambah'}
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

          {/* Daftar Soal */}
          <SlideUp delay={300}>
            <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-6 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-blue-900 mb-6">📋 Daftar Soal ({soal.length})</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {soal.map((s) => (
                  <div key={s.id_soal} className="p-4 bg-white/70 rounded-lg border border-sky-100">
                    <p className="font-medium text-gray-800">{s.nomor}. {s.pertanyaan}</p>
                    <p className="text-sm text-gray-600 mt-1">Jawaban: <strong>{s.jawaban_benar}</strong></p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEdit(s)}
                        className="text-blue-500 text-xs hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s.id_soal)}
                        className="text-red-500 text-xs hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SlideUp>
        </div>
      </div>
    </div>
  );
}
