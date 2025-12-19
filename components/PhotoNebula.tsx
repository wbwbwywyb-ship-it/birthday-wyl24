
import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Image, Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useStore } from '../store';
import { AppPhase } from '../types';

// Aliasing Three.js intrinsic elements to bypass JSX type errors
const Group = 'group' as any;

const PhotoNebula: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const phase = useStore((state) => state.phase);
  const photos = useStore((state) => state.photos);
  const focusedPhotoId = useStore((state) => state.focusedPhotoId);
  const setFocusedPhotoId = useStore((state) => state.setFocusedPhotoId);
  const { camera } = useThree();

  const radius = 12;

  useFrame((state) => {
    if (phase === AppPhase.NEBULA && groupRef.current && !focusedPhotoId) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  const handlePhotoClick = (id: string, position: THREE.Vector3) => {
    if (focusedPhotoId === id) {
      setFocusedPhotoId(null);
      gsap.to(camera.position, { x: 0, y: 5, z: 15, duration: 1.5, ease: "power3.inOut" });
    } else {
      setFocusedPhotoId(id);
      const targetPos = position.clone().normalize().multiplyScalar(radius - 4);
      gsap.to(camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 1.5,
        ease: "power3.inOut",
        onUpdate: () => camera.lookAt(position)
      });
    }
  };

  if (phase !== AppPhase.NEBULA && phase !== AppPhase.BLOOMING) return null;

  return (
    <Group ref={groupRef} scale={phase === AppPhase.BLOOMING ? 0.1 : 1}>
      {photos.length === 0 ? (
         <Text
           position={[0, 0, 0]}
           fontSize={0.5}
           color="white"
           anchorX="center"
           anchorY="middle"
         >
           Upload photos to build the nebula...
         </Text>
      ) : (
        photos.map((photo, i) => {
          const angle = (i / photos.length) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = (Math.sin(i * 0.5) * 2);
          const position = new THREE.Vector3(x, y, z);

          return (
            <Group key={photo.id} position={position} rotation={[0, -angle + Math.PI / 2, 0]}>
              <Image
                url={photo.url}
                scale={[3, 4]}
                transparent
                opacity={focusedPhotoId && focusedPhotoId !== photo.id ? 0.2 : 1}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePhotoClick(photo.id, position);
                }}
              />
            </Group>
          );
        })
      )}
    </Group>
  );
};

export default PhotoNebula;
