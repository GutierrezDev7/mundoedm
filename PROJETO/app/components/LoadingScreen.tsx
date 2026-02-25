import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { Music2 } from 'lucide-react';

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to('.loading-screen', {
          yPercent: -100,
          duration: 1,
          ease: 'power4.inOut',
          onComplete: () => setIsLoading(false),
        });
      },
    });

    tl.from('.loading-logo', {
      scale: 0,
      rotation: -180,
      duration: 1,
      ease: 'back.out(1.7)',
    })
      .to('.loading-text', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
      })
      .to('.loading-bar', {
        scaleX: 1,
        duration: 1.5,
        ease: 'power2.inOut',
      });
  }, []);

  if (!isLoading) return null;

  return (
    <div className="loading-screen fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-900 via-yellow-700 to-yellow-900 animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(218,165,32,0.3),transparent_50%)]" />
      </div>

      {/* Logo */}
      <div className="loading-logo relative z-10 mb-8">
        <div className="relative">
          <Music2 className="w-24 h-24 text-yellow-500" strokeWidth={1.5} />
          <div className="absolute inset-0 animate-ping">
            <Music2 className="w-24 h-24 text-yellow-600 opacity-50" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="relative z-10 text-center mb-8">
        <h1 className="loading-text text-6xl font-bold text-white mb-2 opacity-0 translate-y-4">
          MUNDO EDM
        </h1>
        <p className="loading-text text-xl text-yellow-500 opacity-0 translate-y-4">
          Colecionar Memórias · Celebrar Momentos
        </p>
      </div>

      {/* Loading bar */}
      <div className="relative z-10 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="loading-bar h-full bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 origin-left scale-x-0" />
      </div>
    </div>
  );
}