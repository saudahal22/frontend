'use client';

import { useEffect, useRef } from 'react';

export default function LogoScroller() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const logoSources = [
      "/slider/canonical.svg",
      "/slider/brave-brands-solid-full.svg",
      "/slider/7417366_vs code_visual studio code_logo_code_icon.png",
      "/slider/cplusplus.svg",
      "/slider/css-brands-solid-full.svg",
      "/slider/figma-brands-solid-full.svg",
      "/slider/github-brands-solid-full.svg",
      "/slider/html5-brands-solid-full.svg",
      "/slider/git.svg",
      "/slider/java-brands-solid-full.svg",
      "/slider/linux-brands-solid-full.svg",
      "/slider/openai.svg", 
      "/slider/python-brands-solid-full.svg",
      "/slider/react-brands-solid-full.svg",
      "/slider/square-js-brands-solid-full.svg",
      "/slider/tradingview.svg",
    ];

    const logoCount = 16;
    const logoWidth = 65;
    const spacing = 16;
    const speed = 0.5;

    const logos = [];

    // Buat elemen gambar
    for (let i = 0; i < logoCount; i++) {
      const img = document.createElement('img');
      img.src = logoSources[i % logoSources.length];
      img.className = "absolute h-12 w-12 object-contain";
      img.style.left = `${i * (logoWidth + spacing)}px`; // pakai backtick
      img.style.top = "0px";
      container.appendChild(img);
      logos.push({ 
        el: img, 
        x: i * (logoWidth + spacing),
        currentIndex: i % logoSources.length
      });
    }

    // Fungsi animasi
    function animate() {
      logos.forEach(logo => {
        logo.x -= speed;
        if (logo.x < -logoWidth) {
          const maxX = Math.max(...logos.map(l => l.x));
          logo.x = maxX + logoWidth + spacing;
          logo.currentIndex = (logo.currentIndex + 1) % logoSources.length;
          logo.el.src = logoSources[logo.currentIndex];
        }
        logo.el.style.left = `${logo.x}px`; // pakai backtick
      });
      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      container.innerHTML = '';
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-16 overflow-hidden"
    ></div>
  );
}
