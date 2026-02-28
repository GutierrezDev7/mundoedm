"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HorizontalCarouselProps {
  children: React.ReactNode;
  className?: string;
  itemClassName?: string;
}

export function HorizontalCarousel({ children, className = "", itemClassName = "" }: HorizontalCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, children]);

  const scroll = useCallback((direction: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.75, 300);
    el.scrollBy({ left: direction === "right" ? amount : -amount, behavior: "smooth" });
  }, []);

  return (
    <div className={`group/carousel relative ${className}`}>
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute top-1/2 left-1 z-20 flex h-10 w-10 min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full border border-yellow-700/40 bg-black/80 text-yellow-500 opacity-0 backdrop-blur-md transition-all hover:border-yellow-500/70 hover:bg-yellow-500/15 group-hover/carousel:opacity-100 max-md:opacity-90"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute top-1/2 right-1 z-20 flex h-10 w-10 min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full border border-yellow-700/40 bg-black/80 text-yellow-500 opacity-0 backdrop-blur-md transition-all hover:border-yellow-500/70 hover:bg-yellow-500/15 group-hover/carousel:opacity-100 max-md:opacity-90"
          aria-label="Proximo"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      <div
        ref={scrollerRef}
        className={`flex gap-4 overflow-x-auto px-4 pb-4 sm:gap-5 sm:px-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${itemClassName}`}
      >
        {children}
        <div className="w-1 shrink-0" />
      </div>
    </div>
  );
}
