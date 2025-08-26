// app/dashboard/material/page.js
'use client';

import { useState, useEffect } from 'react';
import { FadeIn, SlideUp } from '../../../components/Animations';

export default function SoalTesPage() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [questions, setQuestions] = useState([]);

  // Load soal & durasi dari localStorage
  useEffect(() => {
    const savedQuestions = JSON.parse(localStorage.getItem('coconut_test_questions')) || [
      // Fallback
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

    const durationInMinutes = parseInt(localStorage.getItem('coconut_test_duration')) || 30;
    const totalSeconds = durationInMinutes * 60;

    setQuestions(savedQuestions);
    setTimeLeft(totalSeconds);
  }, []);

  // Timer
  useEffect(() => {
    if (submitted || timeLeft <= 0 || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, timeLeft, questions.length]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

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
    if (window.confirm('Waktu habis atau Anda yakin ingin mengirim jawaban?')) {
      setSubmitted(true);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Soal belum tersedia.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="ml-10 min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center py-24">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg text-center ml-10">
          <h2 className="text-3xl font-bold text-green-600 mb-4">✅ Jawaban Terkirim!</h2>
          <p className="text-gray-700 mb-6">
            Terima kasih telah menyelesaikan tes. Hasil akan diumumkan melalui email dan WhatsApp.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-sky-600 text-white px-6 ml-10 py-2 rounded-full hover:bg-sky-700 transition"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 ml-10">
      <main className="relative overflow-hidden py-24">
        <div className="container mx-auto px-6 max-w-6xl">
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
            </div>
          </div>

          <SlideUp delay={200}>
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Soal {currentQuestion + 1} dari {questions.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Soal */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  {currentQ.text}
                </h2>
                <div className="space-y-4">
                  {currentQ.options.map((option, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        answers[currentQuestion] === idx
                          ? 'border-sky-500 bg-sky-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion}`}
                        checked={answers[currentQuestion] === idx}
                        onChange={() => handleAnswer(idx)}
                        className="sr-only"
                      />
                      <span
                        className={`flex items-center justify-center w-6 h-6 rounded-full border-2 mr-4 transition-all ${
                          answers[currentQuestion] === idx
                            ? 'border-sky-600 bg-sky-600'
                            : 'border-gray-400'
                        }`}
                      >
                        {answers[currentQuestion] === idx && (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        )}
                      </span>
                      <span className="text-gray-800">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigasi */}
              <div className="flex justify-between items-center">
                <button
                  onClick={goToPrev}
                  disabled={currentQuestion === 0}
                  className={`px-6 py-2 rounded-full font-medium transition ${
                    currentQuestion === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Sebelumnya
                </button>

                {currentQuestion === questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full font-semibold hover:from-green-600 hover:to-emerald-700 transition"
                  >
                    Kirim Jawaban
                  </button>
                ) : (
                  <button
                    onClick={goToNext}
                    className="bg-sky-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-sky-700 transition"
                  >
                    Selanjutnya
                  </button>
                )}
              </div>
            </div>
          </SlideUp>
        </div>
      </main>
    </div>
  );
}