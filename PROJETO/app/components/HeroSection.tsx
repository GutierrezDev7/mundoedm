import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollToPlugin);

export function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate text on load - sincronizado com loading screen
    gsap.from('.hero-title', {
      opacity: 0,
      y: 100,
      duration: 1.5,
      delay: 3.5, // Espera loading screen terminar
      ease: 'power4.out',
    });

    gsap.from('.hero-subtitle', {
      opacity: 0,
      y: 50,
      duration: 1,
      delay: 4,
      ease: 'power4.out',
    });

    gsap.from('.hero-cta', {
      opacity: 0,
      scale: 0,
      duration: 1,
      delay: 4.5,
      ease: 'back.out(1.7)',
    });

    gsap.from('.scroll-indicator', {
      opacity: 0,
      y: -20,
      duration: 1,
      delay: 5,
      ease: 'power4.out',
    });
  }, []);

  const scrollToNext = () => {
    gsap.to(window, {
      scrollTo: { y: '#timeline', offsetY: 0 },
      duration: 1.5,
      ease: 'power3.inOut',
    });
  };

  return (
    <section
      id="hero"
      className="section-animate relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Gradient overlays for depth */}
      <div className="parallax-bg absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,black_100%)]" />

      {/* Content */}
      <div ref={contentRef} className="relative z-10 text-center px-6 max-w-5xl">
        <h1 className="hero-title text-7xl md:text-9xl font-bold mb-6">
          <span className="bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]">
            MUNDO EDM
          </span>
        </h1>
        <p className="hero-subtitle text-xl md:text-3xl text-gray-400 mb-12 font-light tracking-wide">
          Um santuário digital para as memórias que moldaram
          <br />a cultura da música eletrônica
        </p>

        {/* Animated tagline */}
        <div className="hero-cta flex flex-wrap items-center justify-center gap-4 text-sm md:text-base uppercase tracking-widest">
          <span className="text-yellow-500">Nostalgia</span>
          <span className="text-gray-600">·</span>
          <span className="text-yellow-400">Energia</span>
          <span className="text-gray-600">·</span>
          <span className="text-yellow-600">Eternidade</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToNext}
        className="scroll-indicator absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-gray-600 hover:text-yellow-500 transition-colors group"
      >
        <span className="text-sm uppercase tracking-wider">Explorar</span>
        <ChevronDown className="w-6 h-6 animate-bounce group-hover:text-yellow-500" />
      </button>
    </section>
  );
}