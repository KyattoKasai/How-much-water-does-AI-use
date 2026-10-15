import { defineConfig } from "vite";

export default defineConfig({
  base: "/How-much-water-does-AI-use/dist/",
  build: {
    rollupOptions: {
      input: "app.html",
    },
  },
});
