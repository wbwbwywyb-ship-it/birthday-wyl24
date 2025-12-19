import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppPhase, PhotoData, GestureType } from './types';

/**
 * 【重要使用说明】
 * 1. 请先把你的照片上传到免费图床（推荐 https://catbox.moe/ ，无需注册）
 * 2. 每张照片上传后会得到一个直链 URL（以 .jpg 或 .png 结尾）
 * 3. 把 URL 填到下面的 DEFAULT_PHOTOS 数组里，一行一张
 * 4. 提交后，任何人打开网站都能直接看到这些照片（永久保存）
 * 
 * 示例：
 * { id: "1", url: "https://files.catbox.moe/abc123.jpg" },
 */
const DEFAULT_PHOTOS: PhotoData[] = [
  // 在这里填入你的照片 URL
  // { id: "1", url: "https://files.catbox.moe/xxxxxx/photo1.jpg" },
  // { id: "2", url: "https://files.catbox.moe/xxxxxx/photo2.jpg" },
  // { id: "3", url: "https://files.catbox.moe/xxxxxx/photo3.jpg" },
  // 删除以上注释，填入真实 URL 即可
];

interface AppState {
  phase: AppPhase;
  photos: PhotoData[];
  gesture: GestureType;
  focusedPhotoId: string | null;
  isReady: boolean;
  setPhase: (phase: AppPhase) => void;
  addPhotos: (newPhotos: PhotoData[]) => void;
  clearPhotos: () => void;
  setGesture: (gesture: GestureType) => void;
  setFocusedPhotoId: (id: string | null) => void;
  setIsReady: (ready: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      phase: AppPhase.CAKE,
      // 如果本地没有保存照片，就用默认照片
      photos: DEFAULT_PHOTOS.length > 0 ? DEFAULT_PHOTOS : [],
      gesture: 'None',
      focusedPhotoId: null,
      isReady: false,
      setPhase: (phase) => set({ phase }),
      addPhotos: (newPhotos) => set((state) => ({ photos: [...state.photos, ...newPhotos] })),
      clearPhotos: () => set({ photos: [] }),
      setGesture: (gesture) => set({ gesture }),
      setFocusedPhotoId: (id) => set({ focusedPhotoId: id }),
      setIsReady: (ready) => set({ isReady: ready }),
    }),
    {
      name: 'birthday-app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ photos: state.photos }),
    }
  )
);
