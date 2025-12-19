
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useStore } from '../store';
import { AppPhase } from '../types';

const PARTICLE_COUNT = 6000;

// Aliasing for clarity and type safety in R3F
const Group = 'group' as any;
const InstancedMesh = 'instancedMesh' as any;
const Mesh = 'mesh' as any;
const SphereGeometry = 'sphereGeometry' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const PointLight = 'pointLight' as any;

const Flame: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const lightRef = useRef<THREE.PointLight>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const flicker = Math.sin(t * 15) * 0.2 + Math.cos(t * 22) * 0.1 + 1;
    if (lightRef.current) lightRef.current.intensity = 2 * flicker;
    if (coreRef.current) {
      coreRef.current.scale.setScalar(0.8 + Math.sin(t * 20) * 0.1);
      coreRef.current.position.y = position[1] + Math.sin(t * 10) * 0.02;
    }
  });

  return (
    <Group position={position}>
      <Mesh ref={coreRef}>
        <SphereGeometry args={[0.12, 16, 16]} />
        <MeshStandardMaterial 
          color="#ffaa00" 
          emissive="#ff4400" 
          emissiveIntensity={10} 
          toneMapped={false}
        />
      </Mesh>
      <PointLight ref={lightRef} color="#ff6600" distance={3} intensity={2} />
      <Sparkles count={10} scale={0.5} size={1} speed={0.5} color="#ffcc00" />
    </Group>
  );
};

const DigitCandle: React.FC<{ digit: string, position: [number, number, number] }> = ({ digit, position }) => {
  return (
    <Group position={position}>
      {/* Digit Text as Candle */}
      <Text
        fontSize={1.4}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.woff"
        color="#F7E7CE"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#FFD700"
      >
        {digit}
        <MeshStandardMaterial 
          emissive="#F7E7CE" 
          emissiveIntensity={2} 
          toneMapped={false} 
        />
      </Text>
      {/* Small base for the flame */}
      <Mesh position={[0, 0.75, 0]}>
        <SphereGeometry args={[0.02, 8, 8]} />
        <MeshStandardMaterial color="#FFD700" />
      </Mesh>
      <Flame position={[0, 0.9, 0]} />
    </Group>
  );
};

const CakeParticles: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const phase = useStore((state) => state.phase);
  const setPhase = useStore((state) => state.setPhase);

  const particles = useMemo(() => {
    const temp = [];
    const colorRose = new THREE.Color("#FFB7C5"); // Rose Pink
    const colorChampagne = new THREE.Color("#F7E7CE"); // Champagne Gold

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isBottom = i < PARTICLE_COUNT * 0.6;
      let height, maxRadius, angle;
      angle = Math.random() * Math.PI * 2;
      
      if (isBottom) {
        height = Math.random() * 2.2;
        const t = height / 2.2;
        maxRadius = 4.2 * (1 - t) + 3.8 * t;
      } else {
        height = 2.2 + Math.random() * 1.6;
        const t = (height - 2.2) / 1.6;
        maxRadius = 2.8 * (1 - t) + 2.4 * t;
      }
      
      const r = Math.sqrt(Math.random()) * maxRadius;
      const cakePos = new THREE.Vector3(
        Math.cos(angle) * r,
        height - 2,
        Math.sin(angle) * r
      );

      const bloomPos = new THREE.Vector3().copy(cakePos).multiplyScalar(15 + Math.random() * 25);
      
      temp.push({
        cake: cakePos,
        bloom: bloomPos,
        current: new THREE.Vector3().copy(cakePos),
        color: isBottom ? colorRose.clone().lerp(new THREE.Color("#ffffff"), Math.random() * 0.2) : colorChampagne.clone(),
        size: Math.random() * 0.05 + 0.03
      });
    }
    return temp;
  }, []);

  const dummy = new THREE.Object3D();
  const mouse = new THREE.Vector2();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (phase === AppPhase.BLOOMING) {
      particles.forEach((p, i) => {
        gsap.to(p.current, {
          x: p.bloom.x,
          y: p.bloom.y,
          z: p.bloom.z,
          duration: 2.5,
          ease: "expo.out",
          delay: i * 0.0001,
          onComplete: () => {
            if (i === 0) setPhase(AppPhase.NEBULA);
          }
        });
      });
    } else if (phase === AppPhase.COLLAPSING) {
      particles.forEach((p, i) => {
        gsap.to(p.current, {
          x: p.cake.x,
          y: p.cake.y,
          z: p.cake.z,
          duration: 2,
          ease: "elastic.out(1, 0.5)",
          delay: i * 0.0001,
          onComplete: () => {
            if (i === 0) setPhase(AppPhase.CAKE);
          }
        });
      });
    }
  }, [phase, particles, setPhase]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];
      
      if (phase === AppPhase.CAKE) {
        const dist = p.current.distanceTo(new THREE.Vector3(mouse.x * 6, mouse.y * 6, 0));
        if (dist < 2.5) {
          const dir = p.current.clone().sub(new THREE.Vector3(mouse.x * 6, mouse.y * 6, 0)).normalize();
          p.current.add(dir.multiplyScalar(0.08));
        }
        p.current.lerp(p.cake, 0.06);
      }

      dummy.position.copy(p.current);
      if (phase === AppPhase.CAKE) {
        dummy.position.y += Math.sin(time * 1.5 + i * 0.1) * 0.03;
      }
      
      dummy.scale.setScalar(p.size);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, p.color);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  const shouldShowCake = phase === AppPhase.CAKE || phase === AppPhase.BLOOMING || phase === AppPhase.COLLAPSING;

  return (
    <Group>
      {shouldShowCake && (
        <>
          <InstancedMesh 
            ref={meshRef} 
            args={[new THREE.SphereGeometry(1, 6, 6), new THREE.MeshStandardMaterial({ 
              emissive: "#ffffff", 
              emissiveIntensity: 0.2,
              metalness: 0.5,
              roughness: 0.2
            }), PARTICLE_COUNT]} 
            castShadow
            onClick={() => phase === AppPhase.CAKE && setPhase(AppPhase.BLOOMING)}
          />
          
          {phase === AppPhase.CAKE && (
            <Group position={[0, 1.8, 0]}>
              <DigitCandle digit="2" position={[-0.6, 0.5, 0]} />
              <DigitCandle digit="4" position={[0.6, 0.5, 0]} />
            </Group>
          )}
        </>
      )}
    </Group>
  );
};

export default CakeParticles;
