// app/dashboard/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FadeIn, SlideUp } from '../../components/Animations';

export default function DashboardCalonAnggota() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Statistik
  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingRequests: 0,
    eventsThisMonth: 3,
    newMembers: 0,
  });

  // Data
  const [members, setMembers] = useState([]);
  const [pendingReschedules, setPendingReschedules] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [testSchedules, setTestSchedules] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);

  // Form
  const [newNotif, setNewNotif] = useState({ title: '', content: '', scheduled: '' });
  const [newSchedule, setNewSchedule] = useState({ title: '', date: '', time: '', location: '' });
  const [newMaterial, setNewMaterial] = useState({ title: '', type: '', link: '' });

  // Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCampus, setFilterCampus] = useState('');

  const [submitStatus, setSubmitStatus] = useState('');

  // Cegah inisialisasi berulang
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // 1. Data default
    const defaultMembers = [
      {
        id: 1,
        name: 'Saudah Al',
        email: 'saudah@gmail.com',
        asalKampus: 'Universitas Hasanuddin',
        prodi: 'Teknik Informatika',
        semester: '3',
        noWa: '08123456789',
        domisili: 'Makassar',
        alamat: 'Jl. Teknologi No. 1, Tamalanrea',
        tinggalBersama: 'Kost',
        alasan: 'Ingin belajar teknologi dan berkolaborasi dengan profesional.',
        tahuDari: 'Dari teman yang sudah bergabung.',
        role: 'Calon Anggota',
        join: '13 Agustus 2025',
        resultStatus: 'Menunggu Hasil',
      },
      {
        id: 2,
        name: 'Arsila Puteri',
        email: 'arsila@gmail.com',
        asalKampus: 'Politeknik Negeri Makassar',
        prodi: 'Sistem Informasi',
        semester: '1',
        noWa: '082211223344',
        domisili: 'Gowa',
        alamat: 'Jl. Pendidikan No. 5',
        tinggalBersama: 'Keluarga',
        alasan: 'Tertarik dengan kegiatan riset di Coconut.',
        tahuDari: 'Instagram @coconut.or.id',
        role: 'Calon Anggota',
        join: '13 Agustus 2025',
        resultStatus: 'Menunggu Hasil',
      },
    ];

    const defaultRequests = [
      { 
        id: 1, 
        name: 'Saudah Al', 
        current: '15 April 2025', 
        requested: '16 April 2025', 
        reason: 'Acara keluarga', 
        email: 'saudah@gmail.com',
        status: 'Menunggu',
      },
    ];

    const defaultNotifs = [
      { 
        id: 1, 
        title: 'Test Wawancara', 
        content: 'Dilaksanakan 12 Desember 2025', 
        scheduled: '2025-12-12' 
      },
    ];

    const defaultSchedules = [
      { id: 1, title: 'Tes Tulis', date: '15 April 2025', time: '09:00 - 11:00', location: 'Algo Cofee dan Snack' },
    ];

    const defaultMaterials = [
      { id: 1, title: 'Panduan Dasar Pemrograman', type: 'PDF', link: '#', uploaded: '10 Apr 2025' },
    ];

    // 2. Ambil dari localStorage atau gunakan default
    const savedMembers = JSON.parse(localStorage.getItem('calonAnggota')) || defaultMembers;
    const savedRequests = JSON.parse(localStorage.getItem('rescheduleRequests')) || defaultRequests;
    const savedNotifs = JSON.parse(localStorage.getItem('coconut_notifications')) || defaultNotifs;
    const savedSchedules = JSON.parse(localStorage.getItem('testSchedules')) || defaultSchedules;
    const savedMaterials = JSON.parse(localStorage.getItem('studyMaterials')) || defaultMaterials;

    // 3. Simpan default jika belum ada
    if (!localStorage.getItem('calonAnggota')) {
      localStorage.setItem('calonAnggota', JSON.stringify(defaultMembers));
    }
    if (!localStorage.getItem('rescheduleRequests')) {
      localStorage.setItem('rescheduleRequests', JSON.stringify(defaultRequests));
    }
    if (!localStorage.getItem('coconut_notifications')) {
      localStorage.setItem('coconut_notifications', JSON.stringify(defaultNotifs));
    }
    if (!localStorage.getItem('testSchedules')) {
      localStorage.setItem('testSchedules', JSON.stringify(defaultSchedules));
    }
    if (!localStorage.getItem('studyMaterials')) {
      localStorage.setItem('studyMaterials', JSON.stringify(defaultMaterials));
    }

    // 4. Set state
    setMembers(savedMembers);
    setPendingReschedules(savedRequests);
    setNotifications(savedNotifs);
    setTestSchedules(savedSchedules);
    setStudyMaterials(savedMaterials);

    setStats({
      totalMembers: savedMembers.length,
      pendingRequests: savedRequests.filter(r => r.status === 'Menunggu').length,
      eventsThisMonth: 3,
      newMembers: savedMembers.filter(m => m.resultStatus === 'Menunggu Hasil').length,
    });
  }, []);

  // Simpan ke localStorage & update state
  const saveToStorage = (key, data, setter) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      setter(data);
    } catch (error) {
      console.error('Gagal simpan ke localStorage:', error);
    }
  };

  // Handle Approve/Reject Reschedule
  const handleApproveRequest = (id) => {
    const updated = pendingReschedules.map(req =>
      req.id === id ? { ...req, status: 'Disetujui' } : req
    );
    saveToStorage('rescheduleRequests', updated, setPendingReschedules);

    const notif = {
      id: Date.now(),
      message: `Pengajuan ubah jadwal Anda telah disetujui.`,
      time: 'Baru',
      read: false,
    };
    const userNotifs = JSON.parse(localStorage.getItem(`notifs_${id}`) || '[]');
    localStorage.setItem(`notifs_${id}`, JSON.stringify([notif, ...userNotifs]));

    setSubmitStatus('Pengajuan disetujui. Notifikasi dikirim.');
  };

  const handleRejectRequest = (id) => {
    const updated = pendingReschedules.map(req =>
      req.id === id ? { ...req, status: 'Ditolak' } : req
    );
    saveToStorage('rescheduleRequests', updated, setPendingReschedules);

    const notif = {
      id: Date.now(),
      message: `Pengajuan ubah jadwal Anda ditolak.`,
      time: 'Baru',
      read: false,
    };
    const userNotifs = JSON.parse(localStorage.getItem(`notifs_${id}`) || '[]');
    localStorage.setItem(`notifs_${id}`, JSON.stringify([notif, ...userNotifs]));

    setSubmitStatus('Pengajuan ditolak. Notifikasi dikirim.');
  };

  // Handle Lulus/Tidak Lulus
  const handleApproveMember = (id) => {
    const updated = members.map(m =>
      m.id === id ? { ...m, resultStatus: 'Lulus' } : m
    );
    saveToStorage('calonAnggota', updated, setMembers);
    setSubmitStatus(`${updated.find(m => m.id === id)?.name || 'Pengguna'} dinyatakan LULUS.`);

    const notif = {
      id: Date.now(),
      message: 'Selamat! Anda diterima sebagai anggota Coconut.',
      time: 'Baru',
      read: false,
    };
    const userNotifs = JSON.parse(localStorage.getItem(`notifs_${id}`) || '[]');
    localStorage.setItem(`notifs_${id}`, JSON.stringify([notif, ...userNotifs]));
  };

  const handleRejectMember = (id) => {
    const updated = members.map(m =>
      m.id === id ? { ...m, resultStatus: 'Tidak Lulus' } : m
    );
    saveToStorage('calonAnggota', updated, setMembers);
    setSubmitStatus(`${updated.find(m => m.id === id)?.name || 'Pengguna'} dinyatakan TIDAK LULUS.`);

    const notif = {
      id: Date.now(),
      message: 'Maaf, Anda belum lolos seleksi kali ini.',
      time: 'Baru',
      read: false,
    };
    const userNotifs = JSON.parse(localStorage.getItem(`notifs_${id}`) || '[]');
    localStorage.setItem(`notifs_${id}`, JSON.stringify([notif, ...userNotifs]));
  };

  // Tambah Notifikasi
  const handleAddNotification = (e) => {
    e.preventDefault();
    if (!newNotif.title || !newNotif.content || !newNotif.scheduled) {
      setSubmitStatus('Semua kolom wajib diisi.');
      return;
    }

    const newNotifData = { id: Date.now(), ...newNotif };
    const updated = [newNotifData, ...notifications];
    saveToStorage('coconut_notifications', updated, setNotifications);
    setNewNotif({ title: '', content: '', scheduled: '' });
    setSubmitStatus('Pemberitahuan berhasil dikirim ke semua calon anggota.');
  };

  // Tambah Jadwal
  const handleAddSchedule = (e) => {
    e.preventDefault();
    if (!newSchedule.title || !newSchedule.date || !newSchedule.time || !newSchedule.location) {
      setSubmitStatus('Isi semua kolom jadwal.');
      return;
    }

    const newScheduleData = { id: Date.now(), ...newSchedule };
    const updated = [newScheduleData, ...testSchedules];
    saveToStorage('testSchedules', updated, setTestSchedules);
    setNewSchedule({ title: '', date: '', time: '', location: '' });
    setSubmitStatus(`Jadwal "${newSchedule.title}" berhasil dikirim.`);
  };

  // Tambah Materi
  const handleAddMaterial = (e) => {
    e.preventDefault();
    if (!newMaterial.title || !newMaterial.type || !newMaterial.link) {
      setSubmitStatus('Isi semua kolom materi.');
      return;
    }

    const newMaterialData = {
      id: Date.now(),
      ...newMaterial,
      uploaded: new Date().toLocaleDateString('id-ID'),
    };
    const updated = [newMaterialData, ...studyMaterials];
    saveToStorage('studyMaterials', updated, setStudyMaterials);
    setNewMaterial({ title: '', type: '', link: '' });
    setSubmitStatus(`Materi "${newMaterial.title}" berhasil dikirim.`);
  };

  // Cek login
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Akses Ditolak</h2>
          <p className="text-sm text-gray-600">Anda tidak memiliki izin sebagai admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gradient-to-br from-sky-50 via-white to-blue-50 py-16 sm:py-20">
      <main className="relative overflow-hidden py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <FadeIn>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 sm:mb-6 bg-gradient-to-r from-blue-800 via-sky-600 to-blue-900 bg-clip-text text-transparent leading-tight">
              Dashboard Admin
            </h1>
            <p className="text-sm sm:text-lg text-gray-600 text-center max-w-3xl mx-auto mb-8 sm:mb-12">
              Kelola calon anggota, jadwal, dan pemberitahuan dengan mudah.
            </p>
          </FadeIn>

          {/* Statistik */}
          <SlideUp delay={200}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {[
                { label: 'Total Calon Anggota', value: stats.totalMembers, icon: '👥', color: 'from-sky-400 to-blue-500' },
                { label: 'Pengajuan Jadwal', value: stats.pendingRequests, icon: '⏳', color: 'from-amber-400 to-orange-500' },
                { label: 'Acara Bulan Ini', value: stats.eventsThisMonth, icon: '📅', color: 'from-green-400 to-emerald-500' },
                { label: 'Anggota Baru', value: stats.newMembers, icon: '🎉', color: 'from-purple-400 to-pink-500' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-white/90 to-sky-50/90 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 backdrop-blur-sm text-center"
                >
                  <div className="text-3xl sm:text-4xl mb-2">{stat.icon}</div>
                  <p className="text-xl sm:text-2xl font-bold text-blue-900">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </SlideUp>

          {/* Pengajuan Ubah Jadwal & Kelola Pemberitahuan */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <SlideUp delay={300}>
              <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4 sm:mb-6 flex items-center">📅 Pengajuan Ubah Jadwal</h2>
                {pendingReschedules.length === 0 ? (
                  <p className="text-gray-500 text-sm">Tidak ada pengajuan.</p>
                ) : (
                  <div className="space-y-3 max-h-48 sm:max-h-60 overflow-y-auto pr-2">
                    {pendingReschedules.map((req) => (
                      <div key={req.id} className="p-4 bg-white/70 rounded-lg border border-sky-100 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{req.name}</h3>
                          <span className="text-xs text-gray-500">{req.email}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1"><strong>Saat Ini:</strong> {req.current}</p>
                        <p className="text-xs sm:text-sm text-blue-600 mb-2"><strong>Diminta:</strong> {req.requested}</p>
                        <p className="text-xs sm:text-sm text-gray-700 mb-3 italic">{req.reason}</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproveRequest(req.id)}
                            disabled={req.status !== 'Menunggu'}
                            className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-full transition disabled:opacity-50"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => handleRejectRequest(req.id)}
                            disabled={req.status !== 'Menunggu'}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full transition disabled:opacity-50"
                          >
                            Tolak
                          </button>
                        </div>
                        <p className="text-xs mt-2 text-gray-700">Status: <strong>{req.status}</strong></p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </SlideUp>

            <SlideUp delay={400}>
              <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4 sm:mb-6">🔔 Kelola Pemberitahuan</h2>
                <form onSubmit={handleAddNotification} className="space-y-3 mb-6">
                  <input
                    type="text"
                    placeholder="Judul pemberitahuan"
                    value={newNotif.title}
                    onChange={(e) => setNewNotif({ ...newNotif, title: e.target.value })}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-sm"
                  />
                  <textarea
                    placeholder="Isi pemberitahuan"
                    value={newNotif.content}
                    onChange={(e) => setNewNotif({ ...newNotif, content: e.target.value })}
                    rows="3"
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-sm"
                  />
                  <input
                    type="date"
                    value={newNotif.scheduled}
                    onChange={(e) => setNewNotif({ ...newNotif, scheduled: e.target.value })}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-sm"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold px-4 py-2 rounded-full hover:from-sky-600 hover:to-blue-700 transition shadow text-sm"
                  >
                    Tambah Pemberitahuan
                  </button>
                </form>
                {submitStatus && (
                  <p className="text-green-600 text-xs sm:text-sm mb-4">{submitStatus}</p>
                )}
                <div className="space-y-3 max-h-48 sm:max-h-60 overflow-y-auto pr-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="font-medium text-blue-800 text-sm">{n.title}</p>
                      <p className="text-xs text-gray-700 mt-1">{n.content}</p>
                      <p className="text-xs text-gray-500 mt-1">Tanggal: {n.scheduled}</p>
                    </div>
                  ))}
                </div>
              </div>
            </SlideUp>
          </div>

          {/* Tambah Jadwal & Materi */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <SlideUp delay={450}>
              <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4 sm:mb-6">📅 Tambah Jadwal Tes</h2>
                <form onSubmit={handleAddSchedule} className="space-y-3">
                  {['Judul', 'Tanggal', 'Waktu', 'Lokasi'].map((label, i) => (
                    <div key={i}>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <input
                        type={i === 1 ? 'date' : 'text'}
                        value={i === 0 ? newSchedule.title : i === 1 ? newSchedule.date : i === 2 ? newSchedule.time : newSchedule.location}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (i === 0) setNewSchedule(prev => ({ ...prev, title: val }));
                          if (i === 1) setNewSchedule(prev => ({ ...prev, date: val }));
                          if (i === 2) setNewSchedule(prev => ({ ...prev, time: val }));
                          if (i === 3) setNewSchedule(prev => ({ ...prev, location: val }));
                        }}
                        placeholder={i === 0 ? 'Contoh: Tes Wawancara' : ''}
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-sm"
                      />
                    </div>
                  ))}
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-4 py-2 rounded-full hover:from-green-600 hover:to-emerald-700 transition shadow text-sm"
                  >
                    Tambah Jadwal
                  </button>
                </form>
              </div>
            </SlideUp>

            <SlideUp delay={500}>
              <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4 sm:mb-6">📚 Tambah Soal</h2>
                <form onSubmit={handleAddMaterial} className="space-y-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Judul</label>
                    <input
                      type="text"
                      value={newMaterial.title}
                      onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                      placeholder="Contoh: Panduan Git"
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Jenis</label>
                    <select
                      value={newMaterial.type}
                      onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })}
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-sm"
                    >
                      <option value="">Pilih jenis</option>
                      <option value="PDF">PDF</option>
                      <option value="Link">Link</option>
                      <option value="Video">Video</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Link / File</label>
                    <input
                      type="text"
                      value={newMaterial.link}
                      onChange={(e) => setNewMaterial({ ...newMaterial, link: e.target.value })}
                      placeholder="https://drive.google.com/..."
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold px-4 py-2 rounded-full hover:from-purple-600 hover:to-pink-700 transition shadow text-sm"
                  >
                    Tambah Soal
                  </button>
                </form>
              </div>
            </SlideUp>
          </div>

          {/* Jadwal Tes yang Dikirim */}
          <SlideUp delay={550}>
            <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4 sm:mb-6">📅 Jadwal Tes yang Dikirim</h2>
              <div className="space-y-3 max-h-48 sm:max-h-60 overflow-y-auto pr-2">
                {testSchedules.map((sched) => (
                  <div key={sched.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="font-medium text-blue-800 text-sm">{sched.title}</p>
                    <p className="text-xs text-gray-700 mt-1">{sched.date} | {sched.time}</p>
                    <p className="text-xs text-gray-600">{sched.location}</p>
                  </div>
                ))}
              </div>
            </div>
          </SlideUp>

          {/* Pencarian & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              placeholder="Cari berdasarkan nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 sm:p-3 border border-gray-300 rounded-lg flex-1 text-sm"
            />
            <select
              value={filterCampus}
              onChange={(e) => setFilterCampus(e.target.value)}
              className="p-2 sm:p-3 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Semua Kampus</option>
              <option value="Universitas Hasanuddin">Unhas</option>
              <option value="Politeknik Negeri Makassar">PNM</option>
            </select>
          </div>

          {/* Daftar Calon Anggota */}
          <SlideUp delay={650}>
            <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4 sm:mb-6">👥 Daftar Calon Anggota</h2>
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
                    {members
                      .filter(m =>
                        m.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                        (filterCampus ? m.asalKampus === filterCampus : true)
                      )
                      .map((m, index) => (
                        <tr key={m.id} className="hover:bg-sky-50/40 transition text-xs sm:text-sm">
                          <td className="px-3 py-3 sm:px-4 sm:py-4 font-medium">{index + 1}</td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 font-medium">{m.name}</td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 text-gray-600">{m.asalKampus}</td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 text-gray-600">{m.prodi}</td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 text-gray-600">{m.semester}</td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 text-gray-600">{m.noWa}</td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              m.resultStatus === 'Lulus'
                                ? 'bg-green-100 text-green-800'
                                : m.resultStatus === 'Tidak Lulus'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {m.resultStatus}
                            </span>
                          </td>
                          <td className="px-3 py-3 sm:px-4 sm:py-4 space-x-1">
                            <button
                              onClick={() => handleApproveMember(m.id)}
                              className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded transition"
                            >
                              Lulus
                            </button>
                            <button
                              onClick={() => handleRejectMember(m.id)}
                              className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded transition"
                            >
                              Tolak
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </SlideUp>

          {/* Aktivitas Terbaru */}
          <SlideUp delay={700}>
            <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4 sm:mb-6">🔄 Aktivitas Terbaru</h2>
              <div className="space-y-3 max-h-48 sm:max-h-60 overflow-y-auto pr-2">
                <div className="flex items-center p-3 bg-white/60 rounded-lg border border-gray-100">
                  <div className="w-3 h-3 rounded-full mr-3 bg-yellow-500"></div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-800">Pengajuan ubah jadwal</p>
                    <p className="text-xs text-gray-500">oleh Saudah Al • 2 jam lalu</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-white/60 rounded-lg border border-gray-100">
                  <div className="w-3 h-3 rounded-full mr-3 bg-blue-500"></div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-800">Pemberitahuan dikirim</p>
                    <p className="text-xs text-gray-500">oleh System • 1 hari lalu</p>
                  </div>
                </div>
              </div>
            </div>
          </SlideUp>
        </div>
      </main>
    </div>
  );
}