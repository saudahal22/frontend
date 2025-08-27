// app/dashboard/material/page.js
'use client';

import { useState, useEffect } from 'react';
import { FadeIn, SlideUp } from '../../../components/Animations';
import { apiClient } from '../../../lib/apiClient';
import { useRouter } from 'next/navigation';

export default function TestPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [soal, setSoal] = useState([]);
  const [jawaban, setJawaban] = useState({});
  const [durasi, setDurasi] = useState(60);
  const [judul, setJudul] = useState('Tes Seleksi');
  const [deskripsi, setDeskripsi] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const router = useRouter();

  // Cek hasil atau ambil soal
  useEffect(() => {
    const fetchHasil = async () => {
      try {
        const data = await apiClient('/test/hasil');
        setResultData(data);
        setShowResult(true);
        setLoading(false);
      } catch (err) {
        if (err.message.includes('belum mengikuti tes')) {
          fetchSoal();
        } else {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    const fetchSoal = async () => {
      try {
        const data = await apiClient('/test/soal');
        setSoal(data.soal);
        setDurasi(data.durasi_menit || 60);
        setJudul(data.judul || 'Tes Seleksi');
        setDeskripsi(data.deskripsi || '');
        setTimeLeft((data.durasi_menit || 60) * 60);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHasil();
  }, []);

  // Timer
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0 || soal.length === 0) return;

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
  }, [timeLeft, isSubmitted, soal.length]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleJawab = (idSoal, jawab) => {
    setJawaban((prev) => ({ ...prev, [idSoal]: jawab }));
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;
    setIsSubmitted(true);

    try {
      const res = await apiClient('/test/submit', {
        method: 'POST',
        body: JSON.stringify({ jawaban }),
      });

      alert(`Tes selesai! Skor: ${res.skor_benar}/${soal.length}, Nilai: ${res.nilai.toFixed(2)}`);
      router.push('/dashboard/hasil');
    } catch (err) {
      setError(err.message);
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
      <div className="min-h-screen flex items-center justify-center">
        <p>Memuat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (showResult && resultData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 py-16 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">Hasil Tes</h1>
          <div className="text-center space-y-4">
            <p><strong>Skor Benar:</strong> {resultData.skor_benar}</p>
            <p><strong>Skor Salah:</strong> {resultData.skor_salah}</p>
            <p className="text-2xl font-bold text-green-600">
              Nilai: {resultData.nilai.toFixed(2)}
            </p>
            <p><strong>Waktu Mulai:</strong> {resultData.waktu_mulai}</p>
            <p><strong>Waktu Selesai:</strong> {resultData.waktu_selesai || '-'}</p>
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 text-white px-6 py-2 rounded-full"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tampilkan soal jika sudah dimuat
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">{judul}</h1>
            {deskripsi && <p className="text-gray-600 text-center mb-4">{deskripsi}</p>}
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Total soal: {soal.length}</span>
              <span className="font-mono bg-red-100 text-red-800 px-3 py-1 rounded-full">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <SlideUp delay={200}>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              {soal.map((s, index) => (
                <div key={s.id_soal} className="bg-white p-6 rounded-2xl shadow mb-6">
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

              <div className="text-center mt-8">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitted}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:from-green-600 hover:to-emerald-700 transition"
                >
                  Submit Jawaban
                </button>
              </div>
            </form>
          </SlideUp>
        </FadeIn>
      </div>
    </div>
  );
}