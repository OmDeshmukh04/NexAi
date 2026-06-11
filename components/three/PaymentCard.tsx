"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

interface PaymentCardProps {
  scrollProgress: React.RefObject<{ value: number }>;
}

// Real credit card ratio: 85.6mm x 53.98mm
const CARD_W = 3.4;
const CARD_H = 2.14;
const CARD_R = 0.16;
const CARD_T = 0.05;

function roundedRectShape(w: number, h: number, r: number) {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

/** ShapeGeometry UVs live in shape-space; remap them to 0..1 so textures fit. */
function normalizeUVs(geometry: THREE.BufferGeometry) {
  geometry.computeBoundingBox();
  const bb = geometry.boundingBox!;
  const size = new THREE.Vector3().subVectors(bb.max, bb.min);
  const uv = geometry.attributes.uv as THREE.BufferAttribute;
  const pos = geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(
      i,
      (pos.getX(i) - bb.min.x) / size.x,
      (pos.getY(i) - bb.min.y) / size.y
    );
  }
  uv.needsUpdate = true;
  return geometry;
}

function drawContactless(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.PI / 4);
  ctx.strokeStyle = "rgba(234, 245, 208, 0.85)";
  ctx.lineCap = "round";
  for (let i = 0; i < 4; i++) {
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(0, 0, 12 + i * 16, -Math.PI / 4, Math.PI / 4);
    ctx.stroke();
  }
  ctx.restore();
}

function drawChip(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const w = 132;
  const h = 102;
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, "#e8d27a");
  grad.addColorStop(0.5, "#c9a648");
  grad.addColorStop(1, "#f0e2a0");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 16);
  ctx.fill();
  ctx.strokeStyle = "rgba(60, 45, 10, 0.45)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 16);
  ctx.stroke();
  // contact traces
  ctx.beginPath();
  ctx.moveTo(x, y + h / 3);
  ctx.lineTo(x + w, y + h / 3);
  ctx.moveTo(x, y + (2 * h) / 3);
  ctx.lineTo(x + w, y + (2 * h) / 3);
  ctx.moveTo(x + w / 2, y);
  ctx.lineTo(x + w / 2, y + h);
  ctx.stroke();
}

function embossedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string,
  spacing = 0
) {
  ctx.font = font;
  if (spacing) ctx.letterSpacing = `${spacing}px`;
  ctx.fillStyle = "rgba(0, 14, 14, 0.85)";
  ctx.fillText(text, x + 2.5, y + 3);
  ctx.fillStyle = "#dcead0";
  ctx.fillText(text, x, y);
  ctx.letterSpacing = "0px";
}

function createFrontTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 644;
  const ctx = canvas.getContext("2d")!;

  // Base: deep teal gradient
  const base = ctx.createLinearGradient(0, 0, 1024, 644);
  base.addColorStop(0, "#073f3c");
  base.addColorStop(0.55, "#02292b");
  base.addColorStop(1, "#0a4f44");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 1024, 644);

  // Holographic diagonal sweep
  const sweep = ctx.createLinearGradient(150, 644, 850, 0);
  sweep.addColorStop(0, "rgba(181, 212, 71, 0)");
  sweep.addColorStop(0.42, "rgba(181, 212, 71, 0.14)");
  sweep.addColorStop(0.5, "rgba(125, 226, 209, 0.26)");
  sweep.addColorStop(0.58, "rgba(181, 212, 71, 0.14)");
  sweep.addColorStop(1, "rgba(181, 212, 71, 0)");
  ctx.fillStyle = sweep;
  ctx.fillRect(0, 0, 1024, 644);

  // Flowing contour lines
  ctx.strokeStyle = "rgba(181, 212, 71, 0.09)";
  ctx.lineWidth = 1.5;
  for (let l = 0; l < 9; l++) {
    ctx.beginPath();
    for (let px = 0; px <= 1024; px += 8) {
      const py =
        430 +
        l * 26 +
        Math.sin(px * 0.006 + l * 0.7) * 38 +
        Math.cos(px * 0.0023 + l) * 22;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  // Wordmark
  ctx.textBaseline = "alphabetic";
  ctx.font = "600 60px Manrope, Inter, system-ui, sans-serif";
  ctx.fillStyle = "#f2f7e8";
  ctx.fillText("Nex", 64, 110);
  const nexW = ctx.measureText("Nex").width;
  ctx.fillStyle = "#b5d447";
  ctx.fillText("Pay", 64 + nexW, 110);

  drawContactless(ctx, 924, 88);
  drawChip(ctx, 64, 240);

  // Embossed PAN
  embossedText(
    ctx,
    "5417  2900  4128  9046",
    64,
    478,
    "500 58px 'Courier New', ui-monospace, monospace",
    4
  );

  // Footer row
  ctx.font = "500 20px Inter, system-ui, sans-serif";
  ctx.fillStyle = "rgba(220, 234, 208, 0.55)";
  ctx.fillText("MEMBER SINCE 24", 64, 540);
  ctx.fillText("VALID THRU 12/30", 300, 540);
  embossedText(ctx, "PRIYA SHARMA", 64, 590, "600 34px Inter, system-ui, sans-serif", 2);

  // Network mark: interlocked rings
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = "rgba(181, 212, 71, 0.85)";
  ctx.beginPath();
  ctx.arc(880, 560, 42, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(15, 118, 110, 0.85)";
  ctx.beginPath();
  ctx.arc(936, 560, 42, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function createBackTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 644;
  const ctx = canvas.getContext("2d")!;

  const base = ctx.createLinearGradient(1024, 0, 0, 644);
  base.addColorStop(0, "#073f3c");
  base.addColorStop(0.55, "#02292b");
  base.addColorStop(1, "#0a4f44");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 1024, 644);

  // Magnetic stripe
  ctx.fillStyle = "#0b1413";
  ctx.fillRect(0, 70, 1024, 110);

  // Signature panel + CVV
  ctx.fillStyle = "#e7ece2";
  ctx.beginPath();
  ctx.roundRect(64, 250, 640, 80, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(5, 64, 64, 0.25)";
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(64, 270 + i * 18);
    ctx.lineTo(704, 270 + i * 18);
    ctx.stroke();
  }
  ctx.fillStyle = "#02292b";
  ctx.font = "600 36px 'Courier New', ui-monospace, monospace";
  ctx.fillText("982", 740, 305);

  ctx.font = "400 22px Inter, system-ui, sans-serif";
  ctx.fillStyle = "rgba(220, 234, 208, 0.6)";
  ctx.fillText("Issued by NexPay Financial — nexpay.io/help", 64, 560);

  ctx.font = "600 44px Manrope, Inter, system-ui, sans-serif";
  ctx.fillStyle = "rgba(242, 247, 232, 0.9)";
  ctx.fillText("NexPay", 800, 565);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export default function PaymentCard({ scrollProgress }: PaymentCardProps) {
  const groupRef = useRef<THREE.Group>(null!);

  const { bodyGeometry, faceGeometry, frontTexture, backTexture } = useMemo(() => {
    const shape = roundedRectShape(CARD_W, CARD_H, CARD_R);
    const body = new THREE.ExtrudeGeometry(shape, {
      depth: CARD_T,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 3,
      curveSegments: 24,
    });
    body.translate(0, 0, -CARD_T / 2);

    const face = normalizeUVs(
      new THREE.ShapeGeometry(roundedRectShape(CARD_W - 0.04, CARD_H - 0.04, CARD_R), 24)
    );

    return {
      bodyGeometry: body,
      faceGeometry: face,
      frontTexture: createFrontTexture(),
      backTexture: createBackTexture(),
    };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const sp = scrollProgress.current?.value ?? 0;

    // Idle presentation spin + full flip driven by scroll
    groupRef.current.rotation.y =
      Math.sin(t * 0.4) * 0.28 + sp * Math.PI * 1.5;
    groupRef.current.rotation.x = -0.12 + Math.sin(t * 0.3) * 0.06 + sp * 0.4;
    groupRef.current.rotation.z = -0.08;
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.08 - sp * 1.2;
    groupRef.current.position.z = sp * 1.5;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={groupRef}>
        {/* Card body — iridescent metal edge */}
        <mesh geometry={bodyGeometry}>
          <meshPhysicalMaterial
            color="#04403a"
            metalness={0.9}
            roughness={0.32}
            clearcoat={1}
            clearcoatRoughness={0.18}
            iridescence={0.7}
            iridescenceIOR={1.4}
            iridescenceThicknessRange={[120, 480]}
          />
        </mesh>

        {/* Front face */}
        <mesh geometry={faceGeometry} position={[0, 0, CARD_T / 2 + 0.012]}>
          <meshPhysicalMaterial
            map={frontTexture}
            metalness={0.55}
            roughness={0.38}
            clearcoat={0.9}
            clearcoatRoughness={0.25}
          />
        </mesh>

        {/* Back face */}
        <mesh
          geometry={faceGeometry}
          position={[0, 0, -CARD_T / 2 - 0.012]}
          rotation={[0, Math.PI, 0]}
        >
          <meshPhysicalMaterial
            map={backTexture}
            metalness={0.55}
            roughness={0.38}
            clearcoat={0.9}
            clearcoatRoughness={0.25}
          />
        </mesh>

      </group>
    </Float>
  );
}
