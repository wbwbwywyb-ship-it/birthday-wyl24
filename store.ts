
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppPhase, PhotoData, GestureType } from './types';

/**
 * 【关键点】当你按照下方的教程拿到“照片指纹代码”后，
 * 请把代码粘贴到下面这个方括号 [] 里面。
 */
const DEFAULT_PHOTOS: PhotoData[] = [
  // 在这里粘贴导出的代码
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
      // 如果本地没有新照片，就显示预设照片
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
