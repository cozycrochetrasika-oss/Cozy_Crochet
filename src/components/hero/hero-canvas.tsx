'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural Pearl-White Yarn Ball with Powder-Blue Thread Strands
function YarnBall() {
  const meshRef = useRef<THREE.Mesh>(null);
  const threadRef = useRef<THREE.LineSegments>(null);
  const accentThreadRef = useRef<THREE.LineSegments>(null);

  // Primary winding thread coordinates
  const threadGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const numLoops = 300;
    const radius = 1.34;

    for (let i = 0; i < numLoops; i++) {
      const phi = Math.acos(-1 + (2 * i) / numLoops);
      const theta = Math.sqrt(numLoops * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      points.push(new THREE.Vector3(x, y, z));
      if (i > 0) {
        points.push(new THREE.Vector3(x, y, z));
      }
    }
    if (points.length % 2 !== 0) points.pop();
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  // Secondary subtle accent thread (soft sky blue)
  const accentThreadGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const numLoops = 140;
    const radius = 1.36;

    for (let i = 0; i < numLoops; i++) {
      const phi = Math.acos(-1 + (2 * i) / numLoops);
      const theta = Math.sqrt(numLoops * Math.PI * 1.5) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      points.push(new THREE.Vector3(x, y, z));
      if (i > 0) points.push(new THREE.Vector3(x, y, z));
    }
    if (points.length % 2 !== 0) points.pop();
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
      meshRef.current.rotation.x += delta * 0.03;
    }
    if (threadRef.current) {
      threadRef.current.rotation.y += delta * 0.08;
      threadRef.current.rotation.x += delta * 0.03;
    }
    if (accentThreadRef.current) {
      accentThreadRef.current.rotation.y -= delta * 0.05;
      accentThreadRef.current.rotation.z += delta * 0.02;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Tactile Pearl-White Yarn Core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.3, 36, 36]} />
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.92}
          metalness={0.02}
        />
      </mesh>

      {/* Primary Powder-Blue Thread Strands */}
      <lineSegments ref={threadRef} geometry={threadGeometry}>
        <lineBasicMaterial color="#CEEAFE" linewidth={1.5} transparent opacity={0.85} />
      </lineSegments>

      {/* Delicate Sky-Blue Accent Thread */}
      <lineSegments ref={accentThreadRef} geometry={accentThreadGeometry}>
        <lineBasicMaterial color="#7BC9EE" linewidth={1} transparent opacity={0.6} />
      </lineSegments>
    </group>
  );
}

// Pastel-Blue & Soft Accent Crochet Flower
function CrochetFlower({
  position,
  scale = 1,
  rotationSpeed = 0.12,
  petalColor = '#A9DDF8',
  centerColor = '#D8B875',
}: {
  position: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
  petalColor?: string;
  centerColor?: string;
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
      {/* Flower Center Disc (Tiny Warm Gold Accent) */}
      <mesh position={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.22, 0.22, 0.08, 16]} />
        <meshStandardMaterial color={centerColor} roughness={0.65} />
      </mesh>
      {/* 5 Petals */}
      {petals.map((p, idx) => (
        <mesh key={idx} position={[p.px, p.py, 0]} rotation={[0, 0, p.angle]}>
          <boxGeometry args={[0.55, 0.35, 0.07]} />
          <meshStandardMaterial color={petalColor} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

// Translucent Floating Glass / Soap Bubbles
function TranslucentBubbles() {
  const bubbles = useMemo(() => [
    { position: [-1.4, -1.3, 0.8] as [number, number, number], scale: 0.38, speed: 0.6 },
    { position: [1.8, 1.4, 0.5] as [number, number, number], scale: 0.44, speed: 0.5 },
    { position: [2.2, -0.4, 1.1] as [number, number, number], scale: 0.28, speed: 0.8 },
    { position: [-2.0, 0.5, 0.3] as [number, number, number], scale: 0.32, speed: 0.7 },
  ], []);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.children.forEach((child, i) => {
        child.position.y += Math.sin(time * bubbles[i].speed + i) * 0.0015;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {bubbles.map((b, idx) => (
        <mesh key={idx} position={b.position} scale={b.scale}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial
            color="#E5F4FF"
            roughness={0.1}
            metalness={0.05}
            transparent
            opacity={0.42}
          />
        </mesh>
      ))}
    </group>
  );
}

// Drifting Pastel Yarn Motes
function FloatingOrnaments() {
  const count = 38;
  const particles = useMemo(() => {
    const temp: { position: [number, number, number]; scale: number; speed: number; color: string }[] = [];
    const colors = ['#FFFFFF', '#E5F4FF', '#CEEAFE', '#A9DDF8', '#DCCFF4', '#F5D5DC', '#D9F0E5'];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 8.5;
      const y = (Math.random() - 0.5) * 6.5;
      const z = (Math.random() - 0.5) * 4 - 0.5;
      const scale = 0.05 + Math.random() * 0.07;
      const speed = 0.15 + Math.random() * 0.3;
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
        child.position.y += Math.sin(time * p.speed + index) * 0.002;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, idx) => (
        <mesh key={idx} position={p.position} scale={p.scale}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color={p.color} roughness={0.9} transparent opacity={0.65} />
        </mesh>
      ))}
    </group>
  );
}

// Camera Rig with Subtle Parallax
function CameraRig() {
  useFrame((state) => {
    const targetX = state.pointer.x * 0.28;
    const targetY = state.pointer.y * 0.22;

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.04);
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
      <ambientLight intensity={1.2} />
      <directionalLight position={[4, 5, 4]} intensity={1.4} color="#FFFFFF" />
      <directionalLight position={[-4, -2, -2]} intensity={0.7} color="#CEEAFE" />
      <pointLight position={[0, 2, 2.5]} intensity={0.9} color="#E5F4FF" />

      {/* Depth Layering: Foreground, Main, Midground, Background */}
      <YarnBall />
      <CrochetFlower position={[-2.2, 1.2, -0.4]} scale={0.9} rotationSpeed={0.08} petalColor="#A9DDF8" centerColor="#D8B875" />
      <CrochetFlower position={[2.2, -1.0, -0.3]} scale={0.82} rotationSpeed={-0.07} petalColor="#CEEAFE" centerColor="#DCCFF4" />
      <CrochetFlower position={[-1.6, -1.5, -0.6]} scale={0.65} rotationSpeed={0.06} petalColor="#D9F0E5" centerColor="#F5D5DC" />
      <TranslucentBubbles />
      <FloatingOrnaments />
      <CameraRig />
    </Canvas>
  );
}
