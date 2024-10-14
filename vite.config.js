import { defineConfig } from 'vite';
import angular from '@angular/cli';

export default defineConfig({
  plugins: [angular()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
});