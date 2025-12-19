
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Change this to your repository name if deploying to GitHub Pages
  // base: '/birthday-wyl24/',
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
