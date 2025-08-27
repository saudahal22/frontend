// components/navbar-admin.js
"use client";

import { useState } from "react";

export default function NavbarAdmin({ onToggleSidebar }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center px-4 shadow-sm">
      <div className="flex items-center space-x-4">
        {/* Tombol Hamburger */}
        <button
          onClick={onToggleSidebar}
          className="text-gray-700 hover:text-gray-900 focus:outline-none"
          aria-label="Buka sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Logo */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="ml-2 text-lg font-semibold text-gray-800">Coconut Admin</span>
        </div>
      </div>
    </header>
  );
}