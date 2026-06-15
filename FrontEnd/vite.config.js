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
    host: "0.0.0.0",
    // eslint-disable-next-line no-undef
    port:  Number(process.env.VITE_PORT) ||  5173,
    allowedHosts: [
      // eslint-disable-next-line no-undef
      process.env.VITE_API_URL
    ]

  },
});
