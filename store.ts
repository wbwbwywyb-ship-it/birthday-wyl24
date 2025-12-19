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
  // { id: "1", url: "https://files.catbox.moe/plbkz8.jpg" },
  // { id: "2", url: "https://files.catbox.moe/uqahsn.jpg" },
  // { id: "3", url: "https://files.catbox.moe/ax8496.jpg" },
  // { id: "4", url: "https://files.catbox.moe/foruys.jpg" },
  // { id: "5", url: "https://files.catbox.moe/q5lt9y.jpg" },
  // { id: "6", url: "https://files.catbox.moe/3hakb4.jpg" },
  // { id: "7", url: "https://files.catbox.moe/pencw1.jpg" },
  // { id: "8", url: "https://files.catbox.moe/wyd56n.jpg" },
  // { id: "9", url: "https://files.catbox.moe/bqounx.jpg" },
  // { id: "10", url: "https://files.catbox.moe/kjmeua.jpg" },
  // { id: "11", url: "https://files.catbox.moe/krv1v7.jpg" },
  // { id: "12", url: "https://files.catbox.moe/9tzhsm.jpg" },
  // { id: "13", url: "https://files.catbox.moe/pzogtm.jpg" },
  // { id: "14", url: "https://files.catbox.moe/zlmdrf.jpg" },
  // { id: "15", url: "https://files.catbox.moe/isrbe1.jpg" },
  // { id: "16", url: "https://files.catbox.moe/ixo81r.jpg" },
  // { id: "17", url: "https://files.catbox.moe/8v9nvm.jpg" },
  // { id: "18", url: "https://files.catbox.moe/7dh1qp.jpg" },
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
