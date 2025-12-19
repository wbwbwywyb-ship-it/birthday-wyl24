
import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, Sparkles, Environment, OrbitControls } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { useStore } from './store';
import { AppPhase } from './types';
import CakeParticles from './components/CakeParticles';
import PhotoNebula from './components/PhotoNebula';
import UI from './components/UI';
import HandTracker from './components/HandTracker';

// Aliasing Three.js intrinsic elements to bypass JSX type errors
const Color = 'color' as any;
const AmbientLight = 'ambientLight' as any;
const PointLight = 'pointLight' as any;
const SpotLight = 'spotLight' as any;

const SceneSync = () => {
  const setIsReady = useStore((state) => state.setIsReady);
  useEffect(() => {
    setIsReady(true);
  }, [setIsReady]);
  return null;
};

const App: React.FC = () => {
  const phase = useStore((state) => state.phase);
  const setPhase = useStore((state) => state.setPhase);
  const focusedPhotoId = useStore((state) => state.focusedPhotoId);

  // Global Fallback Interaction Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && phase === AppPhase.NEBULA) {
        setPhase(AppPhase.COLLAPSING);
      }
    };
    
    const handleDoubleClick = () => {
      if (phase === AppPhase.NEBULA) {
        setPhase(AppPhase.COLLAPSING);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('dblclick', handleDoubleClick);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [phase, setPhase]);

  return (
    <div className="w-full h-screen bg-[#050103] relative overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 5, 15], fov: 45 }}
        gl={{ antialias: false }}
      >
        <Color attach="background" args={['#050103']} />
        
        <Suspense fallback={null}>
          <SceneSync />
          <Environment preset="city" />
          
          <AmbientLight intensity={0.2} />
          <PointLight position={[10, 10, 10]} intensity={2} color="#ffaa55" />
          <PointLight position={[-10, 5, -10]} intensity={1} color="#55aaff" />
          <SpotLight
            position={[0, 15, 0]}
            angle={0.3}
            penumbra={1}
            intensity={2}
            castShadow
          />

          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Sparkles count={100} scale={20} size={2} speed={0.4} opacity={0.5} />

          <CakeParticles />
          <PhotoNebula />

          <OrbitControls 
            makeDefault 
            enablePan={false}
            enableDamping={true}
            maxDistance={30}
            minDistance={5}
            enabled={!focusedPhotoId}
          />
        </Suspense>

        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={1} 
            mipmapBlur 
            intensity={1.5} 
            radius={0.4} 
          />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>

      <UI />
      <HandTracker />
    </div>
  );
};

export default App;
