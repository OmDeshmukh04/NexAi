"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";

interface FloatingCardProps {
  position: [number, number, number];
  title: string;
  color: string;
  index: number;
  scrollProgress: React.RefObject<{ value: number }>;
}

export default function FloatingCard({
  position,
  title,
  color,
  index,
  scrollProgress,
}: FloatingCardProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);

  const cardGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const w = 1.2;
    const h = 0.75;
    const r = 0.08;
    shape.moveTo(-w + r, -h);
    shape.lineTo(w - r, -h);
    shape.quadraticCurveTo(w, -h, w, -h + r);
    shape.lineTo(w, h - r);
    shape.quadraticCurveTo(w, h, w - r, h);
    shape.lineTo(-w + r, h);
    shape.quadraticCurveTo(-w, h, -w, h - r);
    shape.lineTo(-w, -h + r);
    shape.quadraticCurveTo(-w, -h, -w + r, -h);
    return new THREE.ShapeGeometry(shape);
  }, []);

  const cardMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color).multiplyScalar(0.3),
        transparent: true,
        opacity: 0.15,
        roughness: 0.1,
        metalness: 0.1,
        side: THREE.DoubleSide,
      }),
    [color]
  );

  const edgeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.6,
      }),
    [color]
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const sp = scrollProgress.current?.value ?? 0;

    // Spread cards outward as user scrolls
    const spreadFactor = 1 + sp * 0.8;
    groupRef.current.position.x = initialPos.x * spreadFactor;
    groupRef.current.position.y =
      initialPos.y * spreadFactor + Math.sin(t * 0.5 + index * 1.5) * 0.1;
    groupRef.current.position.z = initialPos.z - sp * 2;

    // Gentle rotation
    groupRef.current.rotation.y = Math.sin(t * 0.3 + index) * 0.1;
    groupRef.current.rotation.x = Math.sin(t * 0.2 + index * 0.5) * 0.05;

    // Glow pulse
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.08 + Math.sin(t * 1.5 + index * 2) * 0.04;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef} position={position}>
        {/* Card background */}
        <mesh ref={meshRef} geometry={cardGeometry} material={cardMaterial} />

        {/* Top accent line */}
        <mesh position={[0, 0.72, 0.001]}>
          <planeGeometry args={[2.2, 0.02]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>

        {/* Glow behind card */}
        <mesh ref={glowRef} position={[0, 0, -0.1]} scale={[1.3, 1.3, 1]}>
          <planeGeometry args={[2.4, 1.5]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Card title */}
        <Text
          position={[0, 0.15, 0.01]}
          fontSize={0.15}
          color="#003434"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-medium.woff"
          maxWidth={2}
        >
          {title}
        </Text>

        {/* Decorative dots */}
        {[[-0.8, -0.3], [-0.4, -0.3], [0, -0.3], [0.4, -0.3]].map(
          ([x, y], i) => (
            <mesh key={i} position={[x!, y!, 0.01]}>
              <circleGeometry args={[0.03, 16]} />
              <meshBasicMaterial
                color={i === 0 ? color : "#7b7b7b"}
                transparent
                opacity={i === 0 ? 0.8 : 0.3}
              />
            </mesh>
          )
        )}

        {/* Fake chart bars */}
        {[0.15, 0.25, 0.4, 0.3, 0.35, 0.2, 0.45].map((h, i) => (
          <mesh key={`bar-${i}`} position={[-0.6 + i * 0.2, -0.55 + h / 2, 0.01]}>
            <planeGeometry args={[0.1, h]} />
            <meshBasicMaterial color={color} transparent opacity={0.2 + i * 0.05} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}
