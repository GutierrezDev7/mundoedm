"use client";

import { useEffect, useRef } from "react";

const SIZE = 20;
const TRAIL_SIZE = 48;
const HALF = SIZE / 2;
const TRAIL_HALF = TRAIL_SIZE / 2;

export function CustomCursor() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const dot = dotRef.current;
    const trail = trailRef.current;
    if (!wrapper || !dot || !trail) return;

    if (window.matchMedia("(pointer: coarse)").matches) {
      wrapper.style.display = "none";
      return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let trailX = 0;
    let trailY = 0;
    let scale = 1;
    let targetScale = 1;
    let visible = false;

    const INTERACTIVE = "a, button, [role='button'], .social-cta, input, select, textarea";

    wrapper.style.opacity = "0";
    wrapper.style.left = "0";
    wrapper.style.top = "0";

    const show = () => {
      if (visible) return;
      visible = true;
      wrapper.style.transition = "opacity 0.4s ease-out";
      wrapper.style.opacity = "1";
    };
    const hide = () => {
      if (!visible) return;
      visible = false;
      wrapper.style.transition = "opacity 0.25s ease-in";
      wrapper.style.opacity = "0";
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const inView =
        e.clientX >= 0 &&
        e.clientY >= 0 &&
        e.clientX <= window.innerWidth &&
        e.clientY <= window.innerHeight;
      if (inView) show();
      else hide();
      const over = document.elementFromPoint(e.clientX, e.clientY)?.closest(INTERACTIVE);
      targetScale = over ? 1.5 : 1;
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", hide);
    document.documentElement.addEventListener("mouseenter", show);

    const ease = 0.14;
    const trailEase = 0.06;
    const scaleEase = 0.12;

    let rafId = 0;
    const tick = () => {
      cursorX += (mouseX - cursorX) * ease;
      cursorY += (mouseY - cursorY) * ease;
      trailX += (mouseX - trailX) * trailEase;
      trailY += (mouseY - trailY) * trailEase;
      scale += (targetScale - scale) * scaleEase;

      wrapper.style.left = "0";
      wrapper.style.top = "0";
      wrapper.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

      trail.style.transform = `translate(${trailX - cursorX}px, ${trailY - cursorY}px)`;
      dot.style.transform = `translate(-50%, -50%) scale(${scale})`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const t = setTimeout(show, 200);

    return () => {
      clearTimeout(t);
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", hide);
      document.documentElement.removeEventListener("mouseenter", show);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2"
      style={{ width: 1, height: 1 }}
    >
      {/* Rastro suave — segue com atraso */}
      <div
        ref={trailRef}
        className="absolute left-0 top-0 rounded-full border border-amber-400/30 bg-amber-500/5"
        style={{
          width: TRAIL_SIZE,
          height: TRAIL_SIZE,
          marginLeft: -TRAIL_HALF,
          marginTop: -TRAIL_HALF,
          boxShadow: "0 0 30px rgba(251, 191, 36, 0.15), inset 0 0 20px rgba(251, 191, 36, 0.05)",
        }}
      />
      {/* Ponto principal */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 rounded-full border border-amber-300/50 bg-amber-400/90"
        style={{
          width: SIZE,
          height: SIZE,
          marginLeft: -HALF,
          marginTop: -HALF,
          boxShadow:
            "0 0 20px rgba(251, 191, 36, 0.4), 0 0 40px rgba(251, 191, 36, 0.2), inset 0 0 12px rgba(255, 255, 255, 0.3)",
        }}
      />
    </div>
  );
}
