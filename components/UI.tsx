
import React, { useState } from 'react';
import { useStore } from '../store';
import { AppPhase } from '../types';

const UI: React.FC = () => {
  const phase = useStore((state) => state.phase);
  const setPhase = useStore((state) => state.setPhase);
  const gesture = useStore((state) => state.gesture);
  const addPhotos = useStore((state) => state.addPhotos);
  const clearPhotos = useStore((state) => state.clearPhotos);
  const photos = useStore((state) => state.photos);
  const isReady = useStore((state) => state.isReady);

  const [copyFeedback, setCopyFeedback] = useState(false);

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

  const exportConfig = () => {
    // 将当前所有照片数据转为 JSON 字符串
    const configStr = JSON.stringify(photos, null, 2);
    // 复制到剪贴板
    navigator.clipboard.writeText(configStr).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
      alert("照片数据已成功复制到剪贴板！\n\n现在请回到 GitHub 找到 store.ts 文件，把这段内容粘贴到 DEFAULT_PHOTOS 后面。");
    });
  };

  const showHeader = isReady && phase === AppPhase.CAKE;

  return (
    <div className={`absolute inset-0 pointer-events-none flex flex-col justify-between p-8 transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
      {/* 顶部状态 */}
      <div className="flex flex-col gap-2">
        <div className="px-4 py-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-lg self-start">
          <p className="text-white/60 text-[10px] uppercase tracking-widest mb-1">Status</p>
          <p className="text-white font-light text-sm capitalize">{phase}</p>
        </div>
      </div>

      {/* 中央标题 */}
      <div className={`text-center transition-all duration-1000 transform ${showHeader ? 'translate-y-0 opacity-70' : '-translate-y-10 opacity-0'} max-w-5xl mx-auto`}>
        <h1 className="text-[#FFD700] text-6xl md:text-8xl lg:text-9xl font-cursive drop-shadow-[0_0_20px_rgba(255,215,0,0.6)] leading-[1.8]">
          Happy Birthday,<br />
          <span className="whitespace-nowrap">温咏琳</span>
        </h1>
      </div>

      {/* 底部控制栏 */}
      <div className="flex justify-between items-end pointer-events-auto">
        <div className="flex flex-col gap-3">
          <div className="flex gap-4">
            {phase === AppPhase.CAKE && (
              <button 
                onClick={() => setPhase(AppPhase.BLOOMING)}
                className="px-8 py-3 bg-white/10 border border-white/20 text-white rounded-full font-medium text-xs hover:bg-white/20 transition-all backdrop-blur-md"
              >
                Start Celebration
              </button>
            )}
            {phase === AppPhase.NEBULA && (
              <button 
                onClick={() => setPhase(AppPhase.COLLAPSING)}
                className="px-8 py-3 bg-pink-600/30 border border-pink-500/40 text-white rounded-full font-semibold text-sm hover:bg-pink-500/50 transition-all backdrop-blur-md"
              >
                Back to Cake
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <button onClick={clearPhotos} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-300 rounded-full text-[10px]">
              Clear
            </button>
            <button 
              onClick={exportConfig} 
              className="px-3 py-1 bg-blue-500/20 border border-blue-500/40 text-blue-100 rounded-full text-[10px] font-bold animate-pulse"
            >
              {copyFeedback ? 'Copied!' : 'Export Photo Data (Step 1)'}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <label className="group flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full cursor-pointer backdrop-blur-md">
            <span className="text-white text-xs font-light uppercase">Add Photos ({photos.length})</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>
    </div>
  );
};

export default UI;
