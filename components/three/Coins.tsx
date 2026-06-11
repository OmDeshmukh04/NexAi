"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CoinsProps {
  scrollProgress: React.RefObject<{ value: number }>;
}

// Tight orbits hugging the card: kept clear of the headline on the left
// and never swinging toward the camera (small, negative-biased z range)
const COINS = [
  { radius: 2.7, speed: 0.22, phase: 0.0, y: 1.5, scale: 0.7, tilt: 0.5 },
  { radius: 3.3, speed: -0.16, phase: 2.1, y: -1.2, scale: 0.55, tilt: -0.4 },
  { radius: 2.4, speed: 0.28, phase: 4.0, y: -1.7, scale: 0.45, tilt: 0.7 },
  { radius: 3.6, speed: 0.12, phase: 1.2, y: 1.9, scale: 0.6, tilt: -0.6 },
  { radius: 3.0, speed: -0.2, phase: 5.3, y: 0.5, scale: 0.4, tilt: 0.3 },
];

function createCoinFaceTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
  grad.addColorStop(0, "#d7e88f");
  grad.addColorStop(0.7, "#b5d447");
  grad.addColorStop(1, "#8aa62e");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Inner ring
  ctx.strokeStyle = "rgba(5, 64, 64, 0.55)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(128, 128, 100, 0, Math.PI * 2);
  ctx.stroke();

  // Ridges
  ctx.lineWidth = 3;
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(128 + Math.cos(a) * 112, 128 + Math.sin(a) * 112);
    ctx.lineTo(128 + Math.cos(a) * 124, 128 + Math.sin(a) * 124);
    ctx.stroke();
  }

  // "N" monogram
  ctx.fillStyle = "#054040";
  ctx.font = "700 130px Manrope, Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("N", 128, 138);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export default function Coins({ scrollProgress }: CoinsProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const coinRefs = useRef<(THREE.Group | null)[]>([]);

  const { geometry, faceMaterial, edgeMaterial } = useMemo(() => {
    const faceTexture = createCoinFaceTexture();
    return {
      geometry: new THREE.CylinderGeometry(0.32, 0.32, 0.07, 48),
      faceMaterial: new THREE.MeshPhysicalMaterial({
        map: faceTexture,
        metalness: 0.85,
        roughness: 0.3,
        clearcoat: 0.8,
        clearcoatRoughness: 0.25,
      }),
      edgeMaterial: new THREE.MeshPhysicalMaterial({
        color: "#9bb83a",
        metalness: 0.9,
        roughness: 0.35,
      }),
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const sp = scrollProgress.current?.value ?? 0;

    if (groupRef.current) {
      // Coins scatter outward and fade back as the user scrolls
      groupRef.current.position.z = -sp * 4;
      groupRef.current.rotation.y = sp * 0.6;
    }

    COINS.forEach((coin, i) => {
      const ref = coinRefs.current[i];
      if (!ref) return;
      const angle = t * coin.speed + coin.phase;
      const spread = 1 + sp * 1.6;
      ref.position.set(
        Math.cos(angle) * coin.radius * spread + 0.6,
        coin.y + Math.sin(t * 0.7 + coin.phase) * 0.25,
        Math.sin(angle) * 0.8 - 0.6
      );
      ref.rotation.x = Math.PI / 2 + coin.tilt;
      ref.rotation.z = t * (0.4 + i * 0.08);
    });
  });

  return (
    <group ref={groupRef}>
      {COINS.map((coin, i) => (
        <group
          key={i}
          ref={(el) => {
            coinRefs.current[i] = el;
          }}
          scale={coin.scale}
        >
          {/* cylinder material order: [side, top, bottom] */}
          <mesh
            geometry={geometry}
            material={[edgeMaterial, faceMaterial, faceMaterial]}
          />
        </group>
      ))}
    </group>
  );
}
