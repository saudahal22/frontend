'use client';

import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { FadeIn, SlideUp } from '../../components/Animations';
import { useState, useRef, useEffect } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [status, setStatus] = useState('');

  // Ref untuk form dan container peta
  const formRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [mapHeight, setMapHeight] = useState('320px'); // fallback height

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    let filteredValue = value;
    if (name === 'firstName' || name === 'lastName') {
      filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
    }
    if (name === 'phone') {
      filteredValue = value.replace(/[^0-9\-]/g, '');
    }

    setFormData((prev) => ({
      ...prev,
      [name]: filteredValue,
    }));
  };

  // Validasi form
  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Nama depan wajib diisi';
    else if (formData.firstName.length < 2)
      newErrors.firstName = 'Nama depan minimal 2 huruf';

    if (!formData.lastName.trim()) newErrors.lastName = 'Nama belakang wajib diisi';
    else if (formData.lastName.length < 2)
      newErrors.lastName = 'Nama belakang minimal 2 huruf';

    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.phone) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Pesan tidak boleh kosong';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Pesan minimal 10 karakter';
    }

    return newErrors;
  };

  // Handle submit tanpa redirect
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitted(false);
      return;
    }

    setErrors({});
    setStatus('Mengirim...');

    try {
      const res = await fetch('https://formsubmit.co/ajax/hello@coconut.or.id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: 'Pesan Baru dari Website COCONUT',
          _captcha: 'false',
          _template: 'table',
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
        setStatus('Pesan berhasil dikirim!');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
        });
      } else {
        setStatus('Gagal mengirim pesan. Silakan coba lagi.');
      }
    } catch (error) {
      setStatus('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  // Sinkronisasi tinggi peta dengan form
  useEffect(() => {
    const adjustMapHeight = () => {
      if (formRef.current && window.innerWidth >= 1024) {
        // Desktop: peta ikuti tinggi form
        const formHeight = formRef.current.offsetHeight;
        setMapHeight(`${formHeight}px`);
      } else {
        // Mobile/tablet: gunakan tinggi tetap
        setMapHeight('320px');
      }
    };

    // Jalankan saat komponen mount dan saat resize
    adjustMapHeight();
    window.addEventListener('resize', adjustMapHeight);

    return () => {
      window.removeEventListener('resize', adjustMapHeight);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <Navbar />

      <main className="relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative py-16 px-4 text-center">
          <div className="container mx-auto">
            <FadeIn>
              <h1 className="text-4xl md:text-6xl font-bold font-playfair mb-6 bg-gradient-to-r from-blue-800 via-sky-600 to-blue-900 bg-clip-text text-transparent animate-gradient pt-5">
                Contact Us
              </h1>
            </FadeIn>
            <SlideUp delay={200}>
              <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed mb-10">
                Kami terbuka untuk pertanyaan, kolaborasi, atau pendaftaran anggota baru.
                <br />
                Jangan ragu untuk menghubungi kami!
              </p>
            </SlideUp>

            {/* Form & Map */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
              {/* Form Kontak */}
              <div ref={formRef} className="w-full lg:flex-1">
                <SlideUp delay={300}>
                  <div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-sky-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Nama Depan & Belakang */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="John"
                            className={`w-full p-3 border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-sky-400 focus:border-transparent ${
                              errors.firstName ? 'border-red-500 bg-red-50' : ''
                            }`}
                          />
                          {errors.firstName && (
                            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Doe"
                            className={`w-full p-3 border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-sky-400 focus:border-transparent ${
                              errors.lastName ? 'border-red-500 bg-red-50' : ''
                            }`}
                          />
                          {errors.lastName && (
                            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                          )}
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@email.com"
                          className={`w-full p-3 border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-sky-400 focus:border-transparent ${
                            errors.email ? 'border-red-500 bg-red-50' : ''
                          }`}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <span className="absolute top-0 left-0 w-20 h-full flex items-center justify-center bg-gray-50 border border-gray-300 rounded-l-lg text-gray-600 text-sm">
                            +62
                          </span>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="812-3456-7890"
                            className={`w-full p-3 pl-20 border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-sky-400 focus:border-transparent ${
                              errors.phone ? 'border-red-500 bg-red-50' : ''
                            }`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                        )}
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tulis pesan kamu di sini..."
                          rows="5"
                          className={`w-full p-3 border border-gray-300 rounded-lg outline-none resize-none transition focus:ring-2 focus:ring-sky-400 focus:border-transparent ${
                            errors.message ? 'border-red-500 bg-red-50' : ''
                          }`}
                        ></textarea>
                        {errors.message && (
                          <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <div className="text-center">
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold px-8 py-3 rounded-full hover:from-sky-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          📩 Kirim Pesan
                        </button>
                      </div>
                    </form>

                    {/* Status Message */}
                    {status && !isSubmitted && (
                      <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 text-sm rounded-lg border border-yellow-200">
                        {status}
                      </div>
                    )}

                    {/* Success Message */}
                    {isSubmitted && (
                      <div className="mt-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">
                        Terima kasih! Pesan Anda telah dikirim ke tim COCONUT.
                      </div>
                    )}
                  </div>
                </SlideUp>
              </div>

              {/* Peta Lokasi - Tinggi Dinamis */}
              <div
                ref={mapContainerRef}
                className="w-full lg:flex-1 mt-6 lg:mt-0"
              >
                <SlideUp delay={500}>
                  <div
                    className="relative group rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 cursor-pointer"
                    style={{ height: mapHeight }}
                  >
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none"></div>

                    {/* Google Maps Embed */}
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.6410976472995!2d119.41051737483158!3d-5.160368096242469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbee9ff47986693%3A0x102e5b47639d45a!2sAlgo%20Coffee%20%26%20Snack!5e0!3m2!1sid!2sid!4v1728000000000!5m2!1sid!2sid"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale"
                      title="Lokasi Algo Coffee & Snack"
                    ></iframe>

                    {/* Text Overlay */}
                    <div className="absolute bottom-5 left-5 text-white z-20">
                      <h3 className="text-lg md:text-xl font-bold">Sekret Kami</h3>
                      <p className="text-sm opacity-90">Algo Coffee & Snack</p>
                    </div>

                    {/* Clickable Overlay */}
                    <a
                      href="https://maps.app.goo.gl/SQSXMmZgyMF4FFSx6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 z-30"
                      aria-label="Buka lokasi di Google Maps"
                    ></a>
                  </div>
                </SlideUp>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Animasi Gradient untuk Text */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background: linear-gradient(90deg, #1e40af, #0ea5e9, #0284c7, #1e40af);
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