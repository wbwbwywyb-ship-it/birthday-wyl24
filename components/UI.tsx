
import React from 'react';
import { useStore } from '../store';
import { AppPhase } from '../types';

const UI: React.FC = () => {
  const phase = useStore((state) => state.phase);
  const setPhase = useStore((state) => state.setPhase);
  const gesture = useStore((state) => state.gesture);
  const addPhotos = useStore((state) => state.addPhotos);
  const photos = useStore((state) => state.photos);
  const isReady = useStore((state) => state.isReady);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos: Promise<any>[] = Array.from(files).map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target?.result as string;
          img.onload = () => {
            resolve({
              id: Math.random().toString(36).substr(2, 9),
              url: img.src,
              aspectRatio: img.width / img.height
            });
          };
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newPhotos).then((results) => addPhotos(results));
  };

  const showHeader = isReady && phase === AppPhase.CAKE;

  return (
    <div className={`absolute inset-0 pointer-events-none flex flex-col justify-between p-8 transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
      {/* Top Left: Status */}
      <div className="flex flex-col gap-2">
        <div className="px-4 py-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-lg self-start">
          <p className="text-white/60 text-[10px] uppercase tracking-widest mb-1">Current State</p>
          <p className="text-white font-light text-sm capitalize">{phase}</p>
        </div>
        
        {gesture !== 'None' && (
          <div className="px-4 py-2 bg-pink-500/20 border border-pink-500/40 backdrop-blur-md rounded-lg self-start animate-pulse">
            <p className="text-pink-300 text-[10px] uppercase tracking-widest mb-1">Gesture Detected</p>
            <p className="text-white font-bold text-sm">{gesture.replace('_', ' ')}</p>
          </div>
        )}
      </div>

      {/* Center: Title - Opacity 0.7 and Year corrected to 2025 */}
      <div className={`text-center transition-all duration-1000 transform ${showHeader ? 'translate-y-0 opacity-70' : '-translate-y-10 opacity-0'} max-w-5xl mx-auto`}>
        <h1 className="text-[#FFD700] text-6xl md:text-8xl lg:text-9xl font-cursive drop-shadow-[0_0_20px_rgba(255,215,0,0.6)] leading-[1.8]">
          Happy Birthday,<br />
          <span className="whitespace-nowrap">温咏琳</span>
        </h1>
        <p className="text-white/40 tracking-[0.6em] mt-8 font-light text-xs md:text-sm uppercase">
          24th Anniversary • 2025
        </p>
      </div>

      {/* Bottom: Controls */}
      <div className="flex justify-between items-end pointer-events-auto">
        <div className="flex gap-4">
          {/* Debug button only if needed, otherwise rely on gesture/click */}
          {phase === AppPhase.CAKE && (
            <button 
              onClick={() => setPhase(AppPhase.BLOOMING)}
              className="px-8 py-3 bg-white/10 border border-white/20 text-white rounded-full font-medium text-xs hover:bg-white/20 transition-all active:scale-95 backdrop-blur-md"
            >
              Start Celebration
            </button>
          )}
          {phase === AppPhase.NEBULA && (
            <button 
              onClick={() => setPhase(AppPhase.COLLAPSING)}
              className="px-8 py-3 bg-pink-600/30 border border-pink-500/40 text-white rounded-full font-semibold text-sm hover:bg-pink-500/50 transition-all active:scale-95 shadow-lg shadow-pink-500/20 backdrop-blur-md"
            >
              Back to Cake
            </button>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <label className="group flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full cursor-pointer transition-all backdrop-blur-md shadow-xl">
            <span className="text-white text-xs font-light tracking-wide uppercase">Add Memories ({photos.length})</span>
            <svg className="w-5 h-5 text-white/60 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>
    </div>
  );
};

export default UI;
