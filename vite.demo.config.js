import { defineConfig } from 'vite';

export default defineConfig({
  base: '/top-shelf/',
  build: {
    outDir: 'dist-demo',
    emptyOutDir: true,
  },
});
