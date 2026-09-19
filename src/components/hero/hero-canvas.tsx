'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural Yarn Ball Core
function YarnBall() {
  const meshRef = useRef<THREE.Mesh>(null);
  const threadRef = useRef<THREE.LineSegments>(null);

  // Generate winding yarn thread coordinates
  const threadGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const numLoops = 280;
    const radius = 1.35;

    for (let i = 0; i < numLoops; i++) {
      const phi = Math.acos(-1 + (2 * i) / numLoops);
      const theta = Math.sqrt(numLoops * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      points.push(new THREE.Vector3(x, y, z));
      if (i > 0) {
        // Line segment between consecutive points
        points.push(new THREE.Vector3(x, y, z));
      }
    }
    // Remove last duplicate if odd
    if (points.length % 2 !== 0) {
      points.pop();
    }

    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x += delta * 0.05;
    }
    if (threadRef.current) {
      threadRef.current.rotation.y += delta * 0.15;
      threadRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Inner tactile yarn core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshStandardMaterial
          color="#DFA7AD" // Dusty Rose brand token
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Looping winding thread strands */}
      <lineSegments ref={threadRef} geometry={threadGeometry}>
        <lineBasicMaterial color="#FFF8F1" linewidth={1.5} transparent opacity={0.65} />
      </lineSegments>
    </group>
  );
}

// Crochet Flower Petals Framing
function CrochetFlower({ position, scale = 1, rotationSpeed = 0.2, color = '#F1C6C0' }: {
  position: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
  color?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * rotationSpeed;
    }
  });

  const petals = useMemo(() => {
    return [0, 1, 2, 3, 4].map((i) => {
      const angle = (i * Math.PI * 2) / 5;
      const px = Math.cos(angle) * 0.55;
      const py = Math.sin(angle) * 0.55;
      return { angle, px, py };
    });
  }, []);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Flower Center Disc */}
      <mesh position={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.25, 0.25, 0.1, 16]} />
        <meshStandardMaterial color="#CDA567" roughness={0.7} />
      </mesh>
      {/* 5 Petals */}
      {petals.map((p, idx) => (
        <mesh key={idx} position={[p.px, p.py, 0]} rotation={[0, 0, p.angle]}>
          <boxGeometry args={[0.55, 0.35, 0.08]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// Floating Soft Yarn Ornaments / Particles
function FloatingOrnaments() {
  const count = 35;
  const particles = useMemo(() => {
    const temp: { position: [number, number, number]; scale: number; speed: number; color: string }[] = [];
    const colors = ['#FFF8F1', '#F1C6C0', '#DFA7AD', '#C9B7E8', '#B8D1BF'];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 8;
      const y = (Math.random() - 0.5) * 6;
      const z = (Math.random() - 0.5) * 4 - 1;
      const scale = 0.06 + Math.random() * 0.08;
      const speed = 0.2 + Math.random() * 0.4;
      const color = colors[Math.floor(Math.random() * colors.length)];
      temp.push({ position: [x, y, z], scale, speed, color });
    }
    return temp;
  }, []);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.children.forEach((child, index) => {
        const p = particles[index];
        child.position.y += Math.sin(time * p.speed + index) * 0.003;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, idx) => (
        <mesh key={idx} position={p.position} scale={p.scale}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color={p.color} roughness={0.9} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// Camera Rig with Subtle Pointer Parallax
function CameraRig() {
  useFrame((state) => {
    // Subtle pointer parallax (clamped to ±0.3 rads)
    const targetX = (state.pointer.x * 0.4);
    const targetY = (state.pointer.y * 0.3);

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

export function HeroCanvasInner() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 42 }}
      dpr={[1, 1.75]} // DPR capped per webgl-performance guidelines
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 5, 4]} intensity={1.5} color="#FFF8F1" />
      <directionalLight position={[-4, -2, -2]} intensity={0.6} color="#C9B7E8" />
      <pointLight position={[0, 2, 2]} intensity={0.8} color="#FFF8F1" />

      <YarnBall />
      <CrochetFlower position={[-2.2, 1.2, -0.5]} scale={0.9} rotationSpeed={0.15} color="#F1C6C0" />
      <CrochetFlower position={[2.1, -1.1, -0.3]} scale={0.8} rotationSpeed={-0.12} color="#C9B7E8" />
      <FloatingOrnaments />
      <CameraRig />
    </Canvas>
  );
}
