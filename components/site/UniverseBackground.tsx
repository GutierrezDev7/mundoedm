import { useEffect, useRef } from "react";
import * as THREE from "three";

export function UniverseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 10, 100);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      const radius = 50 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[i + 2] = radius * Math.cos(phi);

      const golden = Math.random();
      colorArray[i] = 0.8 + golden * 0.2;
      colorArray[i + 1] = 0.6 + golden * 0.3;
      colorArray[i + 2] = 0.1;
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.17,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 10000;
    const starsArray = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i++) {
      starsArray[i] = (Math.random() - 0.5) * 200;
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(starsArray, 3));

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);



    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xfbbf24, 0.5);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    let animationId = 0;
    const clock = new THREE.Clock();
    clock.start();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      const scrollY = window.scrollY;
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const scrollProgress = scrollY / maxScroll;

      particles.rotation.y = elapsedTime * 0.02 + scrollProgress * Math.PI * 2;
      particles.rotation.x =
        Math.sin(elapsedTime * 0.1) * 0.1 + scrollProgress * Math.PI * 0.5;
      const scale = 1 + Math.sin(elapsedTime * 0.5) * 0.1;
      particles.scale.set(scale, scale, scale);

      stars.rotation.y = elapsedTime * 0.01;
      stars.position.z = -scrollProgress * 30;
      stars.rotation.x = scrollProgress * Math.PI * 0.3;


      camera.position.z = 1 + scrollProgress * 10;
      camera.position.y = scrollProgress * -5;
      camera.lookAt(0, -scrollProgress * 5, 0);

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();

    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-black">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
