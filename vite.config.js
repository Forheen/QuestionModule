import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";  // Use import instead of require

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [svgr(), react()],
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    },
  },
  preview: {
    port: 8080,
    strictPort: true,
   },
   server: {
    port: 8080,
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:8080",
    // hmr:
    // {overlay : false,
    // }
   },
   
});
