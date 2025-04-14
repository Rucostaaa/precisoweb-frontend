import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Change the development server port
    open: true, // Automatically open the browser
  },
  resolve: {
    alias: {
      "@": "/src", // Shortcuts for cleaner imports (e.g., import x from '@/components/x')
    },
  },
});