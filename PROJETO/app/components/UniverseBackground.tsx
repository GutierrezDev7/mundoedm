import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function UniverseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points;
    stars: THREE.Points;
    nebula: THREE.Mesh;
  } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 10, 100);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create golden particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 3000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      const radius = 50 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[i + 2] = radius * Math.cos(phi);
      
      // Golden colors
      const golden = Math.random();
      colorArray[i] = 0.8 + golden * 0.2; // R
      colorArray[i + 1] = 0.6 + golden * 0.3; // G
      colorArray[i + 2] = 0.1; // B
    }

    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(posArray, 3)
    );
    particlesGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colorArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Create stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 10000;
    const starsArray = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i++) {
      starsArray[i] = (Math.random() - 0.5) * 200;
    }

    starsGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(starsArray, 3)
    );

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Create nebula effect (simple sphere with transparent material)
    const nebulaGeometry = new THREE.SphereGeometry(20, 32, 32);
    const nebulaMaterial = new THREE.MeshBasicMaterial({
      color: 0x854d0e,
      transparent: true,
      opacity: 0.05,
      wireframe: false,
    });
    const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    nebula.position.set(0, -15, -40);
    scene.add(nebula);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xfbbf24, 0.5);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    sceneRef.current = { scene, camera, renderer, particles, stars, nebula };

    // Animation loop
    let animationId: number;
    const timer = new THREE.Timer();

    const animate = () => {
      const elapsedTime = timer.getElapsed();
      const scrollY = window.scrollY;
      const maxScroll = Math.max(
        document.body.scrollHeight - window.innerHeight,
        1
      );
      const scrollProgress = scrollY / maxScroll;

      // Animate particles
      particles.rotation.y = elapsedTime * 0.02 + scrollProgress * Math.PI * 2;
      particles.rotation.x =
        Math.sin(elapsedTime * 0.1) * 0.1 + scrollProgress * Math.PI * 0.5;
      const scale = 1 + Math.sin(elapsedTime * 0.5) * 0.1;
      particles.scale.set(scale, scale, scale);

      // Animate stars
      stars.rotation.y = elapsedTime * 0.01;
      stars.position.z = -scrollProgress * 30;
      stars.rotation.x = scrollProgress * Math.PI * 0.3;

      // Animate nebula
      nebula.position.y = -scrollProgress * 40 + 5;
      nebula.rotation.z = elapsedTime * 0.005 + scrollProgress * Math.PI * 0.2;

      // Move camera
      camera.position.z = 1 + scrollProgress * 10;
      camera.position.y = scrollProgress * -5;
      camera.lookAt(0, -scrollProgress * 5, 0);

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
      nebulaGeometry.dispose();
      nebulaMaterial.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-50 bg-black pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}