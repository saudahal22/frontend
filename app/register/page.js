'use client';

import { useState } from 'react';
import { FadeIn, SlideUp } from '../../components/Animations';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    campus: '',
    major: '',
    semester: '',
    phone: '',
    city: '',
    address: '',
    livingWith: '',
    photo: null,
    reason: '',
    knowAbout: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validasi karakter hanya huruf, angka, spasi, tanda baca, dan operator matematika
  const isValidInput = (value) => {
    const regex = /^[a-zA-Z0-9\s.,!?;:'"()\-+*/]+$/;
    return regex.test(value);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name === 'photo') {
      setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
      return;
    }

    if (type === 'radio') {
      setFormData((prev) => ({ ...prev, livingWith: value }));
      return;
    }

    if (value && !isValidInput(value)) {
      setError('Dilarang menggunakan karakter');
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(''); // Hapus error jika input valid
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi semua field wajib
    const requiredFields = ['fullName', 'campus', 'major', 'semester', 'phone', 'city', 'address', 'livingWith', 'reason', 'knowAbout', 'photo'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        setError('Semua field wajib diisi');
        return;
      }
    }

    // Validasi nomor WA
    if (!/^[0-9]{9,13}$|^\+?62[0-9]{9,12}$/.test(formData.phone)) {
      setError('Nomor WA tidak valid (contoh: 08123456789 atau +628123456789)');
      return;
    }

    // Validasi format file foto
    const file = formData.photo;
    if (file && file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
      setError('Foto harus dalam format JPG/JPEG');
      return;
    }

    setError('');
    setLoading(true);

    // Siapkan form data
    const submitData = new FormData();
    submitData.append('fullName', formData.fullName);
    submitData.append('campus', formData.campus);
    submitData.append('major', formData.major);
    submitData.append('semester', formData.semester);
    submitData.append('phone', formData.phone);
    submitData.append('city', formData.city);
    submitData.append('address', formData.address);
    submitData.append('livingWith', formData.livingWith);
    submitData.append('reason', formData.reason);
    submitData.append('knowAbout', formData.knowAbout);
    submitData.append('photo', formData.photo);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        body: submitData,
      });

      const result = await res.json();

      if (res.ok) {
        alert('Pendaftaran berhasil! Data telah dikirim ke admin.');
        // Reset form
        setFormData({
          fullName: '',
          campus: '',
          major: '',
          semester: '',
          phone: '',
          city: '',
          address: '',
          livingWith: '',
          photo: null,
          reason: '',
          knowAbout: '',
        });
        // Redirect ke login
        window.location.href = '/login';
      } else {
        setError(result.error || 'Gagal mendaftar. Coba lagi.');
      }
    } catch (err) {
      setError('Tidak dapat terhubung ke server. Periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <FadeIn>
        <div className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-white/60">
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
              {/* Nama Lengkap */}
              <SlideUp delay={200}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-500 bg-gray-50 transition"
                    placeholder="Contoh: Saudah Al"
                  />
                </div>
              </SlideUp>

              {/* Asal Kampus */}
              <SlideUp delay={300}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asal Kampus</label>
                  <input
                    type="text"
                    name="campus"
                    value={formData.campus}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-500 bg-gray-50 transition"
                    placeholder="Contoh: Universitas Hasanuddin"
                  />
                </div>
              </SlideUp>

              {/* Program Studi */}
              <SlideUp delay={400}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Program Studi</label>
                  <input
                    type="text"
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-500 bg-gray-50 transition"
                    placeholder="Contoh: Teknik Informatika"
                  />
                </div>
              </SlideUp>

              {/* Semester */}
              <SlideUp delay={500}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-500 bg-gray-50 transition"
                  >
                    <option value="">Pilih semester</option>
                    {[1, 3].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>
              </SlideUp>

              {/* No. WA */}
              <SlideUp delay={600}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. WA (Aktif)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-500 bg-gray-50 transition"
                    placeholder="Contoh: 08123456789"
                  />
                </div>
              </SlideUp>

              {/* Domisili (Kota) */}
              <SlideUp delay={700}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Domisili (Kota)</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-500 bg-gray-50 transition"
                    placeholder="Contoh: Makassar"
                  />
                </div>
              </SlideUp>

              {/* Alamat Sekarang */}
              <SlideUp delay={800}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Sekarang</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-500 bg-gray-50 transition resize-none"
                    placeholder="Contoh: Jl. Teknologi No. 1, Kel. Tamalanrea"
                  ></textarea>
                </div>
              </SlideUp>

              {/* Tinggal Bersama */}
              <SlideUp delay={850}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tinggal Bersama</label>
                  <select
                    name="livingWith"
                    value={formData.livingWith}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-500 bg-gray-50 transition"
                  >
                    <option value="">Pilih tempat tinggal</option>
                    {['Keluarga', 'Kost', 'Rumah'].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </SlideUp>

              {/* Upload Foto */}
              <SlideUp delay={900}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Foto*</label>
                  <input
                    type="file"
                    id="photo-upload"
                    name="photo"
                    accept=".jpg, .jpeg"
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
                  {formData.photo && (
                    <p className="text-sm text-green-600 mt-2">
                      ✅ File terpilih: <span className="font-medium">{formData.photo.name}</span>
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Pastikan foto latar biru dan format .jpg
                  </p>
                </div>
              </SlideUp>

              {/* Alasan Masuk Coconut */}
              <SlideUp delay={950}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alasan Masuk Coconut</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-500 bg-gray-50 transition resize-none"
                    placeholder="Contoh: Saya ingin belajar teknologi dan berkolaborasi dengan profesional"
                  ></textarea>
                </div>
              </SlideUp>

              {/* Apa yang kamu ketahui tentang Coconut */}
              <SlideUp delay={1000}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apa yang Anda Ketahui Tentang Coconut?</label>
                  <textarea
                    name="knowAbout"
                    value={formData.knowAbout}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-500 bg-gray-50 transition resize-none"
                    placeholder="Contoh: Coconut adalah komunitas teknologi yang fokus pada riset dan pengembangan"
                  ></textarea>
                </div>
              </SlideUp>

              {/* Tombol Submit */}
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

            {/* Info Tambahan */}
            <SlideUp delay={1100} className="mt-6 text-sm text-gray-600">
              <p className="text-green-600 text-right text-sm pt-2">✅ Mengisi formulir ini mendapat penambahan poin seleksi.</p>
            </SlideUp>
          </div>
        </div>
      </FadeIn>
    </div>

    
  );
}