// app/dashboard/schedule/ScheduleWrapper.js
'use client';

import dynamic from 'next/dynamic';

const ScheduleClient = dynamic(() => import('./ScheduleClient'), {
  ssr: false,
  loading: () => <p>Memuat jadwal...</p>,
});

export default function ScheduleWrapper() {
  return <ScheduleClient />;
}
