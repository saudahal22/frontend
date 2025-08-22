"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LogoScroller from "../components/LogoScroller";
import Image from "next/image";
import Link from "next/link";
import { FadeIn, SlideUp } from "../components/Animations";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <Navbar />

      <main className="relative overflow-hidden">
       {/* Hero Section */}
        <section className="relative py-24 text-center">
          <div className="container mx-auto px-6">
            <FadeIn>
              <div className="mb-16 transition-all duration-1000">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-400/20 to-blue-500/20 blur-2xl animate-pulse"></div>
                  <h1 className="relative text-6xl md:text-8xl font-bold font-playfair mb-6">
                    <span className="bg-gradient-to-r from-blue-800 via-sky-600 to-blue-900 bg-clip-text text-transparent animate-gradient">
                      COCONUT
                    </span>
                    <br />
                    <span className="text-4xl md:text-6xl text-gray-700 font-light"></span>
                  </h1>
                </div>
                <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                  Computer Club Oriented Network, Utility & Technology
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-sky-600 font-medium">
                  <span className="px-4 py-2 bg-sky-100/80 rounded-full">Research & Development</span>
                  <span className="px-4 py-2 bg-blue-100/80 rounded-full">Innovation Hub</span>
                  <span className="px-4 py-2 bg-sky-100/80 rounded-full">Academic Collaboration</span>
                </div>
              </div>
                      <div>
          <button className="bottom-4 right-4 bg-sky-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-sky-700 transition-colors duration-300">
            <Link href="/register" className="flex items-center gap-2"> 
              Bergabung Sekarang</Link>
          </button>
        </div>
            </FadeIn>
          </div>
        </section>

        {/* Jurusan Section */}
        <section className="relative py-24 bg-gradient-to-r from-white/90 to-sky-50/90">
          <div className="container mx-auto ">
            {/* Logo Scroller */}
            <div className="text-center mb-12 md:px-40">
              <FadeIn delay={200}>
                <h1 className="text-lg text-[#a9a9ab] font-bold mb-6">
                  Developer-Engineer Tools
                </h1>
              </FadeIn>
              <SlideUp delay={300}>
                <LogoScroller />
              </SlideUp>
            </div>
            <FadeIn>
              <div className=" mt-10">
                <h1 className="text-center text-3xl text-[#08314f] font-extrabold">
                  Fokus <span className="text-[#44CDFF]">Yang Tersedia</span>
                </h1>
                <p className="text-black text-center mt-6">
                  Coconut memiliki 3 jurusan yang dapat kalian fokuskan saat
                  kalian bergabung dengan kami
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 mt-35 gap-15 px-15 md:px-10 max-w-7xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow text-center md:w-[350px] md:h-[320px] h-[320px] hover:-translate-y-1 hover:shadow-lg transition duration-300">
                <div className="flex justify-center mb-4 mt-[-70px]">
                  <Image
                    src="/backend.png"
                    alt="Backend"
                    width={112}
                    height={112}
                    className="h-28 md:h-28 object-contain"
                  />
                </div>
                <h1 className="text-lg text-black md:text-xl font-bold mb-2">BACKEND</h1>
                <p className="text-sm md:text-base text-black">
                  Backend developer membangun logika aplikasi, mengelola data, menjaga keamanan, menghubungkan frontend, mengoptimalkan server, mengintegrasikan layanan pihak ketiga, dan memastikan aplikasi berjalan cepat, stabil, serta aman digunakan pengguna.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow text-center md:w-[350px] md:h-[320px] h-[320px] hover:-translate-y-1 hover:shadow-lg transition duration-300">
                <div className="flex justify-center mb-4 mt-[-70px]">
                  <Image
                    src="/sistem.png"
                    alt="Sistem"
                    width={112}
                    height={112}
                    className="h-28 md:h-28 object-contain"
                  />
                </div>
                <h1 className="text-lg text-black md:text-xl font-bold mb-2">SYSTEM</h1>
                <p className="text-sm md:text-base text-black">
                  System engineer merancang, mengelola, dan memelihara infrastruktur teknologi, memastikan integrasi sistem, mengoptimalkan kinerja, menjaga keamanan jaringan, serta mendukung operasional agar layanan berjalan efisien, handal, dan berkelanjutan.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow text-center md:w-[350px] md:h-[320px] h-[320px] hover:-translate-y-1 hover:shadow-lg transition duration-300">
                <div className="flex justify-center mb-4 mt-[-70px]">
                  <Image
                    src="/frontend.png"
                    alt="Frontend"
                    width={112}
                    height={112}
                    className="h-28 md:h-28 object-contain"
                  />
                </div>
                <h1 className="text-lg text-black md:text-xl font-bold mb-2">FRONTEND</h1>
                <p className="text-sm md:text-base text-black">
                  Frontend developer merancang dan membangun antarmuka pengguna, mengoptimalkan pengalaman visual, mengimplementasikan desain responsif, memastikan interaksi berjalan lancar, serta menghubungkan tampilan dengan data agar aplikasi mudah digunakan dan menarik.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What is Coconut */}
        <section className="relative ">
          <div className="container mx-auto px-6">
            {/* Bagian Judul & Deskripsi */}
            <FadeIn>
              <section className="text-center max-w-3xl mx-auto">
                <h2 className="font-semibold text-4xl md:font-extrabold text-[#08314f] mb-2">
                  Apa itu <span className="text-amber-500">COCONUT?</span>
                </h2>
                <p className="text-black mt-6">
                  COCONUT adalah sebuah study club yang berfokus pada bidang
                  pengembangan teknologi, COCONUT telah berdiri sendiri dan juga
                  telah diakui oleh negara karena telah sah dilindungi oleh
                  undang-undang, tepatnya pada tahun 2022.
                </p>
              </section>
            </FadeIn>

            {/* Jarak dari teks ke gambar */}
            <div className="mb-12"></div>

            {/* Grid Gambar */}
            <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
              <SlideUp delay={200}>
                <div className="relative rounded-[15px] overflow-hidden w-full md:w-[500px] md:h-[320px] h-64">
                  <Image
                    src="/coconut1.png"
                    alt="Instructors"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 opacity-40"></div>
                </div>
              </SlideUp>

              <SlideUp delay={400}>
                <div className="relative rounded-[15px] overflow-hidden w-full md:w-[500px] md:h-[320px] h-64">
                  <Image
                    src="/coconut2.png"
                    alt="Students"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 opacity-40"></div>
                </div>
              </SlideUp>
            </div>

            <div className="mt-20"></div>

            {/* Kotak CTA */}
            <SlideUp delay={600}>
              <div className="max-w-7xl  mx-auto">
                {/* Flex layout dari kode pertama, dibungkus dalam gradient card */}
               
                  <section className="flex flex-col md:flex-row  md:px-5 gap-8 md:gap-20">
                    {/* Bagian Teks */}
                    <div className="flex-1 ">
                      {/* Lingkaran dekoratif */}
                      <div className="bg-amber-400 rounded-full mt-15 w-15 h-15 mb-[-38px] ml-[-20px]"></div>

                      {/* Judul */}
                      <div className="flex items-center mb-2">
                        <h2 className="text-[#08314f] font-semibold text-[24px] md:mr-15 leading-tight">
                          Pembelajaran yang biasa Anda lakukan di <br /> kampus,
                          <span className="text-[#44CDFF]">
                            {" "}
                            akan tetap terasa sama di COCONUT
                          </span>
                        </h2>
                      </div>

                      {/* Paragraf */}
                      <p className="text-black md:mt-12 leading-relaxed max-w-md">
                        Study club Coconut berfokus pada bidang IT, Kami menyediakan lingkungan yang suportif dan memotivasi untuk mendorong inovasi, mengembangkan teknologi canggih, dan berkontribusi pada kemajuan Indonesia sebagai ekonomi berbasis pengetahuan.
                      </p>
                    </div>

                    {/* Bagian Gambar */}
                    <div className="flex-1 mt-10 ">
                      <Image
                        src="/workhsop.png-removebg-preview.png"
                        alt="Coding Workshop"
                        width={500}
                        height={400}
                        className="w-full h-auto md:mt-[-90px] rounded-lg"
                      />
                    </div>
                  </section>
                
              </div>
            </SlideUp>
          </div>
        </section>
      </main>

      {/* Animasi Gradient untuk Text */}
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