// app/dashboard/material/MaterialWrapper.js
'use client';

import dynamic from 'next/dynamic';

const MaterialClient = dynamic(() => import('./MaterialClient'), {
  ssr: false,
  loading: () => <p>Memuat halaman soal...</p>,
});

export default function MaterialWrapper() {
  return <MaterialClient />;
}
