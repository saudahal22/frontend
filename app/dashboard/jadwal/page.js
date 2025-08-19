'use client';

import NavbarDashboard from '../../../components/NavbarDashboard';
import { FadeIn, SlideUp } from '../../../components/Animations';

export default function JadwalTesPage() {
  const jadwal = [
    {
      id: 1,
      jenis: 'Tes Tulis',
      tanggal: '14 Agustus 2025',
      waktu: '09:00 - 11:00',
      lokasi: 'Algo coffee dan Snack',
      status: 'Dikonfirmasi',
      catatan: 'Bawa laptop.'
    },
    {
      id: 2,
      jenis: 'Wawancara',
      tanggal: '16 Agustus 2025',
      waktu: '09:00 - 17:00',
      lokasi: 'Algo Coffee & Snack',
      status: 'Menunggu Konfirmasi',
      catatan: 'Wawancara dilakukan secara Offline.'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <NavbarDashboard />

      <main className="py-20 px-6 max-w-4xl mx-auto">
        <FadeIn>
          <h1 className="text-3xl font-bold text-center mb-6 text-blue-900 p-10">
            Jadwal Tes Anda
          </h1>
          <p className="text-center text-gray-600 mb-10 p-10">
            Simak jadwal tes dan persiapkan diri Anda dengan baik.
          </p>
        </FadeIn>

        <div className="space-y-6">
          {jadwal.map((item) => (
            <SlideUp key={item.id} delay={200 * item.id}>
              <div className="bg-white/90 p-6 rounded-2xl shadow-lg border border-sky-100 backdrop-blur-sm hover:shadow-xl transition">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-800">{item.jenis}</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Dikonfirmasi'
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'Menunggu Konfirmasi'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Tanggal:</strong> {item.tanggal}</p>
                  <p><strong>Waktu:</strong> {item.waktu}</p>
                  <p><strong>Lokasi:</strong> {item.lokasi}</p>
                  <p><strong>Catatan:</strong> <span className="italic">{item.catatan}</span></p>
                </div>
              </div>
            </SlideUp>
          ))}
        </div>

        <div className="mt-10 bg-blue-50 p-4 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-800">
            📢 <strong>Penting:</strong> Pastikan Anda hadir tepat waktu. Keterlambatan lebih dari 10 menit dapat mengurangi Point.
          </p>
        </div>
      </main>
    </div>
  );
}