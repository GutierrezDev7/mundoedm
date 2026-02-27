"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";
import gsap from "gsap";
import { MessageCircleHeart } from "lucide-react";
import type { SocialLink, SocialPlatform } from "@/lib/types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://mundoedmbackend.onrender.com";

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
  const [links, setLinks] = useState<SocialLink[]>([]);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${API}/api/content/social`);
        if (!res.ok) return;
        const data = (await res.json()) as SocialLink[];
        if (!cancelled) {
          setLinks(data ?? []);
        }
      } catch {
        if (!cancelled) {
          setLinks([]);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const whatsappLink = links.find((l) => l.platform === "whatsapp");
  const otherLinks = links.filter((l) => l.platform !== "whatsapp");

  useEffect(() => {
    const cta = ctaRef.current;
    if (!cta) return;

    const xTo = gsap.quickTo(cta, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(cta, "y", { duration: 0.4, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      const rect = cta.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 180;
      if (dist < maxDist) {
        const strength = 1 - dist / maxDist;
        xTo(dx * strength * 0.35);
        yTo(dy * strength * 0.35);
      } else {
        xTo(0); yTo(0);
      }
    };

    const onLeave = () => { xTo(0); yTo(0); };
    document.addEventListener("pointermove", onMove);
    cta.addEventListener("pointerleave", onLeave);

    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 0.5, duration: 1.6, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }

    return () => {
      document.removeEventListener("pointermove", onMove);
      cta.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section id="social" className="relative overflow-hidden bg-transparent py-24 md:py-28">
      <div className="parallax-bg absolute inset-0 bg-gradient-to-b from-transparent via-yellow-950/10 to-black/50" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="cin-entry mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-white md:text-6xl">Social</h2>
          <p className="mx-auto max-w-2xl text-gray-400 md:text-lg">
            Entre para a comunidade com um unico clique.
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
                  className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-white/20"
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

        {whatsappLink && (
          <div className="cin-entry mt-12 flex justify-center">
            <a
              ref={ctaRef}
              href={whatsappLink.href}
              target="_blank"
              rel="noreferrer"
              className="social-cta group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-10 py-5 text-base font-bold text-yellow-200 will-change-transform"
            >
              <span className="absolute inset-0 rounded-full border border-yellow-500/30 transition-all duration-500 group-hover:border-yellow-400/60" />
              <span className="absolute inset-[-2px] rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: "conic-gradient(from var(--angle, 0deg), #fbbf24, #f59e0b, #d97706, #fbbf24)",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "exclude", WebkitMaskComposite: "xor", padding: "2px",
                }}
              />
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500/10 via-yellow-400/5 to-yellow-500/10 transition-all duration-500 group-hover:from-yellow-500/20 group-hover:via-yellow-400/10 group-hover:to-yellow-500/20" />
              <span ref={glowRef} className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.35),transparent_70%)] opacity-0" />
              <MessageCircleHeart className="relative h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="relative uppercase tracking-[0.14em]">Faça parte da comunidade MUNDO EDM</span>
              <span className="absolute inset-0 -translate-x-full skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-none group-hover:translate-x-full group-hover:opacity-100 group-hover:duration-700" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
