import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Cloud } from '@react-three/drei';
import * as THREE from 'three';

function Universe() {
  const starsRef = useRef<THREE.Group>(null);
  const nebulaRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;

    if (starsRef.current) {
      // Rotate stars based on time and scroll
      starsRef.current.rotation.y = time * 0.02 + scrollProgress * Math.PI;
      starsRef.current.rotation.x = scrollProgress * Math.PI * 0.2;
      
      // Move stars forward/backward based on scroll to give depth feeling
      // We wrap position to keep them in view or just let them move
      starsRef.current.position.z = scrollProgress * 10;
    }

    if (nebulaRef.current) {
        nebulaRef.current.rotation.z = time * 0.01;
        nebulaRef.current.position.y = -scrollProgress * 20 + 5; // Move nebula up as we scroll down
    }
  });

  return (
    <>
      <group ref={starsRef}>
        <Stars 
            radius={80} 
            depth={60} 
            count={8000} 
            factor={6} 
            saturation={0} 
            fade 
            speed={1} 
        />
      </group>
      
      <group ref={nebulaRef} position={[0, -10, -20]}>
         {/* Subtle nebula clouds using Float to make them drift */}
         <Float speed={2} rotationIntensity={0.2} floatIntensity={2}>
            <Cloud opacity={0.3} speed={0.4} width={20} depth={5} segments={10} color="#4c1d95" />
         </Float>
         <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1} position={[15, 5, 5]}>
            <Cloud opacity={0.2} speed={0.3} width={15} depth={5} segments={8} color="#0f172a" />
         </Float>
      </group>
    </>
  );
}

export function BackgroundScene() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-50 bg-black pointer-events-none">
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
        <Universe />
        <ambientLight intensity={0.2} />
      </Canvas>
    </div>
  );
}
