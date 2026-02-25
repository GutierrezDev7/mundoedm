import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// IDs reais de vídeos do YouTube (substitua com os IDs do seu canal)
const timelineVideos = [
  {
    id: 'dQw4w9WgXcQ', // Substitua com ID do seu vídeo
    title: 'O Nascimento do EDM',
    year: '1987',
    description: 'Acid House revoluciona a música eletrônica',
  },
  {
    id: 'dQw4w9WgXcQ',
    title: 'Era Rave',
    year: '1992',
    description: 'Movimentos underground transformam warehouses',
  },
  {
    id: 'dQw4w9WgXcQ',
    title: 'Revolução Digital',
    year: '2000',
    description: 'A produção digital democratiza a criação',
  },
  {
    id: 'dQw4w9WgXcQ',
    title: 'Festival Explosion',
    year: '2010',
    description: 'EDM domina festivais globais',
  },
  {
    id: 'dQw4w9WgXcQ',
    title: 'Streaming Era',
    year: '2015',
    description: 'Plataformas digitais levam EDM ao mundo',
  },
  {
    id: 'dQw4w9WgXcQ',
    title: 'Virtual Venues',
    year: '2020',
    description: 'Festivais virtuais reinventam experiências',
  },
];

export function TimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const section = sectionRef.current;
    const container = containerRef.current;

    // Horizontal scroll animation
    const scrollWidth = container.scrollWidth - window.innerWidth;

    gsap.to(container, {
      x: -scrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${scrollWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    // Animate timeline items
    gsap.utils.toArray<HTMLElement>('.timeline-video').forEach((item) => {
      gsap.from(item, {
        opacity: 0,
        y: 100,
        scrollTrigger: {
          trigger: item,
          start: 'left right',
          end: 'left center',
          scrub: 1,
          containerAnimation: ScrollTrigger.getById('timeline-scroll'),
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="section-animate relative bg-transparent overflow-hidden py-20"
    >
      {/* Background effects */}
      <div className="parallax-bg absolute inset-0 bg-gradient-to-b from-transparent via-yellow-950/10 to-transparent" />
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-700/50 to-transparent" />
      </div>

      {/* Section header */}
      <div className="absolute top-12 left-12 z-10">
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-4">
          <span className="bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]">
            TIMELINE
          </span>
        </h2>
        <p className="text-gray-500 text-lg">Arraste para navegar pela história</p>
      </div>

      {/* Scrolling container */}
      <div ref={containerRef} className="flex h-screen items-center gap-12 px-12">
        {timelineVideos.map((video, index) => (
          <div
            key={index}
            className="timeline-video flex-shrink-0 w-[500px] md:w-[600px]"
          >
            <div className="relative group">
              {/* Video container */}
              <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-yellow-900/30 hover:border-yellow-700/50 transition-all duration-500">
                {/* Video embed */}
                <div className="relative aspect-video bg-black">
                  {activeVideo === video.id ? (
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <img
                        src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Play overlay */}
                      <button
                        onClick={() => setActiveVideo(video.id)}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/30 transition-all duration-300 group"
                      >
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full bg-yellow-500/20 backdrop-blur-md flex items-center justify-center border border-yellow-500/50 group-hover:scale-110 transition-transform">
                            <Play className="w-10 h-10 text-yellow-500 ml-1" fill="currentColor" />
                          </div>
                          <div className="absolute inset-0 bg-yellow-500/30 rounded-full blur-xl" />
                        </div>
                      </button>
                    </>
                  )}
                </div>

                {/* Info */}
                <div className="p-6 bg-gradient-to-b from-gray-900/50 to-black">
                  {/* Year badge */}
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-900/50 to-yellow-800/50 rounded-full border border-yellow-700/50 mb-4">
                    <span className="text-2xl font-bold text-yellow-500">{video.year}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {video.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed">
                    {video.description}
                  </p>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-yellow-500/0 group-hover:from-yellow-500/10 group-hover:to-yellow-600/5 transition-all duration-500 pointer-events-none rounded-2xl" />
              </div>

              {/* Timeline dot */}
              <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-800 shadow-lg shadow-yellow-500/50" />
                <div className="w-px h-16 bg-gradient-to-b from-yellow-700/50 to-transparent" />
              </div>
            </div>
          </div>
        ))}

        {/* End spacer */}
        <div className="flex-shrink-0 w-[50vw]" />
      </div>
    </section>
  );
}