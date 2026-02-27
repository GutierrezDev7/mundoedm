"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroSection } from "@/components/site/HeroSection";
import { TimelineSection } from "@/components/site/TimelineSection";
import { MemoriesGallery } from "@/components/site/MemoriesGallery";
import { LegendsSection } from "@/components/site/LegendsSection";
import { PlaylistSection } from "@/components/site/PlaylistSection";
import { SocialSection } from "@/components/site/SocialSection";
import { Navigation } from "@/components/site/Navigation";
import { LoadingScreen } from "@/components/site/LoadingScreen";
import { UniverseBackground } from "@/components/site/UniverseBackground";
import { CustomCursor } from "@/components/site/CustomCursor";

gsap.registerPlugin(ScrollTrigger);

export function MainExperience() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("cin-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    container.querySelectorAll(".cin-entry").forEach((el) => observer.observe(el));

    const backgrounds = gsap.utils.toArray<HTMLElement>(".parallax-bg");
    backgrounds.forEach((bg) => {
      gsap.to(bg, {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: bg,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    return () => {
      observer.disconnect();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <LoadingScreen />
      <UniverseBackground />
      <Navigation />
      <CustomCursor />
      <div ref={containerRef} className="site-root relative z-10">
        <HeroSection />
        <TimelineSection />
        <MemoriesGallery />
        <LegendsSection />
        <PlaylistSection />
        <SocialSection />
      </div>
    </>
  );
}
