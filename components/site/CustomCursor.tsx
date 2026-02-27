"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

const CURSOR_SIZE = 36;
const HALF = CURSOR_SIZE / 2;

const SECTION_CONFIGS: Record<string, { speed: number; emissive: number; ringVisible: boolean; glowColor: string }> = {
  hero: { speed: 0.6, emissive: 0x4d2b05, ringVisible: false, glowColor: "rgba(251,191,36,0.25)" },
  timeline: { speed: 2.4, emissive: 0x6b3a08, ringVisible: false, glowColor: "rgba(251,191,36,0.3)" },
  memories: { speed: 1.2, emissive: 0x7c4a10, ringVisible: false, glowColor: "rgba(251,191,36,0.35)" },
  legends: { speed: 1.0, emissive: 0x8b6914, ringVisible: false, glowColor: "rgba(218,165,32,0.4)" },
  playlist: { speed: 0.9, emissive: 0x4d2b05, ringVisible: true, glowColor: "rgba(251,191,36,0.3)" },
  social: { speed: 0.7, emissive: 0x166534, ringVisible: false, glowColor: "rgba(34,197,94,0.35)" },
};

const DEFAULT_CONFIG = { speed: 0.8, emissive: 0x4d2b05, ringVisible: false, glowColor: "rgba(251,191,36,0.2)" };

export function CustomCursor() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) {
      wrapper.style.display = "none";
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(CURSOR_SIZE, CURSOR_SIZE);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const globeGeo = new THREE.SphereGeometry(0.55, 20, 20);
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0xfcd34d,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    const ringGeo = new THREE.TorusGeometry(0.85, 0.02, 12, 60);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.5;
    scene.add(ring);

    const quickX = gsap.quickTo(wrapper, "left", { duration: 0.15, ease: "power2.out" });
    const quickY = gsap.quickTo(wrapper, "top", { duration: 0.15, ease: "power2.out" });

    let currentConfig = DEFAULT_CONFIG;
    let targetRingOpacity = 0;

    const onPointerMove = (e: PointerEvent) => {
      quickX(e.clientX - HALF);
      quickY(e.clientY - HALF);

      const el = document.elementFromPoint(e.clientX, e.clientY);
      const section = el?.closest<HTMLElement>("section[id]");
      const sectionId = section?.id ?? "";
      currentConfig = SECTION_CONFIGS[sectionId] ?? DEFAULT_CONFIG;
      targetRingOpacity = currentConfig.ringVisible ? 0.55 : 0;
    };

    const onPointerEnter = () => { wrapper.style.opacity = "1"; };
    const onPointerLeave = () => { wrapper.style.opacity = "0"; };

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerenter", onPointerEnter);
    document.addEventListener("pointerleave", onPointerLeave);

    const clock = new THREE.Clock();
    let frameId = 0;

    const animate = () => {
      const t = clock.getElapsedTime();
      globe.rotation.y = t * currentConfig.speed;
      globe.rotation.x = Math.sin(t * 0.4) * 0.3;

      const breathe = 1 + Math.sin(t * 2) * 0.06;
      globe.scale.set(breathe, breathe, breathe);

      ring.rotation.z = t * 0.6;
      ringMat.opacity += (targetRingOpacity - ringMat.opacity) * 0.08;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerenter", onPointerEnter);
      document.removeEventListener("pointerleave", onPointerLeave);
      renderer.dispose();
      globeGeo.dispose();
      globeMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none fixed z-[9999] opacity-0"
      style={{ width: CURSOR_SIZE, height: CURSOR_SIZE }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
