import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { S3_CATALOG_URL } from './urls';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 100,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          'ui-libs': ['@mui/material', '@emotion/react', '@emotion/styled'],
        },
      },
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        warn(warning);
      },
    },
  },
  assetsInclude: ['./static-assets/**/*'],
  server: {
    port: 3000,
    proxy: {
      '/catalog': {
        target: S3_CATALOG_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/catalog/, ''),
      },
    },
  },
});
