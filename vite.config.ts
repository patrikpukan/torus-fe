/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, type Plugin } from "vitest/config";

const brandId = process.env.VITE_BRAND ?? "torus";
const brandMeta = JSON.parse(
  readFileSync(
    new URL(`./brands/${brandId}/meta.json`, import.meta.url),
    "utf8"
  )
) as { title: string; favicon: string };

const brandHtml = (): Plugin => ({
  name: "brand-html",
  transformIndexHtml: (html) =>
    html
      .replace(/%BRAND_TITLE%/g, brandMeta.title)
      .replace(/%BRAND_FAVICON%/g, brandMeta.favicon),
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), brandHtml()],
  resolve: {
    alias: {
      "@brand": fileURLToPath(new URL(`./brands/${brandId}`, import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    css: true,
  },
});
