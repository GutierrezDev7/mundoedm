"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

const TUNNEL_PARTICLES = 2400;
const TUNNEL_RADIUS = 10;
const TUNNEL_DEPTH = 50;
const BASE_SPEED = 18;
const LOGO_SRC = "/LOGO%202.png";

export function BlackHoleEntrance({
  onComplete,
  whatsappUrl,
}: {
  onComplete: () => void;
  whatsappUrl?: string | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!container || !canvas || !overlay) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const gold = new THREE.Color(0xfbbf24);
    const dark = new THREE.Color(0x1a0a00);

    const posTunnel = new Float32Array(TUNNEL_PARTICLES * 3);
    const colorTunnel = new Float32Array(TUNNEL_PARTICLES * 3);
    for (let i = 0; i < TUNNEL_PARTICLES; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = TUNNEL_RADIUS * (0.25 + Math.random() * 0.75);
      const z = (Math.random() - 0.5) * TUNNEL_DEPTH;
      posTunnel[i * 3] = Math.cos(theta) * r;
      posTunnel[i * 3 + 1] = Math.sin(theta) * r;
      posTunnel[i * 3 + 2] = z;
      const t = z / TUNNEL_DEPTH + 0.5;
      const c = dark.clone().lerp(gold, t * 0.85 + 0.1);
      colorTunnel[i * 3] = c.r;
      colorTunnel[i * 3 + 1] = c.g;
      colorTunnel[i * 3 + 2] = c.b;
    }

    const tunnelGeo = new THREE.BufferGeometry();
    tunnelGeo.setAttribute("position", new THREE.BufferAttribute(posTunnel, 3));
    tunnelGeo.setAttribute("color", new THREE.BufferAttribute(colorTunnel, 3));
    const tunnelMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const tunnel = new THREE.Points(tunnelGeo, tunnelMat);
    scene.add(tunnel);

    const logoPlaneSize = 1.8;
    const logoGeo = new THREE.PlaneGeometry(logoPlaneSize, logoPlaneSize * 0.6);
    const logoMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const logoMesh = new THREE.Mesh(logoGeo, logoMat);
    logoMesh.position.set(0, 0, 0);
    scene.add(logoMesh);

    const loader = new THREE.TextureLoader();
    loader.load(
      LOGO_SRC,
      (tex: { minFilter: number; magFilter: number }) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        logoMat.map = tex;
      },
      undefined,
      () => {},
    );

    const ringGeo = new THREE.RingGeometry(1.1, 1.6, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    scene.add(ring);

    const camPos = { z: 8 };
    let speedFactor = 1;
    const clock = new THREE.Clock();
    let rafId = 0;

    const tl = gsap.timeline();
    tl.to(camPos, {
      z: -0.5,
      duration: 4.2,
      ease: "power2.in",
      onUpdate: () => {
        const p = (8 - camPos.z) / 8.5;
        speedFactor = 1 + p * 4;
        (tunnelMat as { opacity: number }).opacity = Math.max(0, 0.9 * (1 - p * 1.2));
        (ringMat as { opacity: number }).opacity = Math.max(0, 0.6 * (1 - p * 1.5));
        (logoMat as { opacity: number }).opacity = Math.min(1, Math.max(0, (p - 0.35) / 0.4));
      },
    });
    tl.to(overlay, { opacity: 1, duration: 0.4 }, 3.7);
    tl.call(
      () => {
        if (whatsappUrl && whatsappUrl.startsWith("http")) {
          window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        }
        cancelAnimationFrame(rafId);
        renderer.dispose();
        logoGeo.dispose();
        logoMat.dispose();
        if (logoMat.map) (logoMat.map as { dispose: () => void }).dispose();
        ringGeo.dispose();
        ringMat.dispose();
        tunnelGeo.dispose();
        tunnelMat.dispose();
        onComplete();
      },
      [],
      4.3,
    );

    const animate = () => {
      const dt = clock.getDelta();
      const pos = tunnelGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < TUNNEL_PARTICLES; i++) {
        pos[i * 3 + 2] -= dt * BASE_SPEED * speedFactor;
        if (pos[i * 3 + 2] < -TUNNEL_DEPTH * 0.5) pos[i * 3 + 2] += TUNNEL_DEPTH;
        if (pos[i * 3 + 2] > TUNNEL_DEPTH * 0.5) pos[i * 3 + 2] -= TUNNEL_DEPTH;
      }
      tunnelGeo.attributes.position.needsUpdate = true;
      tunnel.rotation.y += dt * 0.4;

      camera.position.z = camPos.z;
      camera.lookAt(0, 0, camPos.z - 2);
      ring.rotation.z += dt * 1.2;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    clock.start();
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      tl.kill();
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, [onComplete, whatsappUrl]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-200 flex items-center justify-center bg-black"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black opacity-0 transition-opacity duration-500"
      />
    </div>
  );
}
