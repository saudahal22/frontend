// app/dashboard/profile/page.js
'use client';




export default function ProfilePage() {
const admin = {
    name: 'Admin Coconut',
    email: 'admin@coconut.or.id',
    role: 'Super Admin',
    join: '1 Januari 2024',
    avatar: '/slider/saudahlatarbiru.png',
  };

  return (
    <>
     
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 pt-20 px-6 py-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-900 mb-6">Profil Saya</h1>

          <div className="bg-white/90 p-8 rounded-2xl shadow-lg border border-white/50 backdrop-blur-sm text-center">
            <image
              src={admin.avatar}
              alt="Profil Admin"
              className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-sky-500 object-cover"
            />
            <h2 className="text-2xl font-bold text-gray-800">{admin.name}</h2>
            <p className="text-gray-600">{admin.email}</p>
            <p className="text-sky-600 font-medium">{admin.role}</p>
            <p className="text-sm text-gray-500 mt-2">Bergabung sejak {admin.join}</p>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-blue-800">Informasi Keamanan</h3>
            <p className="text-sm text-gray-600 mt-1">Terakhir login: 2 jam lalu</p>
            <button className="mt-3 text-sm text-blue-600 hover:underline">
              Ganti Password
            </button>
          </div>
        </div>
      </div>
    </>
  );
}