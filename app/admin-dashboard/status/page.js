// app/admin-dashboard/status/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FadeIn, SlideUp } from '../../../components/Animations';
import { apiClient } from '../../../lib/apiClient';
import { getUserRole } from '../../../lib/auth'; // Gunakan langsung

export default function AdminStatusPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [submitStatus, setSubmitStatus] = useState('');

  const router = useRouter();

  // 🔐 Cek role langsung, tanpa API call
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
    fetchMembers();
  }, [router]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await apiClient('/pendaftar/all');
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Gagal memuat data pendaftar');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const formData = new FormData();
      formData.append('id_pendaftar', id);
      formData.append('status', status);

      await apiClient('/pendaftar/update', {
        method: 'PUT',
        body: formData,
      });

      setSubmitStatus(`Status pendaftar ID ${id} diperbarui menjadi ${status}`);
      fetchMembers();
      setTimeout(() => setSubmitStatus(''), 5000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus pendaftar ini?')) return;
    try {
      await apiClient(`/pendaftar/delete?id=${id}`, { method: 'DELETE' });
      setSubmitStatus('Pendaftar berhasil dihapus');
      fetchMembers();
      setTimeout(() => setSubmitStatus(''), 5000);
    } catch (err) {
      setError(err.message);
    }
  };

  const openModal = (member) => {
    setSelectedMember(member);
  };

  const closeModal = () => {
    setSelectedMember(null);
  };

  // Filter data
  const filteredMembers = members.filter((m) => {
    const matchesSearch = 
      m.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.asal_kampus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.prodi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? m.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  // Tampilkan loading saat pengecekan
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Memuat data...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 pt-16 pb-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Notifikasi */}
        {submitStatus && (
          <div className="mb-6 p-3 bg-green-100 border border-green-200 text-green-800 text-sm rounded-lg animate-fade-in">
            {submitStatus}
          </div>
        )}
        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-200 text-red-800 text-sm rounded-lg animate-fade-in">
            {error}
          </div>
        )}

        <FadeIn>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">Kelola Pendaftar</h1>
          <p className="text-gray-600 mb-6">Kelola data calon anggota Coconut secara real-time.</p>
        </FadeIn>

        {/* Pencarian & Filter */}
        <SlideUp delay={200}>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              placeholder="Cari nama, kampus, prodi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg flex-1 text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none text-gray-900"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none text-gray-900"
            >
              <option value="">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="diterima">Diterima</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>
        </SlideUp>

        {/* Tabel (Desktop) atau Card (Mobile) */}
        <SlideUp delay={300}>
          <div className="bg-white rounded-2xl shadow-xl border border-white/50 backdrop-blur-sm overflow-hidden">
            <h2 className="text-xl font-bold text-blue-900 p-6 pb-4">👥 Daftar Calon Anggota</h2>

            {/* Tabel untuk Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-sky-50/50 text-gray-700 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">No</th>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Kampus</th>
                    <th className="px-4 py-3">Prodi</th>
                    <th className="px-4 py-3">No. WA</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 rounded-r-lg">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                        Belum ada pendaftar.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((m, index) => (
                      <tr
                        key={m.id_pendaftar}
                        className="hover:bg-sky-50/40 transition cursor-pointer text-xs sm:text-sm"
                        onClick={() => openModal(m)}
                      >
                        <td className="px-4 py-4 font-medium text-gray-900">{index + 1}</td>
                        <td className="px-4 py-4 font-medium text-gray-900">{m.nama_lengkap}</td>
                        <td className="px-4 py-4 text-gray-600">{m.asal_kampus}</td>
                        <td className="px-4 py-4 text-gray-600">{m.prodi}</td>
                        <td className="px-4 py-4 text-gray-900">{m.no_wa}</td>
                        <td className="px-4 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              m.status === 'diterima'
                                ? 'bg-green-100 text-green-800'
                                : m.status === 'ditolak'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {m.status === 'diterima' ? 'Diterima' : m.status === 'ditolak' ? 'Ditolak' : 'Menunggu'}
                          </span>
                        </td>
                        <td className="px-4 py-4 space-x-1">
                          {m.status === 'pending' ? (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatus(m.id_pendaftar, 'diterima');
                                }}
                                className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded transition"
                              >
                                Terima
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatus(m.id_pendaftar, 'ditolak');
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded transition"
                              >
                                Tolak
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-gray-500 italic">Selesai</span>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(m.id_pendaftar);
                            }}
                            className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded transition ml-1"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Card untuk Mobile */}
            <div className="md:hidden space-y-4 p-4">
              {filteredMembers.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Belum ada pendaftar.</p>
              ) : (
                filteredMembers.map((m, index) => (
                  <div
                    key={m.id_pendaftar}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm"
                    onClick={() => openModal(m)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900">{m.nama_lengkap}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          m.status === 'diterima'
                            ? 'bg-green-100 text-green-800'
                            : m.status === 'ditolak'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {m.status === 'diterima' ? 'Diterima' : m.status === 'ditolak' ? 'Ditolak' : 'Menunggu'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Kampus: {m.asal_kampus}</p>
                    <p className="text-sm text-gray-600">Prodi: {m.prodi}</p>
                    <p className="text-sm text-gray-900">No. WA: {m.no_wa}</p>
                    <div className="flex gap-2 mt-3">
                      {m.status === 'pending' ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(m.id_pendaftar, 'diterima');
                            }}
                            className="bg-green-500 text-white text-xs px-3 py-1 rounded"
                          >
                            Terima
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(m.id_pendaftar, 'ditolak');
                            }}
                            className="bg-red-500 text-white text-xs px-3 py-1 rounded"
                          >
                            Tolak
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-500 italic">Selesai</span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(m.id_pendaftar);
                        }}
                        className="bg-gray-500 text-white text-xs px-3 py-1 rounded ml-1"
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

        {/* Modal Detail */}
        {selectedMember && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Detail Pendaftar</h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    &times;
                  </button>
                </div>

                {/* Foto */}
                {selectedMember.foto_path ? (
                  <div className="mb-6 flex justify-center">
                    <img
                      src={`/uploads/foto_pendaftar/${selectedMember.foto_path}`}
                      alt="Foto Pendaftar"
                      className="w-32 h-32 object-cover rounded-xl border-2 border-sky-200"
                    />
                  </div>
                ) : (
                  <div className="mb-6 text-center">
                    <div className="w-32 h-32 bg-gray-200 rounded-xl mx-auto flex items-center justify-center text-gray-500 text-sm">
                      Tidak ada foto
                    </div>
                  </div>
                )}

                <div className="space-y-3 text-sm text-gray-800">
                  <p><strong>Nama:</strong> {selectedMember.nama_lengkap}</p>
                  <p><strong>Kampus:</strong> {selectedMember.asal_kampus}</p>
                  <p><strong>Prodi:</strong> {selectedMember.prodi}</p>
                  <p><strong>Semester:</strong> {selectedMember.semester}</p>
                  <p><strong>No. WA:</strong> {selectedMember.no_wa}</p>
                  <p><strong>Domisili:</strong> {selectedMember.domisili}</p>
                  <p><strong>Alamat:</strong> {selectedMember.alamat_sekarang}</p>
                  <p><strong>Tinggal Bersama:</strong> {selectedMember.tinggal_dengan}</p>
                  <p><strong>Alasan:</strong> {selectedMember.alasan_masuk}</p>
                  <p><strong>Tahu dari:</strong> {selectedMember.pengetahuan_coconut}</p>
                  <p><strong>Status:</strong> {selectedMember.status}</p>
                  <p><strong>Daftar pada:</strong> {new Date(selectedMember.created_at).toLocaleDateString('id-ID')}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  {selectedMember.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          handleUpdateStatus(selectedMember.id_pendaftar, 'diterima');
                          closeModal();
                        }}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-full text-sm"
                      >
                        Terima
                      </button>
                      <button
                        onClick={() => {
                          handleUpdateStatus(selectedMember.id_pendaftar, 'ditolak');
                          closeModal();
                        }}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-full text-sm"
                      >
                        Tolak
                      </button>
                    </>
                  )}
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-full text-sm"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Animasi */}
        <style jsx>{`
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}
