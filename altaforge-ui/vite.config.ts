import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { copyFileSync, mkdirSync } from "fs";
import { createRequire } from "module";
import { dirname, resolve } from "path";

const require = createRequire(import.meta.url);
let resolvedOutDir = "";

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
    {
      name: "copy-css",
      configResolved(config) {
        resolvedOutDir = config.build.outDir;
      },
      closeBundle() {
        if (resolvedOutDir !== "dist") {
          return;
        }

        const cssSource = require.resolve("@radix-ui/themes/styles.css");
        const cssDest = resolve(__dirname, resolvedOutDir, "styles.css");

        mkdirSync(dirname(cssDest), { recursive: true });
        copyFileSync(cssSource, cssDest);
        const baseSource = resolve(__dirname, "src/base.css");
        const baseDest = resolve(__dirname, "dist/base.css");
        copyFileSync(baseSource, baseDest);
      },
    },
  ],
  resolve: {
    alias: {
      "../themes": "altaforge-ui/themes",
      "../charts": "altaforge-ui/charts",
    },
  },
  build: {
    lib: {
      entry: {
        index: "src/index.ts",
        themes: "src/themes.ts",
        charts: "src/charts.ts",
        components: "src/components/index.ts",
      },
      formats: ["es", "cjs"],
      fileName: (format, entryName) => `${entryName}.${format === "es" ? "mjs" : "js"}`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@radix-ui/themes",
        "@radix-ui/react-icons",
        "ag-grid-community",
        "ag-grid-react",
        "chart.js",
        "react-chartjs-2",
        "altaforge-ui/themes",
        "altaforge-ui/charts",
        "altaforge-ui/components",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
          "react/jsx-dev-runtime": "jsxRuntime",
        },
      },
    },
  },
});
