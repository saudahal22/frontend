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
  const [durasi, setDurasi] = useState(60);
  const [judul, setJudul] = useState('Tes Seleksi');
  const [deskripsi, setDeskripsi] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const router = useRouter();

  // 🔐 Cek role
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const role = getUserRole();
    if (role !== 'user') {
      alert('Akses ditolak: halaman ini hanya untuk peserta.');
      router.push(role === 'admin' ? '/admin-dashboard' : '/');
      return;
    }

    fetchSoal();
  }, [router]);

  const fetchSoal = async () => {
    try {
      setError('');
      const data = await apiClient('/test/soal');

      setJudul(data.judul || 'Tes Seleksi');
      setDeskripsi(data.deskripsi || '');
      setDurasi(data.durasi_menit || 60);
      setTimeLeft((data.durasi_menit || 60) * 60);

      // Validasi waktu tes
      if (data.waktu_mulai && data.waktu_selesai) {
        const now = new Date();
        const mulai = new Date(data.waktu_mulai);
        const selesai = new Date(data.waktu_selesai);

        if (now < mulai) {
          setError(
            `Tes belum dimulai. Akan dibuka pada: ${mulai.toLocaleString('id-ID', {
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
            `Tes telah ditutup. Dibuka dari ${mulai.toLocaleString('id-ID', {
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

      if (Array.isArray(data.soal)) {
        setSoal(data.soal);
      } else {
        throw new Error('Data soal tidak valid');
      }
    } catch (err) {
      if (err.message.includes('sudah pernah mengikuti tes')) {
        setError('Anda sudah pernah mengikuti tes. Mengalihkan ke hasil...');
        setTimeout(() => router.push('/dashboard/hasil'), 1500);
        return;
      }
      if (err.message.includes('Tes belum tersedia')) {
        setError('Tes belum dikonfigurasi oleh admin.');
        setSoal([]);
      } else {
        setError('Gagal memuat soal: ' + (err.message || ''));
      }
    } finally {
      setLoading(false);
    }
  };

  // Timer
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
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

      alert(`Tes selesai!\nSkor: ${res.skor_benar}/${soal.length}\nNilai: ${res.nilai.toFixed(2)}`);
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-lg text-slate-600">Memuat soal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <FadeIn>
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 text-center border border-slate-200">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">{judul}</h1>
            {deskripsi && <p className="text-slate-600 mb-4 text-sm md:text-base">{deskripsi}</p>}

            {/* Timer Besar */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>Soal:</span>
                <span className="font-medium">{soal.length} butir</span>
              </div>

              <div
                className={`text-lg font-mono font-bold px-6 py-2 rounded-full text-white shadow-md ${
                  timeLeft <= 60
                    ? 'bg-red-600 animate-pulse'
                    : timeLeft <= 300
                    ? 'bg-orange-500'
                    : 'bg-blue-600'
                }`}
              >
                ⏳ {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-center text-sm">
              {error}
            </div>
          )}

          {/* Navigasi Soal (Indikator) */}
          {!error && soal.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-6 px-2">
              {soal.map((s, index) => {
                const sudahJawab = jawaban[s.id_soal];
                return (
                  <button
                    key={s.id_soal}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-10 h-10 rounded-full text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
                      currentQuestion === index
                        ? 'bg-blue-600 text-white shadow-md scale-105'
                        : sudahJawab
                        ? 'bg-green-100 text-green-800 border-2 border-green-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          )}

          {/* Form Soal */}
          {!error && soal.length > 0 && (
            <SlideUp delay={200}>
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                {soal.map((s, index) => (
                  <div
                    key={s.id_soal}
                    className={`bg-white p-6 rounded-xl shadow border border-slate-200 transition-all duration-300 ${
                      index === currentQuestion
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 h-0 overflow-hidden absolute inset-x-0 -z-10'
                    }`}
                    style={{ display: index === currentQuestion ? 'block' : 'none' }}
                  >
                    <h3 className="text-lg font-semibold text-slate-800 mb-5">
                      {index + 1}. {s.pertanyaan}
                    </h3>
                    <div className="space-y-3">
                      {['A', 'B', 'C', 'D'].map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            jawaban[s.id_soal] === opt
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`soal-${s.id_soal}`}
                            value={opt}
                            checked={jawaban[s.id_soal] === opt}
                            onChange={() => handleJawab(s.id_soal, opt)}
                            className="sr-only"
                          />
                          <span
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                              jawaban[s.id_soal] === opt
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-slate-400'
                            }`}
                          >
                            {opt}
                          </span>
                          <span className="text-slate-800">{s[`pilihan_${opt.toLowerCase()}`]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8">
                  <button
                    type="button"
                    onClick={goToPrev}
                    disabled={currentQuestion === 0}
                    className="px-6 py-3 bg-slate-400 disabled:bg-slate-200 text-white rounded-lg font-medium transition hover:bg-slate-500 disabled:cursor-not-allowed"
                  >
                    ← Sebelumnya
                  </button>

                  {currentQuestion < soal.length - 1 ? (
                    <button
                      type="button"
                      onClick={goToNext}
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                    >
                      Selanjutnya →
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitted}
                      className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold transition disabled:cursor-not-allowed"
                    >
                      {isSubmitted ? 'Mengirim...' : 'Selesai & Submit'}
                    </button>
                  )}
                </div>
              </form>
            </SlideUp>
          )}
        </FadeIn>
      </div>
    </div>
  );
}