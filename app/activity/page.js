"use client";

import Image from "next/image";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { FadeIn, SlideUp } from "../../components/Animations";
import Link from "next/link";

export default function Activity() {
  // Data kegiatan dengan gambar, judul, dan link tujuan
  const activities = [
    {
      title: "Webinar : Blokchain Tekhnologi",
      desc: "Pelajari konsep fundamental, arsitektur, dan tren terkini dalam teknologi blockchain, termasuk penerapannya di berbagai industri untuk menciptakan solusi yang aman, transparan, dan efisien.",
      img: "/cocqalby.png",
      link: "https://daftar-coc.vercel.app/",
      delay: 200,
    },
    {
      title: "Webinar : Menyusun Prompting",
      img: "/webinarnawat.png",
      desc: "Kembangkan keterampilan merancang instruksi dan masukan secara sistematis agar sistem berbasis teknologi dapat memberikan hasil yang lebih akurat, relevan, dan sesuai dengan kebutuhan proyek atau riset Anda.",
      link: "https://daftar-coc.vercel.app/",
      delay: 300,
    },
    {
      title: "COC : Web Development With Laravel",
      desc: " Pelajari bagaimana mengembangkan aplikasi web yang skalabel dan aman menggunakan Laravel, mulai dari perancangan database hingga implementasi fitur canggih dengan efisiensi tinggi.",
      img: "/cockakalby.png",
      link: "https://daftar-coc.vercel.app/",
      delay: 400,
    },
    {
      title: "COC : Pengenalan Pemrograman",
      desc: "Kuasai konsep pemrograman inti, seperti variabel, struktur kontrol, dan algoritma, untuk membangun aplikasi secara terstruktur, efisien, dan mudah dikembangkan.",
      img: "/Coc3-1.png",
      link: "https://daftar-coc.vercel.app/",
      delay: 500,
    },
    {
      title: "COCO : Introduction to Sveltekit",
      img: "/cockakmusdalipa.png",
      desc: "Pelajari cara membuat aplikasi web yang ringan, interaktif, dan memiliki performa tinggi menggunakan SvelteKit, dengan fokus pada pengalaman pengguna yang optimal.",
      link: "https://daftar-coc.vercel.app/",
      delay: 600,
    },
    {
      title: "COC : Next.js Portofolio",
      desc: "Rancang dan bangun portofolio digital yang profesional, interaktif, dan mudah diakses di berbagai perangkat menggunakan Next.js, untuk meningkatkan daya tarik dan kepercayaan audiens.",
      img: "/cocnextjs.png",
      link: "https://daftar-coc.vercel.app/",
      delay: 700,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      {/* Navbar */}

      {/* Main Content */}
      <main className="relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative py-24 text-center pb-40">
          <div className="container mx-auto px-6 ">
            <FadeIn>
              <h1 className="text-5xl md:text-7xl font-bold font-playfair pt-20 py-3 bg-gradient-to-r from-blue-800 via-sky-600 to-blue-900 bg-clip-text text-transparent animate-gradient">
                Kegiatan Kami
              </h1>
            </FadeIn>
            <SlideUp delay={200}>
              <p className="text-xl text-black max-w-2xl mx-auto leading-relaxed mb-10">
                Workshop, dan Kolaborasi Teknologi untuk Generasi Muda, serta
                berbagai inisiatif kreatif yang mendorong inovasi dan
                pengembangan <br /> keterampilan di era digital.
              </p>
            </SlideUp>
          </div>
        </section>

        {/* Activities Grid */}
        <section className="relative py-24 bg-gradient-to-r from-white/90 to-sky-50/90">
          <div className="container mx-auto px-6">
            <FadeIn>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl py-3 font-bold font-playfair bg-gradient-to-r from-sky-600 via-blue-700 to-sky-600 bg-clip-text text-transparent">
                  Program & Aktivitas
                </h2>
                <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
                  Berbagai kegiatan inovatif yang dirancang untuk mengasah
                  keterampilan dibidang teknologi.
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
              {activities.map((activity, index) => (
                <SlideUp key={index} delay={activity.delay}>
                  {/* Link yang membungkus seluruh card */}
                  <Link
                    href={activity.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block transform-gpu"
                  >
                    <div className="group relative bg-gradient-to-br from-white/95 to-sky-50/95 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border border-white/60 backdrop-blur-sm">
                      {/* Gambar dengan overlay */}
                      <div className="relative overflow-hidden rounded-2xl mb-4 aspect-auto">
                        <Image
                          src={activity.img}
                          alt={activity.title}
                          width={400}
                          height={250}
                          className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                      </div>
                      {/* Judul */}
                      <h3 className="text-xl font-bold text-blue-900 mb-2">
                        {activity.title}
                      </h3>
                      {/* Deskripsi (opsional) */}
                      {activity.desc && (
                        <p className="text-black text-sm leading-relaxed">
                          {activity.desc}
                        </p>
                      )}
                      {/* <p className="text-gray-700 text-sm leading-relaxed">
                        {activity.desc || 'Klik untuk melihat lebih lanjut.'}
                      </p> */}
                    </div>
                  </Link>
                </SlideUp>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Animasi Gradient untuk Teks Bergerak */}
      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background: linear-gradient(
            90deg,
            #1e40af,
            #0ea5e9,
            #0284c7,
            #1e40af
          );
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>
    </div>
  );
}
