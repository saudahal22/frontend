'use client';

import { useState, useEffect } from 'react';
import { FadeIn, SlideUp } from '../../../components/Animations';
import { apiClient } from '../../../lib/apiClient';
import { useRouter } from 'next/navigation';
import { getUserRole } from '../../../lib/auth';

export default function MaterialClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [soal, setSoal] = useState([]);
  const [jawaban, setJawaban] = useState({});
  const [durasi, setDurasi] = useState(60); // Default fallback
  const [judul, setJudul] = useState('Tes Seleksi');
  const [deskripsi, setDeskripsi] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const router = useRouter();

  // 🔐 Cek role dan ambil data
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const role = getUserRole();
    if (role !== 'user') {
      alert('Akses ditolak: halaman ini hanya untuk user.');
      router.push(role === 'admin' ? '/admin-dashboard' : '/');
      return;
    }

    fetchSoal();
  }, [router]);

  const fetchSoal = async () => {
    try {
      setError('');
      const data = await apiClient('/test/soal');

      // Simpan info tes
      setJudul(data.judul || 'Tes Seleksi');
      setDeskripsi(data.deskripsi || '');
      setDurasi(data.durasi_menit || 60);
      setTimeLeft((data.durasi_menit || 60) * 60);

      // Cek waktu aktif tes
      if (data.waktu_mulai && data.waktu_selesai) {
        const now = new Date();
        const mulai = new Date(data.waktu_mulai);
        const selesai = new Date(data.waktu_selesai);

        if (now < mulai) {
          setError(
            `⏳ Tes belum dimulai. Akan dibuka pada: ${mulai.toLocaleString('id-ID', {
              dateStyle: 'full',
              timeStyle: 'short',
            })}`
          );
          setSoal([]);
          setLoading(false);
          return;
        }

        if (now > selesai) {
          setError(
            `🔒 Tes telah ditutup. Dibuka dari ${mulai.toLocaleString('id-ID', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })} hingga ${selesai.toLocaleString('id-ID', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}.`
          );
          setSoal([]);
          setLoading(false);
          return;
        }
      }

      // Jika lolos pengecekan waktu, tampilkan soal
      if (Array.isArray(data.soal)) {
        setSoal(data.soal);
      } else {
        throw new Error('Data soal tidak valid');
      }
    } catch (err) {
      // Cek apakah error karena user sudah pernah tes
      if (err.message.includes('sudah pernah mengikuti tes')) {
        setError('✅ Anda sudah pernah mengikuti tes. Hasil sudah tersedia di halaman hasil.');
        setTimeout(() => {
          router.push('/dashboard/hasil');
        }, 2000);
        return;
      }

      // Cek jika tes belum tersedia
      if (err.message.includes('Tes belum tersedia')) {
        setError('📋 Tes belum dikonfigurasi oleh admin.');
        setSoal([]);
        setLoading(false);
        return;
      }

      // Error umum
      setError('❌ Gagal memuat soal: ' + (err.message || 'Terjadi kesalahan'));
    } finally {
      setLoading(false);
    }
  };

  // Timer: hanya aktif jika soal dimuat dan belum submit
  useEffect(() => {
    if (!timeLeft || isSubmitted || soal.length === 0 || error) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, soal.length, error]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleJawab = (idSoal, jawab) => {
    setJawaban((prev) => ({ ...prev, [idSoal]: jawab }));
  };

  const handleSubmit = async () => {
    if (isSubmitted || soal.length === 0) return;
    setIsSubmitted(true);

    try {
      const res = await apiClient('/test/submit', {
        method: 'POST',
        body: JSON.stringify({ jawaban }),
      });

      alert(
        `🎉 Tes selesai!\nSkor: ${res.skor_benar}/${soal.length}\nNilai: ${res.nilai.toFixed(2)}`
      );
      router.push('/dashboard/hasil');
    } catch (err) {
      setError('Gagal submit jawaban: ' + (err.message || ''));
    }
  };

  const goToNext = () => {
    if (currentQuestion < soal.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Memuat soal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          {/* Header */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">{judul}</h1>
            {deskripsi && <p className="text-gray-600 text-center mb-4">{deskripsi}</p>}
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 gap-2">
              <span>Total soal: {soal.length}</span>
              <span className="font-mono bg-red-100 text-red-800 px-3 py-1 rounded-full">
                ⏰ {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Navigasi Soal */}
          <div className="flex justify-center mb-4">
            {soal.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 mx-1 rounded-full text-sm font-bold transition ${
                  currentQuestion === index
                    ? 'bg-blue-600 text-white'
                    : jawaban[soal[index]?.id_soal]
                    ? 'bg-green-200 text-green-800'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Form Soal */}
          <SlideUp delay={200}>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              {soal.map((s, index) => (
                <div
                  key={s.id_soal}
                  className={`bg-white p-6 rounded-2xl shadow mb-6 transition-opacity duration-300 ${
                    index === currentQuestion ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
                  }`}
                  style={{ display: index === currentQuestion ? 'block' : 'none' }}
                >
                  <h3 className="font-bold text-gray-800 mb-4">
                    {index + 1}. {s.pertanyaan}
                  </h3>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <label key={opt} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name={`soal-${s.id_soal}`}
                          value={opt}
                          checked={jawaban[s.id_soal] === opt}
                          onChange={() => handleJawab(s.id_soal, opt)}
                          className="text-blue-600"
                        />
                        <span>{opt}. {s[`pilihan_${opt.toLowerCase()}`]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={goToPrev}
                  disabled={currentQuestion === 0}
                  className="bg-gray-400 disabled:bg-gray-200 text-white px-6 py-2 rounded-full"
                >
                  ← Sebelumnya
                </button>
                {currentQuestion < soal.length - 1 ? (
                  <button
                    type="button"
                    onClick={goToNext}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
                  >
                    Selanjutnya →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitted}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 disabled:from-gray-400 disabled:to-gray-400 text-white px-8 py-3 rounded-full font-semibold"
                  >
                    {isSubmitted ? 'Sedang Submit...' : 'Submit Jawaban'}
                  </button>
                )}
              </div>
            </form>
          </SlideUp>
        </FadeIn>
      </div>
    </div>
  );
}