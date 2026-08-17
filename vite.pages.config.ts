import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const projectRoot = process.cwd();

export default defineConfig({
  root: resolve(projectRoot, "github-pages"),
  base: "/apart-auction/",
  publicDir: resolve(projectRoot, "public"),
  plugins: [react()],
  css: {
    postcss: resolve(projectRoot, "postcss.config.mjs"),
  },
  build: {
    outDir: resolve(projectRoot, "dist-pages"),
    emptyOutDir: true,
  },
});
