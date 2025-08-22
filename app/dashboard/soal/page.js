'use client';

import NavbarDashboard from '../../../components/NavbarDashboard';
import { FadeIn, SlideUp } from '../../../components/Animations';

export default function SoalTesPage() {
  // Soal dummy (nanti dari API)
  const soal = [
    {
      id: 1,
      pertanyaan: "Apa fungsi dari Git dalam pengembangan perangkat lunak?",
      pilihan: [
        "Untuk mendesain antarmuka pengguna",
        "Untuk mengelola versi kode sumber",
        "Untuk membuat database",
        "Untuk menjalankan server lokal"
      ],
      jawabanBenar: 1,
    },
    {
      id: 2,
      pertanyaan: "Mana yang merupakan bahasa pemrograman berbasis web?",
      pilihan: [
        "Python",
        "HTML",
        "JavaScript",
        "Semua jawaban benar"
      ],
      jawabanBenar: 3,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <NavbarDashboard />

      <main className="py-20 px-6 max-w-4xl mx-auto">
        <FadeIn>
          <h1 className="text-3xl font-bold text-center mb-6 text-blue-900 p-10">
            Soal Tes Seleksi
          </h1>
          <p className="text-center text-gray-600 mb-10">
            Jawab semua soal dengan teliti. Waktu pengerjaan: 30 menit.
          </p>
        </FadeIn>

        <div className="space-y-8">
          {soal.map((item) => (
            <SlideUp key={item.id} delay={200 * item.id}>
              <div className="bg-white/90 p-6 rounded-2xl shadow-lg border border-sky-100 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  {item.id}. {item.pertanyaan}
                </h2>
                <div className="space-y-2">
                  {item.pilihan.map((pilihan, index) => (
                    <label
                      key={index}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-sky-50 cursor-pointer transition"
                    >
                      <input
                        type="radio"
                        name={`soal-${item.id}`}
                        value={index}
                        className="mr-3 text-sky-600 focus:ring-sky-500"
                      />
                      <span className="text-gray-700">{pilihan}</span>
                    </label>
                  ))}
                </div>
              </div>
            </SlideUp>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-8 py-3 rounded-full hover:from-green-600 hover:to-emerald-700 transition shadow-lg"
            onClick={() => alert('Tes berhasil dikirim!')}
          >
            Kirim Jawaban
          </button>
        </div>
      </main>
    </div>
  );
}