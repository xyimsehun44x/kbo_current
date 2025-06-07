// overlay-demo/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: ".",                // project root
  publicDir: "public",      // “public” folder holds index.html + static assets
  build: {
    outDir: "dist",         // production build dir (if you run `npm run build`)
    emptyOutDir: true
  },
  server: {
    port: 3000,
    open: true              // open browser automatically on `npm run dev`
  }
});
