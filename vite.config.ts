import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    host: true
  },
  optimizeDeps: {
    include: [
      'ol',
      'ol/Map',
      'ol/View',
      'ol/layer/Tile',
      'ol/source/OSM',
      'ol/control',
      'ol/proj',
      'ol/geom',
      'ol/style',
      'ol/format',
      'ol/interaction'
    ]
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'ol': ['ol'],
          'element-plus': ['element-plus']
        }
      }
    }
  }
});
