import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path"; // Use import instead of require

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
    port: 8080,   // Port for the preview server
    strictPort: true,   // Ensure it does not use another port
  },
  server: {
    port: 8080,        // Port for the development server
    strictPort: true,  // Prevent using another port if 8081 is in use
    host: '0.0.0.0',   // Allow access from any IP address (important for Docker)
    hmr: {
      overlay: false,   // Disable HMR overlay if you want better error handling
    },
  },
});

