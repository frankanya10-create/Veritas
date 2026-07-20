"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function createGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.15, "rgba(255,255,255,0.8)");
  gradient.addColorStop(0.4, "rgba(255,255,255,0.3)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function ParticleCloud() {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const glowRef = useRef<THREE.Sprite>(null);
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });

  const particleCount = 6000;
  const radius = 3;

  const { spherePositions, scatteredPositions, sizes, floating } = useMemo(() => {
    const sphere = new Float32Array(particleCount * 3);
    const scattered = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const floating = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = radius * (0.6 + Math.random() * 0.7);

      sphere[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      sphere[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      sphere[i * 3 + 2] = r * Math.cos(phi);

      const spread = 14;
      scattered[i * 3] = (Math.random() - 0.5) * spread;
      scattered[i * 3 + 1] = (Math.random() - 0.5) * spread;
      scattered[i * 3 + 2] = (Math.random() - 0.5) * spread;

      sizes[i] = 1 + Math.random() * 4;
      floating[i] = Math.random() * Math.PI * 2;
    }

    return { spherePositions: sphere, scatteredPositions: scattered, sizes, floating };
  }, []);

  const currentPositions = useMemo(() => new Float32Array(scatteredPositions), [scatteredPositions]);
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current || !groupRef.current) return;

    const posAttr = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    // Breathe oscillation
    const breathe = (Math.sin(state.clock.elapsedTime * 0.9) + 1) / 2;

    const smoothFactor = 1 - Math.exp(-15 * delta);
    smoothMouse.current.x += (mouseRef.current.x - smoothMouse.current.x) * smoothFactor;
    smoothMouse.current.y += (mouseRef.current.y - smoothMouse.current.y) * smoothFactor;

    const mx = smoothMouse.current.x;
    const my = smoothMouse.current.y;

    // Camera follows mouse
    state.camera.position.x += (mx * 0.12 - state.camera.position.x) * smoothFactor * 0.3;
    state.camera.position.y += (my * 0.08 - state.camera.position.y) * smoothFactor * 0.3;
    state.camera.lookAt(0, 0, 0);

    // Group rotation follows mouse
    targetRotation.current.y += (mx * 1.5 - targetRotation.current.y) * smoothFactor;
    targetRotation.current.x += (my * 0.8 - targetRotation.current.x) * smoothFactor;

    groupRef.current.rotation.y += delta * 0.03 + targetRotation.current.y * delta * 2;
    groupRef.current.rotation.x += targetRotation.current.x * delta * 1.2;

    // Update particle positions with breathe oscillation
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      const sx = scatteredPositions[i3];
      const sy = scatteredPositions[i3 + 1];
      const sz = scatteredPositions[i3 + 2];

      const tx = spherePositions[i3];
      const ty = spherePositions[i3 + 1];
      const tz = spherePositions[i3 + 2];

      let px = tx * breathe + sx * (1 - breathe);
      let py = ty * breathe + sy * (1 - breathe);
      let pz = tz * breathe + sz * (1 - breathe);

      // Mouse displacement
      const influence = 0.4 * breathe;
      const dx = px - mx * 3;
      const dy = py - my * 3;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0.01) {
        const grav = Math.max(0, 1 - dist / 10) * influence;
        px -= dx * grav;
        py -= dy * grav;
      }

      // Micro float
      px += Math.sin(state.clock.elapsedTime * 0.3 + floating[i]) * 0.012;
      py += Math.cos(state.clock.elapsedTime * 0.4 + floating[i] * 1.3) * 0.012;
      pz += Math.sin(state.clock.elapsedTime * 0.5 + floating[i] * 0.7) * 0.012;

      currentPositions[i3] = px;
      currentPositions[i3 + 1] = py;
      currentPositions[i3 + 2] = pz;

      posArray[i3] = px;
      posArray[i3 + 1] = py;
      posArray[i3 + 2] = pz;
    }

    posAttr.needsUpdate = true;

    materialRef.current.size = 0.05;
    materialRef.current.opacity = 0.9;

    if (glowRef.current) {
      const glowScale = 10 + Math.sin(state.clock.elapsedTime * 0.15) * 0.5;
      glowRef.current.scale.set(glowScale, glowScale, 1);
      (glowRef.current.material as THREE.SpriteMaterial).opacity = 0.3;
    }
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const glowTexture = useMemo(() => createGlowTexture(), []);

  return (
    <group ref={groupRef}>
      <sprite ref={glowRef} position={[0, 0, 0]} scale={[0, 0, 1]}>
        <spriteMaterial
          map={glowTexture}
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#1a3050"
        />
      </sprite>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[currentPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[sizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          size={0}
          color="#ffffff"
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          map={glowTexture}
          alphaMap={glowTexture}
          alphaTest={0.001}
        />
      </points>
    </group>
  );
}

export default function ParticleSphere() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <ParticleCloud />
      </Canvas>
    </div>
  );
}
