import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
<<<<<<< HEAD
      "/api": { target: "http://localhost:5000" , changeOrigin: true },
=======
      "/api": { target: "https://vendor-discovery-shortlist-builder.onrender.com", changeOrigin: true },
>>>>>>> 1c0ca84fce8e3f69d77224a31682e7de474ab526
    },
  },
});
