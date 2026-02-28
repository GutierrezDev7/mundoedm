"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { useSiteData } from "@/lib/data-context";

const LOGO_SRC = "/LOGO%202.png";
const LOADING_FALLBACK_MS = 12000;

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRingRef = useRef<SVGCircleElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const contentReadyRef = useRef(false);
  const readyToDismissRef = useRef(false);
  const tryFinishRef = useRef<(() => void) | null>(null);

  const { loading: backendLoading } = useSiteData();

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = LOGO_SRC;
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, []);

  useEffect(() => {
    const tryFinish = () => {
      if (contentReadyRef.current && readyToDismissRef.current) {
        setIsLoading(false);
      }
    };
    tryFinishRef.current = tryFinish;
  }, []);

  useEffect(() => {
    if (backendLoading !== false) return;

    let cancelled = false;

    const waitForDocument = () =>
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            window.addEventListener("load", () => resolve(), { once: true });
          });

    const waitForFonts = () =>
      typeof document !== "undefined" && document.fonts && document.fonts.ready
        ? document.fonts.ready
        : Promise.resolve();

    const waitForLogo = () =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = LOGO_SRC;
      });

    Promise.all([waitForDocument(), waitForFonts(), waitForLogo()]).then(() => {
      if (!cancelled) {
        contentReadyRef.current = true;
        tryFinishRef.current?.();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [backendLoading]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 0;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Túnel de partículas — cilindro de pontos em movimento
    const tunnelParticles = 1000;
    const posTunnel = new Float32Array(tunnelParticles * 3);
    const colorTunnel = new Float32Array(tunnelParticles * 3);
    const radius = 12;
    const depth = 120;
    const gold = new THREE.Color(0xfbbf24);
    const dark = new THREE.Color(0x1a1a0a);

    for (let i = 0; i < tunnelParticles; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = radius * (0.3 + Math.random() * 0.7);
      const z = (Math.random() - 0.5) * depth;
      posTunnel[i * 3] = Math.cos(theta) * r;
      posTunnel[i * 3 + 1] = Math.sin(theta) * r;
      posTunnel[i * 3 + 2] = z;
      const t = (z / depth + 0.5);
      const c = dark.clone().lerp(gold, t * 0.9 + 0.1);
      colorTunnel[i * 3] = c.r;
      colorTunnel[i * 3 + 1] = c.g;
      colorTunnel[i * 3 + 2] = c.b;
    }

    const tunnelGeo = new THREE.BufferGeometry();
    tunnelGeo.setAttribute("position", new THREE.BufferAttribute(posTunnel, 3));
    tunnelGeo.setAttribute("color", new THREE.BufferAttribute(colorTunnel, 3));
    const tunnelMat = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const tunnel = new THREE.Points(tunnelGeo, tunnelMat);
    scene.add(tunnel);

    // Anel frontal girando
   


    let animationId = 0;
    const clock = new THREE.Clock();
    const camPos = { z: -45 };

    const animate = () => {
      const dt = clock.getDelta();
      const t = clock.getElapsedTime();

      const pos = tunnelGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < tunnelParticles; i++) {
        pos[i * 3 + 2] += dt * 35;
        if (pos[i * 3 + 2] > depth * 0.5) pos[i * 3 + 2] -= depth;
        if (pos[i * 3 + 2] < -depth * 0.5) pos[i * 3 + 2] += depth;
      }
      tunnelGeo.attributes.position.needsUpdate = true;



      camera.position.z = camPos.z;
      camera.lookAt(0, 0, camPos.z + 5);
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    clock.start();
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    const finishLoading = () => setIsLoading(false);

    const fallbackTimer = window.setTimeout(finishLoading, LOADING_FALLBACK_MS);

    const tl = gsap.timeline({ delay: 0.2 });
    tl.to({}, { duration: 0.3 })
      .fromTo(
        ".loading-grain",
        { opacity: 0 },
        { opacity: 0.4, duration: 0.8, ease: "power2.out" },
        0,
      )
      .fromTo(
        ".loading-vignette",
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power2.out" },
        0,
      );

    const cameraTween = gsap.to(camPos, {
      z: 0,
      duration: 3.2,
      ease: "power2.inOut",
    });
    tl.add(cameraTween, 0.2);

    // Título / logo
    tl.fromTo(
      ".loading-title-wrap",
      { opacity: 0, scale: 0.85, filter: "blur(12px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" },
      1.2,
    );
    tl.fromTo(
      ".loading-subtitle",
      { opacity: 0, y: 10 },
      { opacity: 0.9, y: 0, duration: 0.6, ease: "power2.out" },
      1.8,
    );

    // Anel de progresso SVG
    const circumference = 2 * Math.PI * 54;
    gsap.set(progressRingRef.current, {
      strokeDasharray: circumference,
      strokeDashoffset: circumference,
    });
    tl.to(progressRingRef.current, {
      strokeDashoffset: 0,
      duration: 2.2,
      ease: "power2.inOut",
    }, 1.6);

    // Pulse no título
    tl.to(
      ".loading-title-wrap",
      {
        filter: "drop-shadow(0 0 30px rgba(251,191,36,0.4))",
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut",
      },
      3.2,
    );

    tl.add(() => {
      gsap.to(wipeRef.current, {
        scale: 3.5,
        duration: 1,
        ease: "power3.in",
        onComplete: () => {
          readyToDismissRef.current = true;
          tryFinishRef.current?.();
        },
      });
    }, 3.8);

    return () => {
      window.clearTimeout(fallbackTimer);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      tl.kill();
      renderer.dispose();
      tunnelGeo.dispose();
      tunnelMat.dispose();

    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="loading-screen fixed inset-0 z-[100] overflow-hidden bg-black">
      {/* Canvas Three.js — túnel de partículas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ background: "#000" }}
      />

      {/* Film grain */}
      <div
        className="loading-grain pointer-events-none absolute inset-0 z-[5] opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          mixBlendMode: "overlay",
        }}
      />

      {/* Vignette + light leak */}
      <div
        className="loading-vignette pointer-events-none absolute inset-0 z-[6]"
        style={{
          background: `
            radial-gradient(ellipse 100% 100% at 50% 50%, transparent 25%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.85) 100%),
            radial-gradient(ellipse 80% 50% at 50% 20%, rgba(251,191,36,0.08) 0%, transparent 50%),
            radial-gradient(ellipse 60% 80% at 50% 50%, rgba(251,191,36,0.03) 0%, transparent 45%)
          `,
        }}
      />

      {/* Conteúdo central */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <div className="loading-title-wrap flex flex-col items-center">
          <img
            src={LOGO_SRC}
            alt="Mundo EDM"
            width={280}
            height={112}
            decoding="sync"
            fetchPriority="high"
            className="h-16 w-auto object-contain drop-shadow-[0_0_20px_rgba(251,191,36,0.3)] md:h-35"
          />
          <p className="loading-subtitle mt-3 font-medium uppercase tracking-[0.4em] text-amber-200/90 text-xs md:tracking-[0.5em] md:text-sm">
            MUNDO EDM
          </p>
        </div>

        {/* Progresso circular */}
        <svg
          className="absolute bottom-[18%] left-1/2 h-28 w-28 -translate-x-1/2 -rotate-90 text-amber-500/80 md:bottom-[20%]"
          viewBox="0 0 120 120"
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          strokeLinecap="round"
        >
          <circle
            cx="60"
            cy="60"
            r="54"
            className="text-white/10"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
          />
          <circle
            ref={progressRingRef}
            cx="60"
            cy="60"
            r="54"
            fill="none"
            strokeWidth="2"
            stroke="url(#loadingProgressGradient)"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="loadingProgressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(251,191,36,0.6)" />
              <stop offset="50%" stopColor="rgba(251,191,36,1)" />
              <stop offset="100%" stopColor="rgba(251,191,36,0.6)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Wipe circular de saída */}
      <div
        ref={wipeRef}
        className="pointer-events-none absolute left-1/2 top-1/2 z-50 h-[100vmax] w-[100vmax] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-black"
        style={{ boxShadow: "0 0 0 100vmax black" }}
      />
    </div>
  );
}
