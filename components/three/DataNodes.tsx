"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface DataNodesProps {
  scrollProgress: React.RefObject<{ value: number }>;
}

export default function DataNodes({ scrollProgress }: DataNodesProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const nodesRef = useRef<THREE.InstancedMesh>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);

  const { nodePositions, linePositions, nodeCount } = useMemo(() => {
    const count = 24;
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 2;
      positions.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        )
      );
    }

    // Connect nearby nodes
    const lines: number[] = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (positions[i].distanceTo(positions[j]) < 2.5) {
          lines.push(
            positions[i].x, positions[i].y, positions[i].z,
            positions[j].x, positions[j].y, positions[j].z
          );
        }
      }
    }

    return {
      nodePositions: positions,
      linePositions: new Float32Array(lines),
      nodeCount: count,
    };
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const sp = scrollProgress.current?.value ?? 0;

    groupRef.current.rotation.y = t * 0.05 + sp * 0.5;
    groupRef.current.rotation.x = Math.sin(t * 0.03) * 0.1;

    // Pulse nodes
    if (nodesRef.current) {
      for (let i = 0; i < nodeCount; i++) {
        const p = nodePositions[i];
        const scale = 0.03 + Math.sin(t * 2 + i * 0.5) * 0.015;
        dummy.position.copy(p);
        dummy.scale.setScalar(scale * (20 + sp * 5));
        dummy.updateMatrix();
        nodesRef.current.setMatrixAt(i, dummy.matrix);
      }
      nodesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -3]}>
      {/* Nodes */}
      <instancedMesh ref={nodesRef} args={[undefined, undefined, nodeCount]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial color="#6f8f1f" transparent opacity={0.8} />
      </instancedMesh>

      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#054040" transparent opacity={0.15} />
      </lineSegments>
    </group>
  );
}
