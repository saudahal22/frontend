// app/dashboard/profile/page.js
'use client';

import { useState, useEffect } from 'react';


export default function ProfilePage() {
 const [searchTerm, setSearchTerm] = useState('');

  const members = [
    {
      id: 1,
      name: 'Saudah Al',
      email: 'saudah@gmail.com',
      asalKampus: 'Universitas Hasanuddin',
      prodi: 'Teknik Informatika',
      semester: '3',
      noWa: '08123456789',
      status: 'Menunggu Hasil',
    },
    {
      id: 2,
      name: 'Arsila Puteri',
      email: 'arsila@gmail.com',
      asalKampus: 'Politeknik Negeri Makassar',
      prodi: 'Sistem Informasi',
      semester: '1',
      noWa: '082211223344',
      status: 'Lulus',
    },
  ];

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 pt-20 px-6 py-10">
        <div className="max-w-7xl mx-auto p-10">
          <h1 className="text-3xl font-bold text-blue-900 mb-6">Kelola Pendaftar</h1>
          <p className="text-gray-600 mb-6">Kelola data calon anggota Coconut.</p>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
            />
          </div>

          <div className="overflow-x-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
            <table className="w-full text-sm text-left">
              <thead className="bg-sky-50/50 uppercase text-gray-700">
                <tr>
                  <th className="px-6 py-4">No</th>
                  <th className="px-6 py-4">Nama</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Kampus</th>
                  <th className="px-6 py-4">Prodi</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100">
                {filtered.map((m, i) => (
                  <tr key={m.id} className="hover:bg-sky-50/40 transition">
                    <td className="px-6 py-4 font-medium">{i + 1}</td>
                    <td className="px-6 py-4 font-medium">{m.name}</td>
                    <td className="px-6 py-4 text-gray-600">{m.email}</td>
                    <td className="px-6 py-4 text-gray-600">{m.asalKampus}</td>
                    <td className="px-6 py-4 text-gray-600">{m.prodi}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        m.status === 'Lulus'
                          ? 'bg-green-100 text-green-800'
                          : m.status === 'Tidak Lulus'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}