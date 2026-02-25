import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, useScroll } from '@react-three/drei';
import * as THREE from 'three';

export function ThreeBackground() {
  const starsRef = useRef<THREE.Group>(null);
  const scroll = useScroll();

  useFrame((state, delta) => {
    if (!starsRef.current) return;
    
    // Constant rotation
    starsRef.current.rotation.y += delta * 0.05;
    starsRef.current.rotation.x += delta * 0.02;

    // Scroll based movement
    // scroll.offset is between 0 and 1
    const scrollOffset = scroll.offset;
    
    // Move the camera or the scene based on scroll
    // Here we move the stars group down/up and rotate it faster based on scroll
    starsRef.current.position.z = scrollOffset * 10; // Zoom in effect
    starsRef.current.rotation.z = scrollOffset * Math.PI * 0.5; // Rotate on Z axis as we scroll
  });

  return (
    <group ref={starsRef}>
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1} 
      />
      {/* We can add more decorative 3D elements here later if needed */}
    </group>
  );
}
