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
<<<<<<< HEAD
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);
  const router = useRouter();
=======
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [isStarted, setIsStarted] = useState(false); // ✅ Apakah ujian sudah dimulai
>>>>>>> 4460055341753acf1d70f555108044e6bd4c2128

  // Cek apakah sudah pernah tes
  useEffect(() => {
<<<<<<< HEAD
    const fetchHasil = async () => {
      try {
        const data = await apiClient('/test/hasil');
        setResultData(data);
        setShowResult(true);
      } catch (err) {
        if (err.message.includes('belum mengikuti tes')) {
          fetchSoal();
        } else {
          setError(err.message);
        }
      }
    };
=======
    const savedQuestions = JSON.parse(localStorage.getItem('coconut_test_questions')) || [
      {
        id: 1,
        text: "Apa output dari kode Python berikut?\nprint(2 ** 3 + 1)",
        options: ["9", "7", "8", "10"],
        correct: 0,
      },
      {
        id: 2,
        text: "Manakah yang BUKAN tipe data di JavaScript?",
        options: ["string", "number", "boolean", "float"],
        correct: 3,
      },
    ];
>>>>>>> 4460055341753acf1d70f555108044e6bd4c2128

    const fetchSoal = async () => {
      try {
        const data = await apiClient('/test/soal');
        setSoal(data.soal);
        setDurasi(data.durasi_menit || 60);
        setJudul(data.judul || 'Tes Seleksi');
        setDeskripsi(data.deskripsi || '');
        setTimeLeft(data.durasi_menit * 60);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHasil();
  }, []);

  // Timer (hanya jalan jika ujian dimulai dan belum selesai)
  useEffect(() => {
<<<<<<< HEAD
    if (timeLeft <= 0 || isSubmitted) return;
=======
    if (!isStarted || submitted || timeLeft <= 0 || questions.length === 0) return;
>>>>>>> 4460055341753acf1d70f555108044e6bd4c2128

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
<<<<<<< HEAD
  }, [timeLeft, isSubmitted]);

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
      router.refresh();
      router.push('/dashboard/hasil');
    } catch (err) {
      setError(err.message);
    }
  };
=======
  }, [isStarted, submitted, timeLeft, questions.length]);
>>>>>>> 4460055341753acf1d70f555108044e6bd4c2128

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

<<<<<<< HEAD
  if (loading) {
=======
  const handleAnswer = (optionIndex) => {
    setAnswers({
      ...answers,
      [currentQuestion]: optionIndex,
    });
  };

  const goToNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
  };

  const handleStart = () => {
    setIsStarted(true); // ✅ Mulai ujian
  };

  if (questions.length === 0) {
>>>>>>> 4460055341753acf1d70f555108044e6bd4c2128
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Memuat soal...</p>
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

<<<<<<< HEAD
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
=======
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center py-24">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Ujian Pilihan Ganda</h2>
          <p className="text-gray-600 mb-6">
            Anda akan mengerjakan {questions.length} soal dalam waktu <strong>{formatTime(timeLeft)}</strong>.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Pastikan koneksi stabil dan tidak meninggalkan halaman selama ujian.
          </p>
          <button
            onClick={handleStart}
            className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:from-sky-600 hover:to-blue-700 transition shadow-md"
          >
            🚀 Mulai Ujian
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <main className="relative overflow-hidden py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex justify-center"></div>
          <FadeIn>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-800 via-sky-600 to-blue-900 bg-clip-text text-transparent leading-tight tracking-tight">
              Ujian Pilihan Ganda
            </h1>
            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
              Jawab semua soal dengan cermat. Waktu terbatas: {formatTime(timeLeft)}
            </p>
          </FadeIn>
          

          {/* Timer Progress */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-sky-200">
              <span className="text-lg font-semibold text-blue-800">⏰ {formatTime(timeLeft)}</span>
>>>>>>> 4460055341753acf1d70f555108044e6bd4c2128
            </div>
          </div>
        </FadeIn>

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
      </div>
    </div>
  );
}