import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// IDs de Shorts do YouTube (substitua com os IDs do seu canal)
const shorts = [
  { id: 'dQw4w9WgXcQ', title: 'Tomorrowland 2019' },
  { id: 'dQw4w9WgXcQ', title: 'Ultra Miami' },
  { id: 'dQw4w9WgXcQ', title: 'EDC Las Vegas' },
  { id: 'dQw4w9WgXcQ', title: 'Creamfields UK' },
  { id: 'dQw4w9WgXcQ', title: 'Studio Session' },
  { id: 'dQw4w9WgXcQ', title: 'Warehouse Rave' },
  { id: 'dQw4w9WgXcQ', title: 'Festival Sunset' },
  { id: 'dQw4w9WgXcQ', title: 'DJ Set Live' },
  { id: 'dQw4w9WgXcQ', title: 'Laser Show' },
  { id: 'dQw4w9WgXcQ', title: 'Crowd Energy' },
  { id: 'dQw4w9WgXcQ', title: 'Drop Moment' },
  { id: 'dQw4w9WgXcQ', title: 'Stage Setup' },
];

export function MemoriesGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeShort, setActiveShort] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Animate title on scroll
    gsap.from('.gallery-title', {
      opacity: 0,
      y: 100,
      duration: 1,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top center',
      },
    });

    // Animate gallery items
    gsap.utils.toArray<HTMLElement>('.short-card').forEach((card, index) => {
      gsap.from(card, {
        opacity: 0,
        y: 100,
        duration: 0.8,
        scrollTrigger: {
          trigger: card,
          start: 'top bottom-=100',
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section
      id="memories"
      ref={sectionRef}
      className="section-animate relative min-h-screen bg-transparent py-32 overflow-hidden"
    >
      {/* Background effects */}
      <div className="parallax-bg absolute inset-0 bg-gradient-to-b from-transparent via-yellow-950/5 to-transparent" />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(218,165,32,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,215,0,0.05),transparent_50%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        {/* Title */}
        <div className="gallery-title text-center mb-20">
          <h2 className="text-6xl md:text-8xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]">
              MEMÓRIAS
            </span>
          </h2>
          <p className="text-xl text-gray-500">
            Momentos inesquecíveis em formato curto
          </p>
        </div>

        {/* Shorts grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {shorts.map((short, index) => (
            <div
              key={index}
              className="short-card group cursor-pointer"
              onClick={() => setActiveShort(short.id)}
            >
              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-900 border border-yellow-900/20 hover:border-yellow-600/50 transition-all duration-500">
                {/* Thumbnail */}
                <img
                  src={`https://img.youtube.com/vi/${short.id}/maxresdefault.jpg`}
                  alt={short.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500" />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-yellow-500/20 backdrop-blur-md flex items-center justify-center border border-yellow-500/50">
                      <Play className="w-8 h-8 text-yellow-500 ml-1" fill="currentColor" />
                    </div>
                    <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl" />
                  </div>
                </div>

                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-sm font-bold text-white line-clamp-2">
                    {short.title}
                  </h3>
                </div>

                {/* Border glow */}
                <div className="absolute inset-0 rounded-2xl border-2 border-yellow-500/0 group-hover:border-yellow-500/30 transition-colors duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for playing short */}
      {activeShort && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
          onClick={() => setActiveShort(null)}
        >
          <div
            className="relative w-full max-w-md aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-yellow-600/50"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${activeShort}?autoplay=1`}
              title="YouTube Short"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button
              onClick={() => setActiveShort(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-yellow-500/20 transition-colors border border-yellow-600/30"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  );
}