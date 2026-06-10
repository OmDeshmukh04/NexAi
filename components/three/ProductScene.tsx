"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Text } from "@react-three/drei";
import * as THREE from "three";

interface ProductSceneProps {
  activeIndex: number;
}

function DashboardCard({
  position,
  title,
  color,
  isActive,
}: {
  position: [number, number, number];
  title: string;
  color: string;
  isActive: boolean;
  index: number;
}) {
  const meshRef = useRef<THREE.Group>(null!);
  const targetPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const activePos = useMemo(() => new THREE.Vector3(0, 0, 2), []);

  useFrame(() => {
    if (!meshRef.current) return;
    const target = isActive ? activePos : targetPos;
    meshRef.current.position.lerp(target, 0.05);
    const targetScale = isActive ? 1.3 : 0.8;
    const s = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.05);
    meshRef.current.scale.setScalar(s);
  });

  return (
    <group ref={meshRef} position={position}>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
        <mesh>
          <planeGeometry args={[1.8, 1.1]} />
          <meshPhysicalMaterial
            color={new THREE.Color(color).multiplyScalar(0.2)}
            transparent
            opacity={isActive ? 0.25 : 0.1}
            roughness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, 0.53, 0.001]}>
          <planeGeometry args={[1.7, 0.015]} />
          <meshBasicMaterial color={color} transparent opacity={0.9} />
        </mesh>
        <Text position={[0, 0.1, 0.01]} fontSize={0.12} color="#003434" anchorX="center" anchorY="middle">
          {title}
        </Text>
        {[0.2, 0.35, 0.25, 0.4, 0.3].map((h, i) => (
          <mesh key={i} position={[-0.5 + i * 0.25, -0.2 + h / 2, 0.01]}>
            <planeGeometry args={[0.12, h]} />
            <meshBasicMaterial color={color} transparent opacity={0.3} />
          </mesh>
        ))}
      </Float>
    </group>
  );
}

function CentralDashboard() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.05;
  });

  return (
    <group>
      <mesh ref={meshRef} position={[0, 0, -1]}>
        <planeGeometry args={[3.5, 2.2]} />
        <meshPhysicalMaterial color="#054040" transparent opacity={0.06} roughness={0.1} side={THREE.DoubleSide} />
      </mesh>
      {[-0.8, -0.4, 0, 0.4, 0.8].map((y, i) => (
        <mesh key={i} position={[0, y, -0.99]}>
          <planeGeometry args={[3.3, 0.003]} />
          <meshBasicMaterial color="#054040" transparent opacity={0.08} />
        </mesh>
      ))}
    </group>
  );
}

function ProductSceneContent({ activeIndex }: ProductSceneProps) {
  const products = [
    { title: "Command Center", color: "#054040", position: [-2, 1.2, 0] as [number, number, number] },
    { title: "AI Agents", color: "#6f8f1f", position: [2, 1.2, 0] as [number, number, number] },
    { title: "Analytics", color: "#0f766e", position: [-2, -1.2, 0] as [number, number, number] },
    { title: "Automation", color: "#86a32e", position: [2, -1.2, 0] as [number, number, number] },
  ];

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} />
      <pointLight position={[0, 0, 5]} color="#b5d447" intensity={0.3} distance={15} />
      <CentralDashboard />
      {products.map((p, i) => (
        <DashboardCard key={p.title} position={p.position} title={p.title} color={p.color} isActive={activeIndex === i} index={i} />
      ))}
      <Environment preset="night" />
    </>
  );
}

export default function ProductScene({ activeIndex }: ProductSceneProps) {
  return (
    <Canvas camera={{ position: [0, 0, 5.5], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} style={{ background: "transparent" }}>
      <Suspense fallback={null}>
        <ProductSceneContent activeIndex={activeIndex} />
      </Suspense>
    </Canvas>
  );
}
