// app/register/page.js
'use client';

import { useState, useEffect } from 'react';
import { FadeIn, SlideUp } from '../../components/Animations';
import { apiClient } from '../../lib/apiClient';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    asal_kampus: '',
    prodi: '',
    semester: '',
    no_wa: '',
    domisili: '',
    alamat_sekarang: '',
    tinggal_dengan: '',
    alasan_masuk: '',
    pengetahuan_coconut: '',
    foto: null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const router = useRouter();

  // Cek status login saat halaman dimuat
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect ke login jika belum login
      router.push('/login');
      return;
    }

    setIsLoggedIn(true);
    setLoadingPage(false);
  }, [router]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name === 'foto') {
      setFormData((prev) => ({ ...prev, foto: e.target.files[0] }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validasi frontend
    if (!formData.nama_lengkap || !formData.asal_kampus || !formData.prodi || !formData.no_wa) {
      setError('Nama, asal kampus, program studi, dan nomor WA wajib diisi.');
      setLoading(false);
      return;
    }

    if (!/^[0-9]{9,13}$|^\+?62[0-9]{9,12}$/.test(formData.no_wa)) {
      setError('Nomor WA tidak valid (contoh: 08123456789)');
      setLoading(false);
      return;
    }

    if (!formData.foto) {
      setError('Foto wajib diunggah dalam format JPG/JPEG.');
      setLoading(false);
      return;
    }

    const file = formData.foto;
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setError('Hanya file JPG, JPEG, dan PNG yang diperbolehkan.');
      setLoading(false);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran foto maksimal 2 MB.');
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'foto') {
        formDataToSend.append(key, formData[key]);
      }
    });
    formDataToSend.append('foto', formData.foto);

    try {
      await apiClient('/pendaftar/create', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setShowSuccessModal(true);
    } catch (err) {
      setError(err.message || 'Gagal mendaftar. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Tampilkan loading selama pengecekan login
  if (loadingPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Memeriksa status login...</p>
      </div>
    );
  }

  // Jika sudah di-redirect, jangan render apapun
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <FadeIn>
        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-white/60">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white p-8 text-center">
            <h1 className="text-3xl font-bold">Gabung Bersama Coconut</h1>
            <p className="text-sky-100 mt-2">Isi data di bawah untuk mendaftar sebagai calon anggota</p>
          </div>

          {/* Form */}
          <div className="p-8 md:p-10">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input seperti sebelumnya */}
              <SlideUp delay={200}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    name="nama_lengkap"
                    value={formData.nama_lengkap}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 bg-gray-50 transition"
                    placeholder="Contoh: Saudah Al"
                  />
                </div>
              </SlideUp>

              <SlideUp delay={300}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asal Kampus *</label>
                  <input
                    type="text"
                    name="asal_kampus"
                    value={formData.asal_kampus}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 bg-gray-50 transition"
                    placeholder="Contoh: Universitas Hasanuddin"
                  />
                </div>
              </SlideUp>

              <SlideUp delay={400}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Program Studi *</label>
                  <input
                    type="text"
                    name="prodi"
                    value={formData.prodi}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 bg-gray-50 transition"
                    placeholder="Contoh: Teknik Informatika"
                  />
                </div>
              </SlideUp>

              <SlideUp delay={500}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 bg-gray-50 transition"
                  >
                    <option value="">Pilih semester</option>
                    <option value="1">Semester 1</option>
                    <option value="3">Semester 3</option>
                  </select>
                </div>
              </SlideUp>

              <SlideUp delay={600}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. WA (Aktif) *</label>
                  <input
                    type="tel"
                    name="no_wa"
                    value={formData.no_wa}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 bg-gray-50 transition"
                    placeholder="Contoh: 08123456789"
                  />
                </div>
              </SlideUp>

              <SlideUp delay={700}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Domisili (Kota)</label>
                  <input
                    type="text"
                    name="domisili"
                    value={formData.domisili}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 bg-gray-50 transition"
                    placeholder="Contoh: Makassar"
                  />
                </div>
              </SlideUp>

              <SlideUp delay={800}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Sekarang</label>
                  <textarea
                    name="alamat_sekarang"
                    value={formData.alamat_sekarang}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 bg-gray-50 resize-none transition"
                    placeholder="Contoh: Jl. Teknologi No. 1, Tamalanrea"
                  ></textarea>
                </div>
              </SlideUp>

              <SlideUp delay={850}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tinggal Bersama</label>
                  <select
                    name="tinggal_dengan"
                    value={formData.tinggal_dengan}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 bg-gray-50 transition"
                  >
                    <option value="">Pilih tempat tinggal</option>
                    <option value="Keluarga">Keluarga</option>
                    <option value="Kost">Kost</option>
                    <option value="Rumah">Rumah</option>
                  </select>
                </div>
              </SlideUp>

              <SlideUp delay={900}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Foto *</label>
                  <input
                    type="file"
                    id="photo-upload"
                    name="foto"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-full shadow-md cursor-pointer hover:scale-105 hover:shadow-lg transition-transform duration-300 ease-out"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                    <span className="font-medium">Upload Foto</span>
                  </label>
                  {formData.foto && (
                    <p className="text-sm text-green-600 mt-2">
                      ✅ Terpilih: <span className="font-medium">{formData.foto.name}</span>
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Format: JPG/JPEG/PNG | Maks 2 MB | Latar: Biru
                  </p>
                </div>
              </SlideUp>

              <SlideUp delay={950}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alasan Masuk Coconut</label>
                  <textarea
                    name="alasan_masuk"
                    value={formData.alasan_masuk}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 bg-gray-50 resize-none transition"
                    placeholder="Contoh: Saya ingin belajar teknologi dan berkolaborasi dengan profesional"
                  ></textarea>
                </div>
              </SlideUp>

              <SlideUp delay={1000}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apa yang Anda Ketahui Tentang Coconut?</label>
                  <textarea
                    name="pengetahuan_coconut"
                    value={formData.pengetahuan_coconut}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 bg-gray-50 resize-none transition"
                    placeholder="Contoh: Coconut adalah komunitas teknologi yang fokus pada riset dan pengembangan"
                  ></textarea>
                </div>
              </SlideUp>

              <SlideUp delay={1050} className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-900 to-sky-700 text-white font-semibold py-3 rounded-xl hover:from-blue-800 hover:to-sky-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        ></path>
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    'Daftar Sekarang'
                  )}
                </button>
              </SlideUp>
            </form>

            <SlideUp delay={1100} className="mt-6 text-sm text-gray-600">
              <p className="text-green-600 text-right text-sm pt-2">✅ Mengisi formulir ini mendapat penambahan poin seleksi.</p>
            </SlideUp>
          </div>
        </div>
      </FadeIn>

      {/* Modal Sukses */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Berhasil!</h3>
            <p className="text-gray-600 mb-6">Pendaftaran berhasil dikirim. Hasil akan diumumkan melalui status keaanggotaan dan email resmi</p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                router.push('/dashboard/profile');
              }}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition"
            >
              Ke Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
