
import { create } from 'zustand';
import { AppPhase, PhotoData, GestureType } from './types';

interface AppState {
  phase: AppPhase;
  photos: PhotoData[];
  gesture: GestureType;
  focusedPhotoId: string | null;
  isReady: boolean;
  setPhase: (phase: AppPhase) => void;
  addPhotos: (newPhotos: PhotoData[]) => void;
  setGesture: (gesture: GestureType) => void;
  setFocusedPhotoId: (id: string | null) => void;
  setIsReady: (ready: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  phase: AppPhase.CAKE,
  photos: [],
  gesture: 'None',
  focusedPhotoId: null,
  isReady: false,
  setPhase: (phase) => set({ phase }),
  addPhotos: (newPhotos) => set((state) => ({ photos: [...state.photos, ...newPhotos] })),
  setGesture: (gesture) => set({ gesture }),
  setFocusedPhotoId: (id) => set({ focusedPhotoId: id }),
  setIsReady: (ready) => set({ isReady: ready }),
}));
