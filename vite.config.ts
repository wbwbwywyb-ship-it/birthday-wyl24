
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 修改为你的仓库名，确保在 GitHub Pages 上资源路径加载正确
  base: '/birthday-wyl24/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 跳过对依赖库的复杂检查
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  // 解决开发环境下的路径映射问题
  resolve: {
    alias: {
      '@': '/',
    },
  },
});
