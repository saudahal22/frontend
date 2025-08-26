// app/admin-dashboard/status/page.js
'use client';

import { useState, useEffect } from 'react';
import { FadeIn, SlideUp } from '../../../components/Animations';

export default function StatusPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCampus, setFilterCampus] = useState('');
  const [members, setMembers] = useState([]);
  const [submitStatus, setSubmitStatus] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [newApplicant, setNewApplicant] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null); // Untuk modal

  // Load data dari localStorage
  useEffect(() => {
    const loadMembers = () => {
      const saved = JSON.parse(localStorage.getItem('calonAnggota')) || [];
      setMembers(saved);
    };

    loadMembers();

    // Dengarkan perubahan localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'calonAnggota' && e.newValue) {
        const newMembers = JSON.parse(e.newValue);
        const oldCount = members.length;
        const newCount = newMembers.length;

        if (newCount > oldCount) {
          const latest = newMembers[0]; // yang baru ditambahkan
          setNewApplicant(latest);
          setShowNotification(true);

          setTimeout(() => {
            setShowNotification(false);
            setNewApplicant(null);
          }, 5000);
        }

        setMembers(newMembers); // update daftar
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [members.length]);

  // Simpan ke localStorage (untuk update status)
  const saveToStorage = (data) => {
    try {
      localStorage.setItem('calonAnggota', JSON.stringify(data));
      setMembers(data);
    } catch (error) {
      console.error('Gagal simpan ke localStorage:', error);
    }
  };

  // Handle Lulus
  const handleApproveMember = (id) => {
    const updated = members.map((m) =>
      m.id === id ? { ...m, resultStatus: 'Lulus' } : m
    );
    saveToStorage(updated);
    setSubmitStatus(`${updated.find(m => m.id === id)?.name} dinyatakan LULUS.`);

    // Kirim notifikasi ke user
    const notif = {
      id: Date.now(),
      message: 'Selamat! Anda diterima sebagai anggota Coconut.',
      time: 'Baru',
      read: false,
    };
    const userNotifs = JSON.parse(localStorage.getItem(`notifs_${id}`) || '[]');
    localStorage.setItem(`notifs_${id}`, JSON.stringify([notif, ...userNotifs]));
  };

  // Handle Tolak
  const handleRejectMember = (id) => {
    const updated = members.map((m) =>
      m.id === id ? { ...m, resultStatus: 'Tidak Lulus' } : m
    );
    saveToStorage(updated);
    setSubmitStatus(`${updated.find(m => m.id === id)?.name} dinyatakan TIDAK LULUS.`);
    
    const notif = {
      id: Date.now(),
      message: 'Maaf, Anda belum lolos seleksi kali ini.',
      time: 'Baru',
      read: false,
    };
    const userNotifs = JSON.parse(localStorage.getItem(`notifs_${id}`) || '[]');
    localStorage.setItem(`notifs_${id}`, JSON.stringify([notif, ...userNotifs]));
  };

  // Filter data
  const filteredMembers = members.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCampus = filterCampus ? m.asalKampus === filterCampus : true;
    return matchesSearch && matchesCampus;
  });

  // Buka modal detail
  const openModal = (member) => {
    setSelectedMember(member);
  };

  // Tutup modal
  const closeModal = () => {
    setSelectedMember(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 pt-20 px-6 py-10">
      <div className="max-w-7xl mx-auto p-6 sm:p-10">

        {/* Notifikasi Real-Time */}
        {showNotification && newApplicant && (
          <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in transition transform duration-300">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            <div>
              <p className="font-semibold text-sm">Pendaftar Baru!</p>
              <p className="text-xs opacity-90">{newApplicant.name} telah mendaftar.</p>
            </div>
          </div>
        )}

        <FadeIn>
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-4">Kelola Pendaftar</h1>
          <p className="text-gray-600 mb-6">Kelola data calon anggota Coconut secara real-time.</p>
        </FadeIn>

        {submitStatus && (
          <div className="mb-6 p-3 bg-green-100 border border-green-200 text-green-800 text-sm rounded-lg">
            {submitStatus}
          </div>
        )}

        {/* Pencarian & Filter */}
        <SlideUp delay={200}>
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <input
              type="text"
              placeholder="Cari berdasarkan nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 sm:p-3 border border-gray-300 rounded-lg flex-1 text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
            />
            <select
              value={filterCampus}
              onChange={(e) => setFilterCampus(e.target.value)}
              className="p-2 sm:p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
            >
              <option value="">Semua Kampus</option>
              <option value="Universitas Hasanuddin">Unhas</option>
              <option value="Politeknik Negeri Makassar">PNM</option>
            </select>
          </div>
        </SlideUp>

        {/* Tabel Daftar */}
        <SlideUp delay={300}>
          <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-6">👥 Daftar Calon Anggota</h2>
            <div className="overflow-x-auto rounded-lg border border-sky-100 shadow-sm">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead className="text-gray-700 uppercase bg-sky-50/50">
                  <tr>
                    <th className="px-3 py-3 sm:px-4 sm:py-4 rounded-l-lg">No</th>
                    <th className="px-3 py-3 sm:px-4 sm:py-4">Nama</th>
                    <th className="px-3 py-3 sm:px-4 sm:py-4">Kampus</th>
                    <th className="px-3 py-3 sm:px-4 sm:py-4">Prodi</th>
                    <th className="px-3 py-3 sm:px-4 sm:py-4">Semester</th>
                    <th className="px-3 py-3 sm:px-4 sm:py-4">No. WA</th>
                    <th className="px-3 py-3 sm:px-4 sm:py-4">Status</th>
                    <th className="px-3 py-3 sm:px-4 sm:py-4 rounded-r-lg">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                        Belum ada pendaftar.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((m, index) => (
                      <tr
                        key={m.id}
                        className="hover:bg-sky-50/40 transition text-xs sm:text-sm cursor-pointer"
                        onClick={() => openModal(m)}
                      >
                        <td className="px-3 py-3 sm:px-4 sm:py-4 font-medium">{index + 1}</td>
                        <td className="px-3 py-3 sm:px-4 sm:py-4 font-medium">{m.name}</td>
                        <td className="px-3 py-3 sm:px-4 sm:py-4 text-gray-600">{m.asalKampus}</td>
                        <td className="px-3 py-3 sm:px-4 sm:py-4 text-gray-600">{m.prodi}</td>
                        <td className="px-3 py-3 sm:px-4 sm:py-4 text-gray-600">{m.semester}</td>
                        <td className="px-3 py-3 sm:px-4 sm:py-4 text-gray-600">{m.noWa}</td>
                        <td className="px-3 py-3 sm:px-4 sm:py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              m.resultStatus === 'Lulus'
                                ? 'bg-green-100 text-green-800'
                                : m.resultStatus === 'Tidak Lulus'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {m.resultStatus}
                          </span>
                        </td>
                        <td className="px-3 py-3 sm:px-4 sm:py-4 space-x-1">
                          {m.resultStatus === 'Menunggu Hasil' ? (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApproveMember(m.id);
                                }}
                                className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded transition"
                              >
                                Lulus
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRejectMember(m.id);
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded transition"
                              >
                                Tolak
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-gray-500 italic">Selesai</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </SlideUp>

        {/* Modal Detail */}
        {selectedMember && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Detail Calon Anggota</h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    &times;
                  </button>
                </div>

                {/* Foto */}
                {selectedMember.photo ? (
                  <div className="mb-6">
                    <img
                      src={selectedMember.photo}
                      alt="Foto Pengguna"
                      className="w-32 h-32 object-cover rounded-xl mx-auto border-2 border-sky-200"
                    />
                  </div>
                ) : (
                  <div className="mb-6 text-center">
                    <div className="w-32 h-32 bg-gray-200 rounded-xl mx-auto flex items-center justify-center text-gray-500 text-sm">
                      Tidak ada foto
                    </div>
                  </div>
                )}

                <div className="space-y-4 text-sm">
                  <p><strong>Nama:</strong> {selectedMember.name}</p>
                  <p><strong>Kampus:</strong> {selectedMember.asalKampus}</p>
                  <p><strong>Prodi:</strong> {selectedMember.prodi}</p>
                  <p><strong>Semester:</strong> {selectedMember.semester}</p>
                  <p><strong>No. WA:</strong> {selectedMember.noWa}</p>
                  <p><strong>Domisili:</strong> {selectedMember.domisili}</p>
                  <p><strong>Alamat:</strong> {selectedMember.alamat}</p>
                  <p><strong>Tinggal Bersama:</strong> {selectedMember.tinggalBersama}</p>
                  <p><strong>Alasan:</strong> {selectedMember.alasan}</p>
                  <p><strong>Tahu dari:</strong> {selectedMember.tahuDari}</p>
                  <p><strong>Daftar pada:</strong> {selectedMember.join}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        selectedMember.resultStatus === 'Lulus'
                          ? 'bg-green-100 text-green-800'
                          : selectedMember.resultStatus === 'Tidak Lulus'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {selectedMember.resultStatus}
                    </span>
                  </p>
                </div>

                <div className="flex gap-3 mt-8">
                  {selectedMember.resultStatus === 'Menunggu Hasil' && (
                    <>
                      <button
                        onClick={() => {
                          handleApproveMember(selectedMember.id);
                          closeModal();
                        }}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-full text-sm"
                      >
                        Lulus
                      </button>
                      <button
                        onClick={() => {
                          handleRejectMember(selectedMember.id);
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

        {/* Animasi CSS (inline) */}
        <style jsx>{`
          @keyframes slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .animate-slide-in {
            animation: slide-in 0.5s ease-out;
          }
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