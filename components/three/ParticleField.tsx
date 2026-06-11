"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "@/lib/prng";

interface ParticleFieldProps {
  scrollProgress: React.RefObject<{ value: number }>;
  count?: number;
}

export default function ParticleField({
  scrollProgress,
  count = 300,
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null!);

  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const rand = mulberry32(7340912 + count);
    for (let i = 0; i < count; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const r = 3 + rand() * 15;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sz[i] = rand() * 2 + 0.5;
    }
    return { positions: pos, sizes: sz };
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    const sp = scrollProgress.current?.value ?? 0;

    pointsRef.current.rotation.y = t * 0.02;
    pointsRef.current.rotation.x = t * 0.01;
    pointsRef.current.position.z = sp * -2;

    // Subtle breathing scale
    const scale = 1 + Math.sin(t * 0.3) * 0.05;
    pointsRef.current.scale.setScalar(scale);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      {/* Normal blending: additive blending washes out to white on the light background */}
      <pointsMaterial
        size={0.02}
        color="#054040"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
