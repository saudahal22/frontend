"use client";

import Image from "next/image";
import Link from "next/link";

import Footer from "../../components/Footer";
import { useState, useEffect } from "react";
import { SlideUp, FadeIn } from "../../components/Animations";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveSection((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const timelineEvents = [
    {
      year: "2008",
      month: "April",
      title: "Berdirinya COCONUT",
      description:
        "Didirikan di STMIK Profesional sebagai klub komputer yang berfokus pada penelitian teknologi",
      icon: "/kalender.png",
    },
    {
      year: "2015",
      month: "Januari",
      title: "Ekspansi Multi-Universitas",
      description:
        "Mulai menerima anggota dari berbagai universitas di Makassar",
      icon: "/vector.png",
    },
    {
      year: "2022",
      month: "Maret",
      title: "Legalitas Resmi",
      description:
        "Terdaftar di Kemenkumham RI dengan nomor AHU-0012037.AH.01.07.TAHUN 2022",
      icon: "/vector2.png",
    },
  ];

  const visionMission = {
    vision:
      "Menjadi pusat unggulan penelitian dan pengembangan teknologi informasi yang menghasilkan inovasi berkualitas tinggi untuk kemajuan bangsa.",
    mission:
      "Melakukan penelitian terapan di bidang IT, membina generasi muda teknolog, dan membangun ekosistem kolaborasi akademik-industri.",
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-sky-50 via-white to-blue-50">
      <section className="relative py-24 text-center pb-40">
        <div className="container mx-auto px-6 ">
          <FadeIn>
            <h1 className="text-5xl md:text-7xl font-bold font-playfair pt-20 py-3 bg-gradient-to-l from-blue-800 via-sky-600 to-blue-900 bg-clip-text text-transparent animate-gradient">
              Tentang COCONUT
            </h1>
          </FadeIn>
          <SlideUp delay={200}>
            <p className="text-xl text-black max-w-2xl mx-auto leading-relaxed mb-10">
              Computer Club Oriented Network, Utility & Technology
            </p>
          </SlideUp>
        </div>
      </section>

      <main className="relative overflow-hidden  bg-gradient-to-br from-sky-50 via-white to-blue-50">
        {/* ✅ Bagian: Tentang COCONUT */}

        <section className="relative py-24">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Kolom Kiri */}
              <SlideUp delay={200}>
                <div className="bg-gradient-to-bl from-white/30 to-sky-50/30  p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 backdrop-blur-lg">
                  <h3 className="text-xl font-bold text-blue-900 mb-4">
                    Sejarah Singkat
                  </h3>
                  <p className="text-black leading-relaxed">
                    COCONUT (Computer Club Oriented Network, Utility &
                    Technology) berdiri pada tahun 2008 di STMIK Profesional
                    Makassar. Awalnya sebagai klub komputer kampus, kini
                    berkembang menjadi komunitas teknologi lintas universitas
                    yang aktif dalam penelitian, pengembangan, dan kolaborasi
                    teknologi tingkat nasional maupun internasional.
                  </p>
                </div>
              </SlideUp>

              {/* Kolom Kanan */}
              <SlideUp delay={300}>
                <div className="bg-gradient-to-br from-white/30 to-sky-50/30  p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 backdrop-blur-lg">
                  <h3 className="text-xl font-bold text-blue-900 mb-4">
                    Dampak
                  </h3>
                  <p className="text-black leading-relaxed">
                    Dengan fokus yang kuat pada riset dan pengembangan teknologi
                    informasi, COCONUT berkomitmen membina dan memberdayakan
                    generasi muda untuk menjadi talenta unggul di bidang
                    teknologi. Melalui program pelatihan intensif, webinar
                    inspiratif, dan proyek kolaboratif berskala nasional dan
                    internasional.
                  </p>
                </div>
              </SlideUp>
            </div>
          </div>
        </section>

        {/* ✅ Perjalanan Kami */}
        <section className="relative py-24 bg-gradient-to-r from-white/90 to-sky-50/90">
          <div className="container mx-auto px-6">
            <FadeIn>
              <div className="text-center mb-16">
                <h2 className="text-5xl md:text-6xl font-bold font-playfair mb-6">
                  <span className="bg-gradient-to-r from-sky-600 via-blue-700 to-sky-600 bg-clip-text text-transparent">
                    Perjalanan Kami
                  </span>
                </h2>
                <p className="text-xl text-black max-w-3xl mx-auto">
                  Dari klub kecil hingga menjadi komunitas teknologi terdepan
                  dan terbesar di Sulawesi Selatan
                </p>
              </div>
            </FadeIn>

            <div className="relative max-w-6xl mx-auto">
              {/* Garis Timeline */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-210 bg-gradient-to-b from-sky-400 to-blue-600 rounded-full hidden md:block"></div>

              {timelineEvents.map((event, index) => (
                <SlideUp key={index} delay={200 * index}>
                  <div
                    className={`relative mb-16 ${
                      index % 2 === 0
                        ? "md:text-right md:pr-8"
                        : "md:text-left md:pl-8"
                    }`}
                  >
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full shadow-xl border-4 border-white hidden md:flex items-center justify-center z-10">
                      <Image
                        src={event.icon}
                        alt="Icon"
                        width={24}
                        height={24}
                        className="filter brightness-0 invert"
                      />
                    </div>

                    <div
                      className={`md:w-5/12 ${
                        index % 2 === 0 ? "md:ml-auto" : ""
                      }`}
                    >
                      <div className="group relative p-8 bg-gradient-to-br from-white/95 to-sky-50/95 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50 backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-br from-sky-100/50 to-blue-100/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                          <div className="flex items-center mb-4">
                            <div className="bg-gradient-to-r from-sky-400 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold mr-4">
                              {event.month} {event.year}
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold text-blue-900 mb-4">
                            {event.title}
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SlideUp>
              ))}

              {/* Garis Titik-Titik Vertikal (3 titik ke bawah) */}
              <div className="relative mb-8">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-sky-400 to-transparent opacity-70 hidden md:block"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-full mt-24 flex flex-col items-center space-y-1">
                  <span className="text-sky-500 text-2xl animate-pulse">•</span>
                  <span
                    className="text-sky-500 text-2xl animate-pulse"
                    style={{ animationDelay: "0.1s" }}
                  >
                    •
                  </span>
                  <span
                    className="text-sky-500 text-2xl animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  >
                    •
                  </span>
                </div>
              </div>

              {/* Tombol Advanced Reference */}
              <div className="text-center mt-2">
                <Link
                  href="https://coconut.or.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="bg-gradient-to-r from-blue-600 to-sky-600 text-white font-semibold px-8 py-3 rounded-full hover:from-blue-700 hover:to-sky-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    🔗 Advanced Reference
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section> 
        
        
        <section className="relative py-24 bg-gradient-to-br from-sky-50/80 to-blue-50/80">
          <div className="container mx-auto px-6 max-w-4xl">
            <FadeIn>
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold font-playfair mb-6">
                  <span className="bg-gradient-to-r from-sky-600 via-blue-700 to-sky-600 bg-clip-text text-transparent">
                    Visi & Misi
                  </span>
                </h2>
              </div>
            </FadeIn>

            <div className="space-y-12">
              <SlideUp delay={200}>
                <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-8 rounded-3xl shadow-xl border border-white/60 backdrop-blur-sm">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">🎯</div>
                    <div>
                      <h3 className="text-2xl font-bold text-blue-900 mb-3">
                        Visi
                      </h3>
                      <p className="text-black leading-relaxed">
                        {visionMission.vision}
                      </p>
                    </div>
                  </div>
                </div>
              </SlideUp>

              <SlideUp delay={400}>
                <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-8 rounded-3xl shadow-xl border border-white/60 backdrop-blur-sm">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">🚀</div>
                    <div>
                      <h3 className="text-2xl font-bold text-blue-900 mb-3">
                        Misi
                      </h3>
                      <p className="text-black leading-relaxed">
                        {visionMission.mission}
                      </p>
                    </div>
                  </div>
                </div>
              </SlideUp>
            </div>
          </div>
        </section>

        {/* ✅ Pencapaian Prestasi */}
        <section className="relative py-24">
          <div className="container mx-auto px-6">
            <FadeIn>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-blue-800 to-sky-600 bg-clip-text text-transparent">
                    Pencapaian Prestasi
                  </span>
                </h2>
                <p className="text-lg text-black max-w-3xl mx-auto">
                  Pencapaian kuantitatif dan strategis yang membuktikan
                  kontribusi COCONUT terhadap teknologi dan pendidikan
                </p>
              </div>
            </FadeIn>

            {/* Baris 1: 5 Kartu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto mb-12">
              {[
                {
                  number: "16+",
                  label: "Tahun Pengalaman",
                  desc: "Berdiri sejak 2008, konsisten mengembangkan teknologi",
                },
                {
                  number: "100+",
                  label: "Anggota Aktif",
                  desc: "Tersebar di 5+ universitas di Makassar",
                },
                {
                  number: "5+",
                  label: "Universitas Partner",
                  desc: "Kolaborasi akademik yang kuat",
                },
                {
                  number: "100+",
                  label: "Project Selesai",
                  desc: "Inovasi dari riset hingga implementasi",
                },
                {
                  number: "🏆",
                  label: "Anggota Berprestasi",
                  desc: "Banyak anggota menjadi profesional di industri global",
                },
              ].map((item, index) => (
                <SlideUp key={index} delay={150 * index}>
                  <div className="flex flex-col h-full p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 text-center">
                    <div className="text-5xl mb-3 leading-none select-none">
                      {item.number}
                    </div>
                    <h3 className="text-lg font-bold text-blue-900 mb-2">
                      {item.label}
                    </h3>
                    <p className="text-sm text-black leading-relaxed mt-auto">
                      {item.desc}
                    </p>
                  </div>
                </SlideUp>
              ))}
            </div>

            {/* Baris 2: 4 Kartu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                {
                  number: "💡",
                  label: "Lingkungan Inovatif",
                  desc: "Suasana yang mendorong eksplorasi teknologi canggih",
                },
                {
                  number: "🇮🇩",
                  label: "Kontribusi Nasional",
                  desc: "Berperan dalam ekonomi berbasis pengetahuan",
                },
                {
                  number: "💰",
                  label: "Dukungan Pendanaan",
                  desc: "Didukung organisasi seperti Center for Open Science",
                },
                {
                  number: "🤝",
                  label: "Kolaborasi Luas",
                  desc: "Bermitra dengan peneliti dan institusi dalam & luar negeri",
                },
              ].map((item, index) => (
                <SlideUp key={index + 5} delay={150 * (index + 5)}>
                  <div className="flex flex-col h-full p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 text-center">
                    <div className="text-5xl mb-3 leading-none select-none">
                      {item.number}
                    </div>
                    <h3 className="text-lg font-bold text-blue-900 mb-2">
                      {item.label}
                    </h3>
                    <p className="text-sm text-black leading-relaxed mt-auto">
                      {item.desc}
                    </p>
                  </div>
                </SlideUp>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ Visi & Misi */}
       

        
       
        {/* ✅ Kolaborasi & Kemitraan */}
        <section className="relative py-24 bg-gradient-to-br from-sky-50/60 to-blue-50/60">
          <div className="container mx-auto px-6">
            <FadeIn>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold font-playfair mb-4">
                  <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-sky-600 bg-clip-text text-transparent">
                    Kolaborasi & Kemitraan
                  </span>
                </h2>
                <p className="text-xl text-black max-w-3xl mx-auto">
                  Membangun ekosistem teknologi melalui kerjasama yang solid
                </p>
              </div>
            </FadeIn>

            {/* Funders */}
            <FadeIn>
              <div className="text-center mb-8">
                <p className="text-xl text-blue-600 font-bold">Funders</p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
              {/* 1: Dukungan Pendanaan */}
              <SlideUp delay={200}>
                <div className="group bg-gradient-to-br from-white/90 to-sky-50/90 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-100/50 to-blue-100/30 rounded-3xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-blue-900 mb-4">
                      Dukungan Pendanaan
                    </h3>
                    <p className="text-black leading-relaxed">
                      Kami mendapatkan dukungan pendanaan dari berbagai
                      organisasi, termasuk{" "}
                      <strong>Center for Open Science</strong>, yang
                      memungkinkan kami menjalankan proyek riset dan
                      pengembangan teknologi secara berkelanjutan.
                    </p>
                  </div>
                </div>
              </SlideUp>

              {/* 2: Pemberi Dana */}
              <SlideUp delay={300}>
                <div className="group bg-gradient-to-br from-white/90 to-sky-50/90 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-100/50 to-blue-100/30 rounded-3xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-blue-900 mb-4">
                      Pemberi Dana
                    </h3>
                    <p className="text-black leading-relaxed">
                      Anda dapat melihat daftar para pemberi dana kami di bawah
                      ini, yang selama ini telah berkontribusi besar dalam
                      mendukung berbagai kegiatan dan program kami, yaitu{" "}
                      <strong className="font-bold">LONTAR dan Algo</strong>{" "}
                      sebagai mitra utama.
                    </p>
                  </div>
                </div>
              </SlideUp>
            </div>

            {/* Garis Pemisah antara Funders dan Collaborators */}
            <div className="max-w-6xl mx-auto my-12 border-t border-sky-200"></div>

            {/*  */}
            <FadeIn>
              <div className="text-center mb-8">
                <p className="text-xl text-blue-600 font-bold">Collaborators</p>
              </div>
            </FadeIn>

            {/* Grid: Kemitraan Akademik & Komunitas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* 3: Kemitraan Akademik */}
              <SlideUp delay={400}>
                <div className="group bg-gradient-to-br from-white/90 to-sky-50/90 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-100/50 to-blue-100/30 rounded-3xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-blue-900 mb-4">
                      Jaringan Kerja Sama
                    </h3>
                    <p className="text-black leading-relaxed">
                      Kami berkolaborasi dengan berbagai peneliti, lembaga,
                      konferensi, dan organisasi dari dalam dan luar negeri.
                    </p>
                  </div>
                </div>
              </SlideUp>

              {/* 4: Komunitas & Konferensi */}
              <SlideUp delay={500}>
                <div className="group bg-gradient-to-br from-white/90 to-sky-50/90 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-100/50 to-blue-100/30 rounded-3xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-blue-900 mb-4">
                      Mitra Kolaborasi
                    </h3>
                    <p className="text-black leading-relaxed">
                      Termasuk IDSECCONF, MEH Labs, PT Lontar Riset Indonesia,
                      AI Research Indonesia, dan masih banyak lagi.
                    </p>
                  </div>
                </div>
              </SlideUp>
            </div>

            {/* Garis Pemisah antara Funders dan Collaborators */}
            <div className="max-w-6xl mx-auto my-12 border-t border-sky-200"></div>

            {/*  */}
            <SlideUp delay={600} className="max-w-5xl mx-auto mt-16">
              <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-8 rounded-3xl backdrop-blur-sm border border-white/60 shadow-2xl">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">
                    Lingkar Konektivitas
                  </h3>
                  <p className="text-lg text-black mb-6 leading-relaxed">
                    Menghubungkan berbagai mahasiswa dari beberapa kampus untuk
                    berkolaborasi, berinovasi, dan berkembang bersama.:
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 ">
                  {[
                    {
                      name: "STMIK Profesional Makassar",
                      abbr: "STMIK",
                      students: "100+ mahasiswa",
                    },
                    {
                      name: "Universitas Hasanuddin",
                      abbr: "UNHAS",
                      students: "50+ mahasiswa",
                    },
                    {
                      name: "Universitas Negeri Makassar",
                      abbr: "UNM",
                      students: "30+ mahasiswa",
                    },
                    {
                      name: "Universitas Islam Negeri",
                      abbr: "UIN",
                      students: "20+ mahasiswa",
                    },
                    {
                      name: "Universitas Muhammadiyah",
                      abbr: "UNISMUH",
                      students: "20+ mahasiswa",
                    },
                    {
                      name: "Universitas Muslim Indonesia",
                      abbr: "UMI",
                      students: "10+ mahasiswa",
                      abbr: "UMI",
                      students: "5+ mahasiswa",
                    },
                  ].map((uni, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-between p-4 rounded-2xl hover:bg-sky-50/80 transition-all duration-300 border border-sky-100/50"
                    >
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full mr-4 group-hover:scale-125 transition-transform shadow-lg"></div>
                        <div>
                          <span className="text-black group-hover:text-blue-700 transition-colors font-semibold block">
                            {uni.name}
                          </span>
                          <span className="text-sm text-black font-medium">
                            ({uni.abbr})
                          </span>
                        </div>
                      </div>
                      {uni.students && (
                        <span className="text-sm text-sky-600 font-medium bg-sky-100/80 px-3 py-1 rounded-full">
                          {uni.students}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </SlideUp>
          </div>
        </section>

        {/* ✅ Lihat Kegiatan */}
        <div className="text-center py-12">
          <Link href="/activity">
            <button className="bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold px-8 py-3 rounded-full hover:from-sky-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              🚀 Lihat Kegiatan Kami
            </button>
          </Link>
        </div>
      </main>

      {/* Animasi Gradient */}
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

      <Footer />
    </div>
  );
}
