"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "@/lib/prng";

const GLOBE_RADIUS = 2;

function latLonToVec3(lat: number, lon: number, radius: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Financial hubs the transaction arcs travel between
const HUBS: [number, number][] = [
  [40.7, -74.0],   // New York
  [51.5, -0.1],    // London
  [19.1, 72.9],    // Mumbai
  [1.35, 103.8],   // Singapore
  [35.7, 139.7],   // Tokyo
  [-23.5, -46.6],  // São Paulo
  [25.2, 55.3],    // Dubai
  [52.5, 13.4],    // Berlin
  [-33.9, 151.2],  // Sydney
  [37.6, -122.4],  // San Francisco
];

const ARC_PAIRS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 9], [5, 0], [6, 2], [1, 7], [3, 8], [9, 4],
];

function GlobeDots() {
  const { positions, colors } = useMemo(() => {
    const count = 1100;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const deep = new THREE.Color("#054040");
    const lime = new THREE.Color("#6f8f1f");
    const rand = mulberry32(91736);
    // Fibonacci sphere distribution
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      pos[i * 3] = Math.cos(theta) * r * GLOBE_RADIUS;
      pos[i * 3 + 1] = y * GLOBE_RADIUS;
      pos[i * 3 + 2] = Math.sin(theta) * r * GLOBE_RADIUS;
      const c = rand() > 0.85 ? lime : deep;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function TransactionArc({
  from,
  to,
  index,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  index: number;
}) {
  const pulseRef = useRef<THREE.Mesh>(null!);

  const { curve, line } = useMemo(() => {
    const mid = from
      .clone()
      .add(to)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(GLOBE_RADIUS * (1.25 + from.distanceTo(to) * 0.12));
    const c = new THREE.QuadraticBezierCurve3(from, mid, to);
    const geo = new THREE.BufferGeometry().setFromPoints(c.getPoints(48));
    const mat = new THREE.LineBasicMaterial({
      color: "#6f8f1f",
      transparent: true,
      opacity: 0.35,
    });
    return { curve: c, line: new THREE.Line(geo, mat) };
  }, [from, to]);

  useFrame((state) => {
    if (!pulseRef.current) return;
    const t = (state.clock.getElapsedTime() * 0.25 + index * 0.37) % 1;
    const p = curve.getPoint(t);
    pulseRef.current.position.copy(p);
    // Pulse fades in and out at the endpoints
    const fade = Math.sin(t * Math.PI);
    pulseRef.current.scale.setScalar(0.5 + fade * 0.8);
    (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = fade;
  });

  return (
    <group>
      <primitive object={line} />
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color="#b5d447" transparent />
      </mesh>
    </group>
  );
}

function GlobeScene() {
  const globeRef = useRef<THREE.Group>(null!);

  const hubPositions = useMemo(
    () => HUBS.map(([lat, lon]) => latLonToVec3(lat, lon, GLOBE_RADIUS)),
    []
  );

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.08;
    }
    void state;
  });

  return (
    <group rotation={[0.35, 0, -0.1]}>
      <group ref={globeRef}>
        {/* Core sphere — faint fill so dots read as a solid globe */}
        <mesh>
          <sphereGeometry args={[GLOBE_RADIUS * 0.985, 48, 48]} />
          <meshBasicMaterial color="#f2f4f0" transparent opacity={0.85} />
        </mesh>

        <GlobeDots />

        {/* Hub markers */}
        {hubPositions.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshBasicMaterial color="#b5d447" />
          </mesh>
        ))}

        {ARC_PAIRS.map(([a, b], i) => (
          <TransactionArc
            key={i}
            from={hubPositions[a]}
            to={hubPositions[b]}
            index={i}
          />
        ))}
      </group>
    </group>
  );
}

export default function PaymentsGlobe() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.6], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.8} />
        <GlobeScene />
      </Suspense>
    </Canvas>
  );
}
