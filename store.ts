
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppPhase, PhotoData, GestureType } from './types';

/**
 * 【关键点】当你按照下方的教程拿到“照片指纹代码”后，
 * 请把代码粘贴到下面这个方括号 [] 里面。
 */
const DEFAULT_PHOTOS: PhotoData[[
  {
    "id": "u1ynhv95i",
    "url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQICAQEBAQMCAgICAwMEBAMDAwMEBAYFBAQFBAMDBQcFBQYGBgYGBAUHBwcGBwYGBgb/2wBDAQEBAQEBAQMCAgMGBAMEBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgb/wAARCAeABQADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+IeQ5ye2Kz5h1/DNPM4Peq8j5z1x3NeefSVChKOcfUVTq1M3X1rPeTHfAoPOnuSI/PPX2rQjkAHUdO9YiuQeT+NWBNgdfyNBBoSyjB5rInk4ODSS3HB5+tZ0k2Sec0AV3JLHNPTofrURJJyalTofrQA+p16D6VBU69B9KALNQN1P1qeoG6n60ANbofpUFTt0P0qCgAqNx39OtS4PofyowfQ/lQBUYZGPyqLaw7GrpRT2x9Kb5fv8ApQBVUHI4PX0qfB9D+VSLHyOe/pU/l+/6UAV0ByeD09KlwfQ/lUyR8nnt6VL5fv8ApQBXb76/hS3H3B9BSN99fwp04/dr9KAKUQJU/SrlqrE4HUnoahiXIJ6Vo2UeZVzjr6UBa5dgs3YjA47VtQ6fKQPlPX1rWsLIMF46jvXZWmmKyD5c8c15mJqJHZh8vlNnEw2EikHaevatuCBguMGur/soLg4HB9KcbBQpOP0pYeomj36WF9jDU5CVevXmufvUznH4V2d5b7ASB0FcfeOASDxjrVw3OKqctLDhiSO9PjkCDHep53XkjFZLyYbGTj2rvh8J5tQ1nlyOtZszjn60jSHbz2HWqbuev5CqMwJxkmmhB35qInPJqxQBXooooAKKKKALFFFFABRRRQBXooooAKKKKACiiik9UNPldzsfD9ysEqEnv3r7a+E/iSCGOFS69gOfevz+iumhwwJBHOBXsvgHxNPBIgDkEH1r87414ceZ5cz9s8EONo5VxQk2fsj4I1yB7eORGXlem6vZ9M1KKc8sAcV+enw78cbbeJXmxtUZy1fQel+OkAAWTJOOnpX8v5vkmJyqtZrQ/wBaODeJMDnWDjKMtbL9D6cNwu7iQ4z610enTDaPnOPqK+crbxeZSuZDx1+avRdE8QeYFySd3vXiNNH0mOV4HsyOG9PY1Mn3hXNWGopNgBt1b8MmdvoadmfPy+ItP901Rm4DH0xV58bSc8cc1m3DqqSHIPFI9TLITvsYt5OuCMHg9qoW8qmQYyear3kwyw3Dr602xcGVeR1Heg9+vQX1e/c9FsXBQcHj2qxMwPQGqun7fLU5GfrVmYrnqOvrQfO4egvbMx77lSQM+hzWIgJbp06c1sX1wm3HNZEUyFzyBk9DQej9RSjexpwqDjIxW] = [
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
