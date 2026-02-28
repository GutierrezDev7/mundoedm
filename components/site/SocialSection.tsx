"use client";

import { useState, useRef, useEffect } from "react";
import type React from "react";
import gsap from "gsap";
import { MessageCircleHeart } from "lucide-react";
import { ArrowUp } from "lucide-react";
import type { SocialPlatform } from "@/lib/types";
import { BlackHolePortal } from "@/components/site/BlackHolePortal";
import { BlackHoleEntrance } from "@/components/site/BlackHoleEntrance";

type SocialItem = { id: string; name: string; href: string; platform: SocialPlatform };

const SOCIAL_LINKS: SocialItem[] = [
  { id: "whatsapp", name: "WhatsApp", href: "https://chat.whatsapp.com/GPwC9dCq5Ei8pZhRM3sw53", platform: "whatsapp" },
  { id: "instagram", name: "Instagram", href: "https://instagram.com/mundoedmoficial", platform: "instagram" },
  { id: "youtube", name: "YouTube", href: "https://youtube.com/@mundoedmoficial", platform: "youtube" },
];

const PLATFORM_COLORS: Record<SocialPlatform, string> = {
  instagram: "#E1306C",
  tiktok: "#00F2EA",
  youtube: "#FF0000",
  whatsapp: "#25D366",
};

const PLATFORM_ICONS: Record<SocialPlatform, React.ReactNode> = {
  instagram: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  whatsapp: (
    <MessageCircleHeart className="h-5 w-5" />
  ),
};

export function SocialSection() {
  const [showEntrance, setShowEntrance] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  const whatsappLink = SOCIAL_LINKS.find((l) => l.platform === "whatsapp");
  const otherLinks = SOCIAL_LINKS.filter((l) => l.platform !== "whatsapp");

  useEffect(() => {
    if (!ctaRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".portal-cta-text",
        { opacity: 0, y: 16, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power3.out", delay: 0.2 },
      );
      gsap.fromTo(
        ".portal-cta-arrow",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.5 },
      );
      gsap.to(".portal-cta-arrow", {
        y: -6,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });
    }, ctaRef);
    return () => ctx.revert();
  }, []);

  const handleBlackHoleClick = () => {
    setShowEntrance(true);
  };

  const handleEntranceComplete = () => {
    setShowEntrance(false);
  };

  return (
    <section id="social" className="relative overflow-hidden bg-transparent py-16 md:py-24 lg:py-28">
      <div className="parallax-bg absolute inset-0 bg-gradient-to-b from-transparent via-yellow-950/10 to-black/50" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="cin-entry mx-auto max-w-3xl text-center">
          <h2 className="mb-3 text-3xl font-bold text-white sm:mb-4 sm:text-4xl md:text-5xl lg:text-6xl">Social</h2>
          <p className="mx-auto max-w-2xl text-sm text-gray-400 sm:text-base md:text-lg">
            Entre para a comunidade com um único clique.
          </p>
        </div>

        {otherLinks.length > 0 && (
          <div className="cin-entry mt-10 flex items-center justify-center gap-6">
            {otherLinks.map((link) => {
              const color = PLATFORM_COLORS[link.platform];
              return (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex h-12 w-12 min-h-[48px] min-w-[48px] items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-white/20 sm:h-14 sm:w-14"
                  style={{ "--social-color": color } as React.CSSProperties}
                  title={link.name}
                >
                  <span className="transition-colors duration-300 group-hover:text-[var(--social-color)]">
                    {PLATFORM_ICONS[link.platform]}
                  </span>
                  <span
                    className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ boxShadow: `0 0 20px ${color}33, inset 0 0 20px ${color}11` }}
                  />
                </a>
              );
            })}
          </div>
        )}

        <div
          ref={ctaRef}
          className="cin-entry mt-16 flex flex-col items-center justify-center gap-8 md:mt-20"
        >
          <button
            type="button"
            onClick={handleBlackHoleClick}
            className="group relative flex flex-col items-center gap-8 transition-transform duration-500 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
            aria-label="Entrar no buraco negro e ir para o WhatsApp"
          >
            <div className="relative">
              <div
                className="pointer-events-none absolute -inset-12 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)",
                  filter: "blur(28px)",
                }}
              />
              <BlackHolePortal />
              <div
                ref={arrowRef}
                className="portal-cta-arrow absolute -bottom-2 left-1/2 flex -translate-x-1/2 translate-y-0 flex-col items-center"
              >
                
              </div>
            </div>
            <div ref={textRef} className="portal-cta-text flex flex-col items-center gap-1">
              <span className="text-center text-sm font-medium uppercase tracking-[0.42em] text-white/70 md:tracking-[0.5em] md:text-base">
                Faça parte do
              </span>
              <span
                className="text-center font-semibold uppercase tracking-[0.28em] md:tracking-[0.32em]"
                style={{
                  background: "linear-gradient(110deg, #67e8f9 0%, #38bdf8 28%, #818cf8 55%, #a78bfa 82%, #c084fc 100%)",
                  backgroundSize: "200% 100%",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  filter: "drop-shadow(0 0 24px rgba(34,211,238,0.25)) drop-shadow(0 2px 0 rgba(0,0,0,0.15))",
                  fontSize: "clamp(1.25rem, 4vw, 1.75rem)",
                  letterSpacing: "0.32em",
                }}
              >
                Mundo EDM
              </span>
              <span
                className="mt-3 h-px w-24 opacity-60"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.6), rgba(167,139,250,0.6), transparent)",
                }}
              />
            </div>
          </button>
          <p className="max-w-sm text-center text-xs font-medium tracking-[0.2em] text-white/50 uppercase md:text-sm">
            Clique no portal para entrar na comunidade
          </p>
        </div>

        {showEntrance && (
          <BlackHoleEntrance
            onComplete={handleEntranceComplete}
            whatsappUrl={whatsappLink?.href}
          />
        )}
      </div>
    </section>
  );
}
