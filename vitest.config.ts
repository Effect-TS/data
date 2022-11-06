/// <reference types="vitest" />
import path from "path"
import { defineConfig } from "vite"

export default defineConfig({
  test: {
    include: ["./test/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["./test/**/util.ts", "./test/limbo"],
    globals: true
  },
  resolve: {
    alias: {
      "@fp-ts/data/test": path.resolve(__dirname, "/test"),
      "@fp-ts/data": path.resolve(__dirname, "/src")
    }
  }
})
