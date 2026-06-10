"use client";

import { useRef, Suspense, useImperativeHandle, forwardRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import FloatingCard from "./FloatingCard";
import DataNodes from "./DataNodes";
import ParticleField from "./ParticleField";

export interface FinanceUniverseHandle {
  scrollProgress: React.RefObject<{ value: number }>;
}

const FinanceUniverse = forwardRef<FinanceUniverseHandle>((_, ref) => {
  const scrollProgress = useRef({ value: 0 });

  useImperativeHandle(ref, () => ({
    scrollProgress,
  }));

  const cards = [
    { title: "AI Agents", color: "#054040", position: [-2.5, 1.2, 0] as [number, number, number] },
    { title: "Automation", color: "#6f8f1f", position: [2.5, 1.2, 0] as [number, number, number] },
    { title: "Analytics", color: "#0f766e", position: [-2.5, -1.2, 0] as [number, number, number] },
    { title: "Workflows", color: "#86a32e", position: [2.5, -1.2, 0] as [number, number, number] },
  ];

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <pointLight position={[-4, 3, 3]} color="#b5d447" intensity={0.6} distance={12} />
        <pointLight position={[4, 3, 3]} color="#054040" intensity={0.6} distance={12} />
        <pointLight position={[0, -3, 4]} color="#0f766e" intensity={0.4} distance={12} />

        {cards.map((card, i) => (
          <FloatingCard
            key={card.title}
            position={card.position}
            title={card.title}
            color={card.color}
            index={i}
            scrollProgress={scrollProgress}
          />
        ))}

        <DataNodes scrollProgress={scrollProgress} />
        <ParticleField scrollProgress={scrollProgress} count={200} />

        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
});

FinanceUniverse.displayName = "FinanceUniverse";
export default FinanceUniverse;
