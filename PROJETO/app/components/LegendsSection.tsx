import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

gsap.registerPlugin(ScrollTrigger);

interface Legend {
  name: string;
  genre: string;
  image: string;
  quote: string;
  story: string;
  achievements: string[];
}

const legends: Legend[] = [
  {
    name: 'Daft Punk',
    genre: 'French House',
    image: 'https://images.unsplash.com/photo-1624929303661-22c5bce0169b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWMlMjBmZXN0aXZhbCUyMGRqJTIwY3Jvd2R8ZW58MXx8fHwxNzcyMDUxMTE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    quote: 'We are human after all',
    story: 'A dupla francesa revolucionou a música eletrônica com sua identidade visual robótica e som único que misturava house, funk e disco. Seu álbum "Discovery" (2001) é considerado uma obra-prima que definiu uma era.',
    achievements: [
      '6 Grammy Awards',
      'Álbum "Random Access Memories" - 2013',
      'Trilha sonora de TRON: Legacy',
      'Influência em gerações de artistas',
    ],
  },
  {
    name: 'Avicii',
    genre: 'Progressive House',
    image: 'https://images.unsplash.com/photo-1741745978060-9add161ba2c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaiUyMG1peGluZyUyMHR1cm50YWJsZSUyMG5lb24lMjBsaWdodHN8ZW58MXx8fHwxNzcyMDUxMTE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    quote: 'Wake me up when it\'s all over',
    story: 'Tim Bergling, conhecido como Avicii, levou o EDM ao mainstream com melodias inesquecíveis e colaborações inovadoras. Seu legado continua inspirando milhões ao redor do mundo.',
    achievements: [
      '"Levels" - Hino global do EDM',
      '2 MTV Music Awards',
      'Billboard Music Awards',
      'Pioneiro em fusões country-EDM',
    ],
  },
  {
    name: 'Skrillex',
    genre: 'Dubstep',
    image: 'https://images.unsplash.com/photo-1760965824369-1a867927c1e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGZlc3RpdmFsJTIwc3RhZ2UlMjBsaWdodHMlMjBuaWdodHxlbnwxfHx8fDE3NzE5MzMzNzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    quote: 'Scary Monsters and Nice Sprites',
    story: 'Sonny Moore transformou o dubstep em fenômeno global, definindo o som de uma geração com bass drops agressivos e produção inovadora. Seu impacto na cultura EDM é inegável.',
    achievements: [
      '8 Grammy Awards',
      'Fundador do OWSLA',
      'Collaborations com Diplo',
      'Influência no bass music',
    ],
  },
  {
    name: 'Deadmau5',
    genre: 'Progressive House',
    image: 'https://images.unsplash.com/photo-1632009613808-70a20dacccb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZG0lMjBjb25jZXJ0JTIwbGFzZXIlMjBzaG93fGVufDF8fHx8MTc3MjA1MTExNnww&ixlib=rb-4.1.0&q=80&w=1080',
    quote: 'Strobe lights forever',
    story: 'Joel Zimmerman, com sua icônica cabeça de rato, levou a música eletrônica progressiva a novos patamares. Conhecido por suas performances tecnológicas e produções meticulosas.',
    achievements: [
      '6 Grammy Nominations',
      '"Strobe" - Obra-prima de 10 minutos',
      'Pioneiro em live streaming',
      'Produtor e engenheiro de renome',
    ],
  },
  {
    name: 'Swedish House Mafia',
    genre: 'Progressive House',
    image: 'https://images.unsplash.com/photo-1712530967389-e4b5b16b8500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWMlMjBwcm9kdWNlciUyMHN0dWRpb3xlbnwxfHx8fDE3NzIwMjM1NDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    quote: 'Don\'t you worry child',
    story: 'O supergrupo sueco formado por Axwell, Steve Angello e Sebastian Ingrosso definiu a era dourada do big room house. Suas performances épicas marcaram história nos maiores festivais.',
    achievements: [
      'One Last Tour - 2019',
      '"Don\'t You Worry Child" - Hit global',
      'Ultra Music Festival legends',
      'Influência massiva no EDM',
    ],
  },
  {
    name: 'Tiësto',
    genre: 'Trance / House',
    image: 'https://images.unsplash.com/photo-1547336784-331eea969948?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXZlJTIwcGFydHklMjBjb2xvcmZ1bCUyMGxpZ2h0c3xlbnwxfHx8fDE3NzIwNTExMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    quote: 'The Godfather of EDM',
    story: 'DJ número 1 do mundo por anos, Tiësto é uma verdadeira lenda viva. Da era trance aos dias atuais, ele continua inovando e inspirando gerações de DJs e produtores.',
    achievements: [
      'Grammy Award Winner',
      'Primeiro DJ nas Olimpíadas (2004)',
      'DJ Mag #1 três vezes',
      'Mais de 30 anos de carreira',
    ],
  },
];

export function LegendsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [expandedLegend, setExpandedLegend] = useState<Legend | null>(null);

  useEffect(() => {
    if (!sectionRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Golden particle system
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = `rgba(218, 165, 32, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle());
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // GSAP animations
    gsap.from('.legends-title', {
      opacity: 0,
      scale: 0.5,
      duration: 1,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top center',
      },
    });

    gsap.utils.toArray<HTMLElement>('.legend-card').forEach((card, index) => {
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

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section
      id="legends"
      ref={sectionRef}
      className="section-animate relative min-h-screen bg-transparent py-32 overflow-hidden"
    >
      {/* Animated background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-20" />

      {/* Gradient overlays */}
      <div className="parallax-bg absolute inset-0 bg-gradient-to-b from-transparent via-yellow-950/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(218,165,32,0.05),transparent_70%)]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        {/* Title */}
        <div className="legends-title text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Crown className="w-10 h-10 text-yellow-500" />
            <h2 className="text-6xl md:text-8xl font-bold text-white">
              <span className="bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                LENDAS
              </span>
            </h2>
            <Crown className="w-10 h-10 text-yellow-500" />
          </div>
          <p className="text-xl text-gray-500">
            Pioneiros que definiram gerações
          </p>
        </div>

        {/* Legends grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {legends.map((legend, index) => (
            <motion.div
              key={index}
              className="legend-card group cursor-pointer"
              onClick={() => setExpandedLegend(legend)}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="relative">
                {/* Card */}
                <div className="relative bg-gradient-to-br from-yellow-900/20 to-yellow-950/10 backdrop-blur-md rounded-3xl overflow-hidden border border-yellow-700/30 hover:border-yellow-500/50 transition-all duration-500">
                  {/* Image */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <ImageWithFallback
                      src={legend.image}
                      alt={legend.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative p-6">
                    {/* Crown icon */}
                    <div className="absolute -top-3 right-6">
                      <Crown className="w-6 h-6 text-yellow-500" fill="currentColor" />
                    </div>

                    {/* Name */}
                    <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text mb-2">
                      {legend.name}
                    </h3>

                    {/* Genre */}
                    <p className="text-sm font-medium text-yellow-600 mb-3">
                      {legend.genre}
                    </p>

                    {/* Quote */}
                    <p className="text-gray-400 text-sm italic leading-relaxed">
                      "{legend.quote}"
                    </p>

                    {/* Click hint */}
                    <div className="mt-4 text-xs text-yellow-500/70 uppercase tracking-wider">
                      Clique para ver história →
                    </div>
                  </div>

                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-yellow-500/0 group-hover:from-yellow-500/10 group-hover:to-yellow-600/5 transition-all duration-500 pointer-events-none" />
                </div>

                {/* Shadow glow */}
                <div className="absolute -inset-1 bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Expanded modal */}
      <AnimatePresence>
        {expandedLegend && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
            onClick={() => setExpandedLegend(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="relative w-full max-w-4xl bg-gradient-to-br from-yellow-900/30 to-black rounded-3xl overflow-hidden border border-yellow-600/50 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setExpandedLegend(null)}
                className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-yellow-500 hover:bg-yellow-500/20 transition-colors border border-yellow-600/30"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image */}
              <div className="relative h-96 overflow-hidden">
                <ImageWithFallback
                  src={expandedLegend.image}
                  alt={expandedLegend.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

                {/* Name overlay */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-3 mb-3">
                    <Crown className="w-8 h-8 text-yellow-500" fill="currentColor" />
                    <h2 className="text-5xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text">
                      {expandedLegend.name}
                    </h2>
                  </div>
                  <p className="text-xl text-yellow-600 font-medium">
                    {expandedLegend.genre}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Quote */}
                <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-6 rounded-lg mb-8">
                  <p className="text-xl text-gray-300 italic">
                    "{expandedLegend.quote}"
                  </p>
                </div>

                {/* Story */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-yellow-500 mb-4">História</h3>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    {expandedLegend.story}
                  </p>
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="text-2xl font-bold text-yellow-500 mb-4">Conquistas</h3>
                  <ul className="space-y-3">
                    {expandedLegend.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Crown className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                        <span className="text-gray-400 text-lg">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}