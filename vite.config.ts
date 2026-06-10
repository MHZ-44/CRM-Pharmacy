import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("recharts")) {
            return "charts";
          }

          if (id.includes("react-icons") || id.includes("lucide-react")) {
            return "icons";
          }

          if (id.includes("@zxing")) {
            return "barcode";
          }

          if (
            id.includes("/node_modules/react/") ||
            id.includes("/node_modules/react-dom/") ||
            id.includes("/node_modules/scheduler/")
          ) {
            return "react-vendor";
          }

          if (id.includes("@tanstack")) {
            return "query-vendor";
          }

          if (id.includes("framer-motion") || id.includes("motion-dom")) {
            return "motion";
          }

          if (id.includes("axios")) {
            return "http";
          }

          if (id.includes("radix-ui") || id.includes("@radix-ui")) {
            return "radix";
          }

          if (
            id.includes("class-variance-authority") ||
            id.includes("clsx") ||
            id.includes("tailwind-merge") ||
            id.includes("sonner") ||
            id.includes("next-themes") ||
            id.includes("input-otp")
          ) {
            return "ui-utils";
          }

          return "vendor";
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
