// app/dashboard/profile/ProfileWrapper.js
'use client';

import dynamic from 'next/dynamic';

const ProfileClient = dynamic(() => import('./ProfileClient'), {
  ssr: false,
  loading: () => <p>Memuat profil...</p>,
});

export default function ProfileWrapper() {
  return <ProfileClient />;
}
