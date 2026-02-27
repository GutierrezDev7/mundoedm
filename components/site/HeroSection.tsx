import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ChevronDown } from "lucide-react";
import * as THREE from "three";

gsap.registerPlugin(ScrollToPlugin);

export function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null);
  const globeCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".hero-globe", {
        autoAlpha: 0,
        scale: 0.92,
        y: 20,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".hero-title", {
        autoAlpha: 0,
        y: 12,
        duration: 0.7,
        delay: 0.12,
        ease: "power3.out",
      });

      gsap.from(".hero-subtitle", {
        autoAlpha: 0,
        y: 24,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
      });

      gsap.from(".hero-cta", {
        autoAlpha: 0,
        scale: 0.96,
        duration: 0.7,
        delay: 0.3,
        ease: "power3.out",
      });

      gsap.from(".scroll-indicator", {
        autoAlpha: 0,
        y: 10,
        duration: 0.7,
        delay: 0.3,
        ease: "power3.out",
      });
    }, contentRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!globeCanvasRef.current) return;

    const canvas = globeCanvasRef.current;
    const wrapper = canvas.parentElement;
    if (!wrapper) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 4);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0xfbbf24, 1.4, 20);
    keyLight.position.set(2.5, 2, 4);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xf59e0b, 0.8, 20);
    rimLight.position.set(-3.5, -2, -2);
    scene.add(rimLight);

    const globeGeometry = new THREE.SphereGeometry(1.2, 96, 96);
    const globeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x2a1200,
      emissive: 0x4d2b05,
      emissiveIntensity: 0.45,
      roughness: 0.32,
      metalness: 0.28,
      clearcoat: 0.9,
      clearcoatRoughness: 0.15,
      transparent: true,
      opacity: 0.95,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    const wireGeometry = new THREE.SphereGeometry(1.26, 26, 26);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xfcd34d,
      wireframe: true,
      transparent: true,
      opacity: 0.32,
    });
    const wire = new THREE.Mesh(wireGeometry, wireMaterial);
    scene.add(wire);

    

    const starsCount = 300;
    const starsGeometry = new THREE.BufferGeometry();
    const starsPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount; i++) {
      const i3 = i * 3;
      const radius = 2 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starsPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      starsPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starsPositions[i3 + 2] = radius * Math.cos(phi);
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(starsPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xfef3c7,
      size: 0.02,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    const target = { x: 0, y: 0 };
    let pointerX = 0;
    let pointerY = 0;

    const onPointerMove = (event: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      pointerX = (x - 0.5) * 0.7;
      pointerY = (y - 0.5) * 0.5;
    };

    wrapper.addEventListener("pointermove", onPointerMove);

    const updateSize = () => {
      const { width, height } = wrapper.getBoundingClientRect();
      const safeWidth = Math.max(width, 1);
      const safeHeight = Math.max(height, 1);
      camera.aspect = safeWidth / safeHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(safeWidth, safeHeight, false);
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    const clock = new THREE.Clock();
    let frameId = 0;

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      target.x += (pointerX - target.x) * 0.03;
      target.y += (pointerY - target.y) * 0.03;

      globe.rotation.y = elapsed * 0.22 + target.x;
      globe.rotation.x = elapsed * 0.08 + target.y;

      wire.rotation.y = -elapsed * 0.25 + target.x * 0.7;
      wire.rotation.x = elapsed * 0.05 + target.y * 0.55;



      stars.rotation.y = elapsed * 0.05;
      stars.rotation.x = elapsed * 0.025;

      camera.position.x += (target.x * 0.55 - camera.position.x) * 0.04;
      camera.position.y += (-target.y * 0.45 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updateSize);
      wrapper.removeEventListener("pointermove", onPointerMove);
      renderer.dispose();
      globeGeometry.dispose();
      globeMaterial.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();

      starsGeometry.dispose();
      starsMaterial.dispose();
    };
  }, []);

  const scrollToNext = () => {
    gsap.to(window, {
      scrollTo: { y: "#timeline", offsetY: 0 },
      duration: 1.5,
      ease: "power3.inOut",
    });
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <div className="parallax-bg absolute inset-0 rounded-full bg-gradient-to-b from-transparent via-black/20 to-black/60" />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,transparent_40%,black_100%)]" />

      <div
        ref={contentRef}
        className="relative z-10 flex rounded-3xl max-w-5xl flex-col items-center px-6 text-center"
      >
        <div className="hero-globe  relative mb-10 flex h-[290px] w-[290px] items-center justify-center md:h-[360px] md:w-[360px]">
          <canvas ref={globeCanvasRef} className="absolute inset-0 h-full w-full" />
          
          <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.09),rgba(0,0,0,0)_65%)]" />
          <div className="pointer-events-none absolute -inset-5 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0.8),rgba(0,0,0,0)_70%)] blur-3xl" />

          <div className="hero-title relative z-10 flex items-center justify-center">
            <img
              src="/LOGO%202.png"
              alt="Logo Mundo EDM preta"
              className="h-20 w-auto md:h-80"
            />
          </div>
        </div>

        <p className="hero-subtitle mb-6 text-xl font-light tracking-wide text-gray-400 md:text-3xl">
          Um santuario digital para as memorias que moldaram
          <br />a cultura da musica eletronica
        </p>

        <div className="hero-cta mb-10 flex flex-wrap items-center justify-center gap-4 text-sm uppercase tracking-widest md:text-base">
          <span className="text-yellow-500">Nostalgia</span>
          <span className="text-white/80">-</span>
          <span className="text-yellow-400">Energia</span>
          <span className="text-gray-600">-</span>
          <span className="text-yellow-600">Eternidade</span>
        </div>
      </div>

      <button
        onClick={scrollToNext}
        className="scroll-indicator group absolute bottom-12 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-gray-600 transition-colors hover:text-yellow-500"
      >
        <span className="text-sm uppercase tracking-wider">Explorar</span>
        <ChevronDown className="h-6 w-6 animate-bounce group-hover:text-yellow-500" />
      </button>
    </section>
  );
}
