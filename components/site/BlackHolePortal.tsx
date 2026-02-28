"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

const DUST_COUNT = 420;
const DEBRIS_COUNT = 85;
const MIN_R = 0.22;
const MAX_R = 1.5;
const PULL_SPEED = 0.58;
const ANGULAR_FACTOR = 1.85;
const PARTICLE_WAVE_AMP = 0.045;
const PARTICLE_TURBULENCE = 0.025;

export function BlackHolePortal() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
    camera.position.set(0, 0, 2.9);
    const camTarget = { x: 0, y: 0, z: 2.9 };
    const lookOffset = { x: 0, y: 0 };

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const ambient = new THREE.AmbientLight(0x0f172a, 0.2);
    scene.add(ambient);

    const keyLight = new THREE.PointLight(0x38bdf8, 1.6, 16);
    keyLight.position.set(2, 1.5, 3);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xc084fc, 0.7, 14);
    rimLight.position.set(-2, -1, 2.5);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x818cf8, 0.3, 25);
    fillLight.position.set(0, 2, 1);
    scene.add(fillLight);

    const keyIntensity = { v: 1.5 };
    const rimIntensity = { v: 0.65 };
    const ambientIntensity = { v: 0.18 };
    const coreEmissive = { v: 0.45 };
    const innerGlowOpacity = { o: 0.4 };
    const dustOpacity = { o: 0.75 };
    const photonScale = { s: 1 };
    const horizonScale = { s: 1 };

    gsap.to(keyIntensity, { v: 2, duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(rimIntensity, { v: 0.95, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(ambientIntensity, { v: 0.24, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(coreEmissive, { v: 0.62, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(innerGlowOpacity, { o: 0.55, duration: 3.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(dustOpacity, { o: 0.88, duration: 2.6, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(photonScale, { s: 1.05, duration: 2.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(horizonScale, { s: 1.03, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut" });

    const coreGeo = new THREE.SphereGeometry(0.24, 72, 72);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x000000,
      emissive: 0x030014,
      emissiveIntensity: 0.5,
      roughness: 0.1,
      metalness: 0.98,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    const innerGlowGeo = new THREE.SphereGeometry(0.255, 48, 48);
    const innerGlowMat = new THREE.MeshBasicMaterial({
      color: 0x1e1b4b,
      transparent: true,
      opacity: 0.5,
      side: THREE.BackSide,
    });
    const innerGlow = new THREE.Mesh(innerGlowGeo, innerGlowMat);
    scene.add(innerGlow);

    const horizonRingGeo = new THREE.RingGeometry(0.26, 0.42, 96);
    const horizonMat = new THREE.MeshBasicMaterial({
      color: 0x312e81,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
    });
    const horizonRing = new THREE.Mesh(horizonRingGeo, horizonMat);
    horizonRing.rotation.x = -Math.PI / 2;
    scene.add(horizonRing);

    const photonRingGeo = new THREE.RingGeometry(0.42, 0.5, 64);
    const photonMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });
    const photonRing = new THREE.Mesh(photonRingGeo, photonMat);
    photonRing.rotation.x = -Math.PI / 2;
    scene.add(photonRing);

    const RING_WAVE_VERTEX = `
      uniform float uTime;
      uniform float uAmplitude;
      uniform float uSpeed;
      void main() {
        vec3 pos = position;
        float angle = atan(pos.y, pos.x);
        float wave = sin(angle + uTime * uSpeed) * uAmplitude;
        vec2 radial = normalize(pos.xy);
        pos.x += radial.x * wave;
        pos.y += radial.y * wave;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;
    const RING_WAVE_FRAGMENT = `
      uniform vec3 uColor;
      uniform float uOpacity;
      void main() {
        gl_FragColor = vec4(uColor, uOpacity);
      }
    `;

    const ringConfigs = [
      { radius: 0.54, tube: 0.042, tilt: 0.4, color: 0x67e8f9, opacity: 0.9, amp: 0.032, speed: 4.2 },
      { radius: 0.7, tube: 0.038, tilt: 0.52, color: 0x38bdf8, opacity: 0.72, amp: 0.028, speed: 3.5 },
      { radius: 0.88, tube: 0.032, tilt: 0.64, color: 0x6366f1, opacity: 0.58, amp: 0.025, speed: 2.9 },
      { radius: 1.08, tube: 0.028, tilt: 0.74, color: 0x8b5cf6, opacity: 0.42, amp: 0.022, speed: 2.4 },
      { radius: 1.3, tube: 0.024, tilt: 0.82, color: 0x4c1d95, opacity: 0.3, amp: 0.018, speed: 1.8 },
    ];

    type RingLike = {
      geometry: { dispose: () => void };
      material: { uniforms: { uTime: { value: number } }; dispose: () => void };
      rotation: { z: number; x: number };
    };
    const rings: RingLike[] = [];
    const ringColor = new THREE.Color();
    const ShaderMaterialClass = (THREE as Record<string, unknown>).ShaderMaterial as new (
      opts: unknown
    ) => { uniforms: { uTime: { value: number } }; dispose: () => void };
    ringConfigs.forEach((opt) => {
      const geo = new THREE.TorusGeometry(opt.radius, opt.tube, 48, 120);
      ringColor.setHex(opt.color);
      const mat = new ShaderMaterialClass({
        vertexShader: RING_WAVE_VERTEX,
        fragmentShader: RING_WAVE_FRAGMENT,
        uniforms: {
          uTime: { value: 0 },
          uAmplitude: { value: opt.amp },
          uSpeed: { value: opt.speed },
          uColor: { value: ringColor.clone() },
          uOpacity: { value: opt.opacity },
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: true,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = -Math.PI / 2 + opt.tilt;
      scene.add(ring);
      rings.push(ring as unknown as RingLike);
    });

    const cyan = new THREE.Color(0x67e8f9);
    const blue = new THREE.Color(0x38bdf8);
    const violet = new THREE.Color(0x8b5cf6);
    const indigo = new THREE.Color(0x4c1d95);

    const dustPos = new Float32Array(DUST_COUNT * 3);
    const dustR = new Float32Array(DUST_COUNT);
    const dustTheta = new Float32Array(DUST_COUNT);
    const dustPhi = new Float32Array(DUST_COUNT);
    const dustColor = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      dustR[i] = 0.4 + Math.random() * (MAX_R - 0.4);
      dustTheta[i] = Math.random() * Math.PI * 2;
      dustPhi[i] = Math.acos((Math.random() - 0.5) * 1.6);
      const tr = (dustR[i] - 0.4) / (MAX_R - 0.4);
      const c = indigo.clone().lerp(violet, tr * 0.5).lerp(blue, 1 - tr * 0.6).lerp(cyan, 1 - tr);
      dustColor[i * 3] = c.r;
      dustColor[i * 3 + 1] = c.g;
      dustColor[i * 3 + 2] = c.b;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute("color", new THREE.BufferAttribute(dustColor, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.022,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    const debrisPos = new Float32Array(DEBRIS_COUNT * 3);
    const debrisR = new Float32Array(DEBRIS_COUNT);
    const debrisTheta = new Float32Array(DEBRIS_COUNT);
    const debrisPhi = new Float32Array(DEBRIS_COUNT);
    const debrisColor = new Float32Array(DEBRIS_COUNT * 3);
    for (let i = 0; i < DEBRIS_COUNT; i++) {
      debrisR[i] = 0.55 + Math.random() * (MAX_R - 0.55);
      debrisTheta[i] = Math.random() * Math.PI * 2;
      debrisPhi[i] = Math.acos((Math.random() - 0.5) * 1.4);
      const tr = (debrisR[i] - 0.55) / (MAX_R - 0.55);
      const c = violet.clone().lerp(blue, 1 - tr * 0.5).lerp(cyan, 1 - tr);
      debrisColor[i * 3] = c.r;
      debrisColor[i * 3 + 1] = c.g;
      debrisColor[i * 3 + 2] = c.b;
    }
    const debrisGeo = new THREE.BufferGeometry();
    debrisGeo.setAttribute("position", new THREE.BufferAttribute(debrisPos, 3));
    debrisGeo.setAttribute("color", new THREE.BufferAttribute(debrisColor, 3));
    const debrisMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const debris = new THREE.Points(debrisGeo, debrisMat);
    scene.add(debris);

    const updateSize = () => {
      const { width, height } = wrapper.getBoundingClientRect();
      const s = Math.max(width, height, 1);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      renderer.setSize(s, s);
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    const pointer = { x: 0, y: 0 };
    const keyLightPos = { x: 2, y: 1.5, z: 3 };
    const lookOffsetTarget = { x: 0, y: 0 };

    const onPointerMove = (e: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w <= 0 || h <= 0) return;
      const nx = (e.clientX - rect.left) / w - 0.5;
      const ny = 0.5 - (e.clientY - rect.top) / h;
      pointer.x = nx * 1.4;
      pointer.y = ny * 1.2;
    };
    wrapper.addEventListener("pointermove", onPointerMove);

    const durations = [3.8, 5.2, 7, 9.5, 13];
    const directions = [1, -1, 1, -1, 1];
    rings.forEach((ring, i) => {
      gsap.to(ring.rotation, {
        z: directions[i] * Math.PI * 2,
        duration: durations[i],
        repeat: -1,
        ease: "none",
      });
    });
    gsap.to(horizonRing.rotation, { z: Math.PI * 2, duration: 3, repeat: -1, ease: "none" });
    gsap.to(photonRing.rotation, { z: -Math.PI * 2, duration: 4, repeat: -1, ease: "none" });

    gsap.to(core.scale, {
      x: 1.05,
      y: 1.05,
      z: 1.05,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const horizonOpacity = { o: 0.92 };
    const photonOpacity = { o: 0.55 };
    gsap.to(horizonOpacity, { o: 0.72, duration: 1.6, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(photonOpacity, { o: 0.88, duration: 2.2, repeat: -1, yoyo: true, ease: "sine.inOut" });

    const suctionStrength = { v: 1 };
    gsap.to(suctionStrength, { v: 1.25, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });

    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      const dt = Math.min(clock.getDelta(), 0.05);

      ambient.intensity = ambientIntensity.v;
      keyLight.intensity = keyIntensity.v;
      rimLight.intensity = rimIntensity.v;
      (coreMat as { emissiveIntensity: number }).emissiveIntensity = coreEmissive.v;
      (innerGlowMat as { opacity: number }).opacity = innerGlowOpacity.o;
      (horizonMat as { opacity: number }).opacity = horizonOpacity.o;
      (photonMat as { opacity: number }).opacity = photonOpacity.o;
      (dustMat as { opacity: number }).opacity = dustOpacity.o;
      photonRing.scale.setScalar(photonScale.s);
      horizonRing.scale.setScalar(horizonScale.s);

      keyLightPos.x = 2 + 0.38 * Math.sin(t * 0.35) + pointer.x * 1.2;
      keyLightPos.y = 1.5 + 0.35 * Math.cos(t * 0.28) + pointer.y * 1;
      keyLightPos.z = 3 + 0.25 * Math.sin(t * 0.2) - Math.abs(pointer.x) * 0.3;
      keyLight.position.x += (keyLightPos.x - keyLight.position.x) * 0.07;
      keyLight.position.y += (keyLightPos.y - keyLight.position.y) * 0.07;
      keyLight.position.z += (keyLightPos.z - keyLight.position.z) * 0.07;

      rimLight.position.x = -2 + 0.28 * Math.cos(t * 0.32);
      rimLight.position.y = -1 + 0.25 * Math.sin(t * 0.28);
      rimLight.position.z = 2.5 + 0.15 * Math.sin(t * 0.2);
      fillLight.position.y = 2 + 0.2 * Math.sin(t * 0.3);

      lookOffsetTarget.x = 0.028 * Math.sin(t * 0.5) + pointer.x * 0.08;
      lookOffsetTarget.y = 0.028 * Math.cos(t * 0.45) + pointer.y * 0.06;
      lookOffset.x += (lookOffsetTarget.x - lookOffset.x) * 0.06;
      lookOffset.y += (lookOffsetTarget.y - lookOffset.y) * 0.06;

      core.rotation.y += dt * 0.06;
      (core.rotation as { x: number }).x = Math.sin(t * 0.15) * 0.05;

      rings.forEach((ring) => {
        ring.material.uniforms.uTime.value = t;
      });

      const pull = PULL_SPEED * suctionStrength.v * dt;
      const flatY = 0.5;

      for (let i = 0; i < DUST_COUNT; i++) {
        let r = dustR[i];
        r -= pull * (1 + 0.5 / Math.max(r, 0.3));
        dustTheta[i] += (ANGULAR_FACTOR / Math.max(r, 0.25)) * dt;
        dustTheta[i] += Math.sin(t * 2.2 + i * 0.01) * PARTICLE_TURBULENCE * dt;
        if (r < MIN_R) {
          r = 0.45 + Math.random() * (MAX_R - 0.45);
          dustTheta[i] = Math.random() * Math.PI * 2;
          dustPhi[i] = Math.acos((Math.random() - 0.5) * 1.6);
          const tr = (r - 0.4) / (MAX_R - 0.4);
          const c = indigo.clone().lerp(violet, tr * 0.5).lerp(blue, 1 - tr * 0.6).lerp(cyan, 1 - tr);
          dustColor[i * 3] = c.r;
          dustColor[i * 3 + 1] = c.g;
          dustColor[i * 3 + 2] = c.b;
        }
        dustR[i] = r;
        const st = Math.sin(dustPhi[i]);
        const waveY = Math.sin(t * 3.5 + dustTheta[i] * 2) * PARTICLE_WAVE_AMP;
        const wobble = 1 + Math.sin(t * 2.8 + dustTheta[i] * 1.5) * 0.04;
        const rEff = r * wobble;
        dustPos[i * 3] = rEff * st * Math.cos(dustTheta[i]);
        dustPos[i * 3 + 1] = rEff * st * Math.sin(dustTheta[i]) * flatY + waveY;
        dustPos[i * 3 + 2] = rEff * Math.cos(dustPhi[i]);
      }
      dustGeo.attributes.position.needsUpdate = true;
      dustGeo.attributes.color.needsUpdate = true;

      for (let i = 0; i < DEBRIS_COUNT; i++) {
        let r = debrisR[i];
        r -= pull * 0.7 * (1 + 0.4 / Math.max(r, 0.35));
        debrisTheta[i] += (ANGULAR_FACTOR * 0.85 / Math.max(r, 0.3)) * dt;
        debrisTheta[i] += Math.sin(t * 1.8 + i * 0.02) * PARTICLE_TURBULENCE * 1.2 * dt;
        if (r < MIN_R) {
          r = 0.6 + Math.random() * (MAX_R - 0.6);
          debrisTheta[i] = Math.random() * Math.PI * 2;
          debrisPhi[i] = Math.acos((Math.random() - 0.5) * 1.4);
          const tr = (r - 0.55) / (MAX_R - 0.55);
          const c = violet.clone().lerp(blue, 1 - tr * 0.5).lerp(cyan, 1 - tr);
          debrisColor[i * 3] = c.r;
          debrisColor[i * 3 + 1] = c.g;
          debrisColor[i * 3 + 2] = c.b;
        }
        debrisR[i] = r;
        const st = Math.sin(debrisPhi[i]);
        const waveY = Math.sin(t * 2.8 + debrisTheta[i] * 2.2) * PARTICLE_WAVE_AMP * 1.3;
        const wobble = 1 + Math.sin(t * 2.2 + debrisTheta[i]) * 0.05;
        const rEff = r * wobble;
        debrisPos[i * 3] = rEff * st * Math.cos(debrisTheta[i]);
        debrisPos[i * 3 + 1] = rEff * st * Math.sin(debrisTheta[i]) * flatY + waveY;
        debrisPos[i * 3 + 2] = rEff * Math.cos(debrisPhi[i]);
      }
      debrisGeo.attributes.position.needsUpdate = true;
      debrisGeo.attributes.color.needsUpdate = true;

      camera.position.x = lookOffset.x * 0.8 + 0.055 * Math.sin(t * 0.4);
      camera.position.y = lookOffset.y * 0.8 + 0.045 * Math.cos(t * 0.35);
      camera.position.z = camTarget.z + 0.04 * Math.sin(t * 0.25);
      camera.lookAt(lookOffset.x * 0.3, lookOffset.y * 0.3, 0);

      innerGlow.rotation.y += dt * 0.45;
      (innerGlow.rotation as { x: number }).x = Math.sin(t * 0.18) * 0.08;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      wrapper.removeEventListener("pointermove", onPointerMove);
      gsap.killTweensOf([
        keyIntensity,
        rimIntensity,
        ambientIntensity,
        coreEmissive,
        innerGlowOpacity,
        dustOpacity,
        photonScale,
        horizonScale,
        horizonOpacity,
        photonOpacity,
        suctionStrength,
      ]);
      gsap.killTweensOf(core.scale);
      rings.forEach((r) => gsap.killTweensOf(r.rotation));
      gsap.killTweensOf(horizonRing.rotation);
      gsap.killTweensOf(photonRing.rotation);
      window.removeEventListener("resize", updateSize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      innerGlowGeo.dispose();
      innerGlowMat.dispose();
      horizonRingGeo.dispose();
      horizonMat.dispose();
      photonRingGeo.dispose();
      photonMat.dispose();
      rings.forEach((r) => {
        r.geometry.dispose();
        (r.material as { dispose: () => void }).dispose();
      });
      dustGeo.dispose();
      dustMat.dispose();
      debrisGeo.dispose();
      debrisMat.dispose();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative h-[280px] w-[280px] sm:h-[320px] sm:w-[320px] md:h-[360px] md:w-[360px] lg:h-[400px] lg:w-[400px]"
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{
          filter:
            "drop-shadow(0 0 90px rgba(34,211,238,0.25)) drop-shadow(0 0 160px rgba(139,92,246,0.18)) drop-shadow(0 0 220px rgba(76,29,149,0.12))",
        }}
      />
    </div>
  );
}
