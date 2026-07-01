
import { fileURLToPath, URL } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import environment from "vite-plugin-environment";
import viteImagemin from "vite-plugin-imagemin";
// import sitemap from "vite-plugin-sitemap";

const ii_url = "https://identity.internetcomputer.org/";

process.env.II_URL = process.env.II_URL || ii_url;

process.env.STORAGE_GATEWAY_URL =
  process.env.STORAGE_GATEWAY_URL || "https://blob.caffeine.ai";

export default defineConfig({
  logLevel: "info",

  build: {
    emptyOutDir: true,
    sourcemap: false,
    minify: "esbuild",
    target: "es2018",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          const parts = id.toString().split("node_modules/")[1].split("/");
          const pkg = parts[0].startsWith("@") ? `${parts[0]}/${parts[1]}` : parts[0];
          return `vendor-${pkg}`;
        },
      },
    },
  },

  css: {
    postcss: "./postcss.config.js",
  },

  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },

  esbuild: {
    drop: ["console", "debugger"],
  },

  server: {
    proxy: {
      "/api": {
        target: "https://tinkro.in",
        changeOrigin: true,
      },
    },
  },

  plugins: [
    environment("all", { prefix: "VITE_" }),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
    environment(["II_URL"]),
    environment(["STORAGE_GATEWAY_URL"]),

    react(),

    viteImagemin({
      gifsicle: {
        optimizationLevel: 3,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 5,
      },
      mozjpeg: {
        quality: 88,
      },
      pngquant: {
        quality: [0.85, 0.95],
        speed: 2,
      },
      svgo: {
        plugins: [
          { name: "removeViewBox", active: false },
          { name: "removeEmptyAttrs", active: false },
        ],
      },
      webp: {
        quality: 88,
      },
    }),

    // sitemap({
    //   hostname: "https://tinkro.in",
    // }),
  ],

  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(
          new URL("../declarations", import.meta.url)
        ),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],

    dedupe: ["@dfinity/agent"],
  },
});