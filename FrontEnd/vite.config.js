import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import path from "path";
dotenv.config({path: path.resolve("../.env")});


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(
      // eslint-disable-next-line no-undef
      process.env.VITE_API_URL
    ),
  },
  server: {
    proxy: {
      "/api": { target: "http://localhost:5000", changeOrigin: true },
    },
  },
});
