import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  publicDir: 'public',
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "vite-react-ts-button",
      fileName: (format) => `index.${format}.js`,
      formats: ["cjs", "es"]
    },
    rollupOptions: {
      external: ['fs-extra', 'path'],
      output: {
        globals: {
          fs: 'fs',
          path: 'path',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true
  },
  resolve: {
    alias: {
      path: 'path-browserify',
      '@': path.resolve(__dirname, './src'),
    }
  },
  plugins: [dts()]
});        