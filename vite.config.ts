import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression2';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithms: ['brotliCompress'],
      threshold: 10240,
      deleteOriginalAssets: false, 
    }),
    compression({
      algorithms: ['gzip'],
      threshold: 10240,
    }),
    visualizer({
      open: true,
      filename: 'stats.html',
      gzipSize: true,
    })
  ],
  build: {
    minify: 'terser',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        compact: true,
        minifyInternalExports: true,
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/@material/web')) {
            return 'm3-components';
          }
          if (id.includes('react-syntax-highlighter') || id.includes('highlight.js')) {
            return 'syntax-highlighter';
          }
        }
      }
    }
  }
})
