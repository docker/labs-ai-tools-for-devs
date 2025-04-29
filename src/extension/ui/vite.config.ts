import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 100,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          "ui-libs": ["@mui/material", "@emotion/react", "@emotion/styled"],
        },
      },
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        warn(warning);
      },
    },
  },
  assetsInclude: ['./static-assets/**/*'],
  server: {
    port: 3000,
    strictPort: true,
  },
});
