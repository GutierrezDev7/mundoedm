"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { Play } from "lucide-react";
import { useSiteData } from "@/lib/data-context";
import type { LegendItem } from "@/lib/types";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";

function LegendCard({ legend, index }: { legend: LegendItem; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    const img = imgRef.current;
    if (!card || !img) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(img, { x: x * 20, y: y * 20, duration: 0.6, ease: "power2.out" });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!imgRef.current) return;
    gsap.to(imgRef.current, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
  }, []);

  return (
    <a
      ref={cardRef}
      href={legend.youtubeUrl}
      target="_blank"
      rel="noreferrer"
      className="group relative block w-[55vw] max-w-[420px] shrink-0 overflow-hidden"
      style={{ transitionDelay: `${index * 0.07}s` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
        <img
          ref={imgRef}
          src={legend.thumbnailUrl}
          alt={legend.title}
          className="absolute inset-[-20px] h-[calc(100%+40px)] w-[calc(100%+40px)] object-cover will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
        <div className="absolute inset-0 rounded-2xl border border-white/[0.06] transition-all duration-700 group-hover:border-yellow-500/20" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/5 opacity-0 backdrop-blur-md transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
            <Play className="ml-0.5 h-6 w-6 text-white" fill="currentColor" />
          </div>
        </div>

        <div className="absolute right-6 bottom-6 left-6 flex flex-col gap-2">
          <h3 className="line-clamp-3 text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl">
            {legend.title}
          </h3>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-6 h-px w-0 bg-gradient-to-r from-yellow-500 to-yellow-600 transition-all duration-700 group-hover:w-[calc(100%-3rem)]" />
      </div>
    </a>
  );
}

export function LegendsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { data } = useSiteData();

  useEffect(() => {
    if (!sectionRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx: CanvasRenderingContext2D = context;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    class Particle {
      x: number; y: number; size: number; vx: number; vy: number; opacity: number;
      constructor() {
        this.x = Math.random() * w; this.y = Math.random() * h;
        this.size = Math.random() * 1.5 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.3; this.vy = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.35 + 0.1;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x > w) this.x = 0; if (this.x < 0) this.x = w;
        if (this.y > h) this.y = 0; if (this.y < 0) this.y = h;
      }
      draw() {
        ctx.fillStyle = `rgba(218, 165, 32, ${this.opacity})`;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
      }
    }

    const particles = Array.from({ length: 80 }, () => new Particle());
    let raf = 0;
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) { p.update(); p.draw(); }
      raf = requestAnimationFrame(loop);
    };
    loop();

    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <section id="legends" ref={sectionRef} className="relative overflow-hidden bg-transparent py-28 md:py-36">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-15" />
      <div className="parallax-bg absolute inset-0 bg-gradient-to-b from-transparent via-yellow-950/10 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="cin-entry mb-16 md:mb-24">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.3em] text-yellow-600/80">Hall of Fame</p>
          <h2 className="shimmer-text max-w-2xl bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 bg-clip-text text-5xl font-bold leading-[1.05] tracking-tight text-transparent md:text-7xl lg:text-8xl">
            Lendas do Movimento
          </h2>
        </div>
      </div>

      <HorizontalCarousel className="relative z-10">
        {data.legends.map((legend, i) => (
          <LegendCard key={legend.id} legend={legend} index={i} />
        ))}
      </HorizontalCarousel>
    </section>
  );
}
