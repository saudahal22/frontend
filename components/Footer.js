'use client';
import Link from 'next/link';
import Image from 'next/image';

// Import ikon dari react-icons
import { FaYoutube, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-sky-700 text-white py-8 mt-12">
      <div className="container mx-auto px-6">
        
        {/* Media Sosial */}
        <div className="flex flex-wrap justify-center gap-6 text-center">
          
          {/* YouTube */}
          <Link
            href="https://youtube.com/@coconutcomputerclub3982"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center group"
          >
            <FaYoutube size={24} className="text-white group-hover:text-sky-200 transition duration-200" />
            <span className="text-xs mt-1 text-sky-100 group-hover:text-white transition duration-200">
              YouTube
            </span>
          </Link>

          {/* LinkedIn */}
          <Link
            href="https://www.linkedin.com/company/coconut-computer-club/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center group"
          >
            <FaLinkedin size={24} className="text-white group-hover:text-sky-200 transition duration-200" />
            <span className="text-xs mt-1 text-sky-100 group-hover:text-white transition duration-200">
              LinkedIn
            </span>
          </Link>

          {/* Instagram */}
          <Link
            href="https://www.instagram.com/coconutdotorg?igsh=MWw1a3MzcnNzMWFw"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center group"
          >
            <FaInstagram size={24} className="text-white group-hover:text-sky-200 transition duration-200" />
            <span className="text-xs mt-1 text-sky-100 group-hover:text-white transition duration-200">
              Instagram
            </span>
          </Link>

          {/* Facebook */}
          <Link
            href="https://web.facebook.com/coconutcomputer.masing-masing"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center group"
          >
            <FaFacebook size={24} className="text-white group-hover:text-sky-200 transition duration-200" />
            <span className="text-xs mt-1 text-sky-100 group-hover:text-white transition duration-200">
              Facebook
            </span>
          </Link>
        </div>

        {/* Kalimat copyright */}
        <p className="text-sky-200 text-sm text-center mt-10">
          © 2025 Coconut Lab • Dibuat dengan{' '}
          <span className="text-red-300">❤</span> oleh{' '}
          <Link
            href="https://github.com/hacklab-id"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline hover:text-sky-100 transition duration-200"
          >
            hacklab
          </Link>
        </p>
      </div>
    </footer>
  );
}