import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroSection } from './HeroSection';
import { TimelineSection } from './TimelineSection';
import { MemoriesGallery } from './MemoriesGallery';
import { LegendsSection } from './LegendsSection';
import { Navigation } from './Navigation';
import { LoadingScreen } from './LoadingScreen';
import { UniverseBackground } from './UniverseBackground';

gsap.registerPlugin(ScrollTrigger);

export function MainExperience() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Animate sections as they come into view
    const sections = gsap.utils.toArray<HTMLElement>('.section-animate');
    
    sections.forEach((section) => {
      gsap.from(section, {
        opacity: 0,
        y: 100,
        scale: 0.95,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1,
        },
      });
    });

    // Parallax effect for section backgrounds
    const backgrounds = gsap.utils.toArray<HTMLElement>('.parallax-bg');
    
    backgrounds.forEach((bg) => {
      gsap.to(bg, {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: bg,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      <LoadingScreen />
      <UniverseBackground />
      <Navigation />
      <div ref={containerRef} className="relative">
        <HeroSection />
        <TimelineSection />
        <MemoriesGallery />
        <LegendsSection />
      </div>
    </>
  );
}
