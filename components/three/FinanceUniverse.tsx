"use client";

import { useRef, Suspense, useImperativeHandle, forwardRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import PaymentCard from "./PaymentCard";
import Coins from "./Coins";
import ParticleField from "./ParticleField";

export interface FinanceUniverseHandle {
  scrollProgress: React.RefObject<{ value: number }>;
}

/** Tilts the whole scene toward the pointer for a parallax feel. */
function PointerRig({ children }: { children: React.ReactNode }) {
  const rigRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    if (!rigRef.current) return;
    const damp = 1 - Math.exp(-delta * 3);
    rigRef.current.rotation.y +=
      (state.pointer.x * 0.18 - rigRef.current.rotation.y) * damp;
    rigRef.current.rotation.x +=
      (-state.pointer.y * 0.12 - rigRef.current.rotation.x) * damp;
  });

  return <group ref={rigRef}>{children}</group>;
}

/**
 * Positions the card + coins: pushed right on wide screens so the headline
 * column stays clear, centered and slightly smaller on narrow screens.
 */
function CardRig({ children }: { children: React.ReactNode }) {
  const { viewport } = useThree();
  const wide = viewport.width > 9;
  return (
    <group
      position={[wide ? 1.9 : 0, -0.4, 1.2]}
      scale={wide ? 1 : 0.8}
    >
      {children}
    </group>
  );
}

const FinanceUniverse = forwardRef<FinanceUniverseHandle>((_, ref) => {
  const scrollProgress = useRef({ value: 0 });

  useImperativeHandle(ref, () => ({
    scrollProgress,
  }));

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <pointLight position={[-4, 3, 3]} color="#b5d447" intensity={0.7} distance={12} />
        <pointLight position={[4, -2, 4]} color="#0f766e" intensity={0.5} distance={12} />

        <PointerRig>
          <CardRig>
            <PaymentCard scrollProgress={scrollProgress} />
            <Coins scrollProgress={scrollProgress} />
          </CardRig>
          <ParticleField scrollProgress={scrollProgress} count={220} />
        </PointerRig>

        {/* Procedural studio environment — no runtime CDN downloads */}
        <Environment resolution={256} frames={1}>
          <Lightformer
            form="rect"
            intensity={2.2}
            color="#ffffff"
            position={[0, 5, 2]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[10, 6, 1]}
          />
          <Lightformer
            form="rect"
            intensity={1.4}
            color="#b5d447"
            position={[6, 1, 1]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={[6, 2, 1]}
          />
          <Lightformer
            form="rect"
            intensity={1.2}
            color="#0f766e"
            position={[-6, -1, 1]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[6, 2, 1]}
          />
          <Lightformer
            form="circle"
            intensity={1.0}
            color="#e8f5d0"
            position={[0, -4, 3]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[5, 5, 1]}
          />
        </Environment>
      </Suspense>
    </Canvas>
  );
});

FinanceUniverse.displayName = "FinanceUniverse";
export default FinanceUniverse;
