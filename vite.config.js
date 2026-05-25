import fs from "fs";
import path from "path";
import { defineConfig } from "vite";

function copyMarkdownToDist() {
  const markdownFiles = [
    "README.md",
    "ruta-data-interactiva.md",
    "semana-01.md",
    "semana-02.md",
    "semana-03.md",
    "semana-04.md",
    "frases-clave.md",
    "vocabulario-tech.md",
    "cheat-sheet-entrevistas.md",
    "bitacora.md",
    "ilustraciones-referenciadas.md"
  ];

  return {
    name: "copy-markdown-to-dist",
    writeBundle() {
      const rootDir = process.cwd();
      const outDir = path.join(rootDir, "dist");

      for (const fileName of markdownFiles) {
        const source = path.join(rootDir, fileName);
        const target = path.join(outDir, fileName);

        if (fs.existsSync(source)) {
          fs.copyFileSync(source, target);
        }
      }
    }
  };
}

export default defineConfig({
  base: "./",
  plugins: [copyMarkdownToDist()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true
      }
    }
  }
});
