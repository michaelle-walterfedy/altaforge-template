import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendUrl = env.VITE_BACKEND_URL || "http://127.0.0.1:8001";

  // Resolve altaforge-ui imports directly from source so that:
  //  - The dev server hot-reloads immediately when altaforge-ui/src/ changes
  //  - Docker volume mounts (./altaforge-ui/src) are sufficient; no dist rebuild needed
  //  - CSS modules in altaforge-ui are handled by Vite inline
  //
  // CSS aliases must come before the JS ones (more specific → less specific)
  // so that "altaforge-ui/themes/styles.css" doesn't accidentally match "altaforge-ui/themes".
  const uiRoot = path.resolve(__dirname, "../altaforge-ui/src");
  const radixCSS = path.resolve(__dirname, "../node_modules/@radix-ui/themes/styles.css");

  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      port: 5174,
      watch: {
        usePolling: true,
      },
      proxy: {
        "/api": {
          target: backendUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    resolve: {
      alias: [
        // CSS — bypass compiled dist, use real sources
        { find: "altaforge-ui/themes/styles.css", replacement: radixCSS },
        { find: "altaforge-ui/base.css", replacement: path.join(uiRoot, "base.css") },
        { find: "altaforge-ui/components/styles.css", replacement: path.join(uiRoot, "base.css") },
        // JS — resolve TypeScript source directly (enables instant HMR for UI lib changes)
        { find: "altaforge-ui/themes", replacement: path.join(uiRoot, "themes.ts") },
        { find: "altaforge-ui/charts", replacement: path.join(uiRoot, "charts.ts") },
        { find: "altaforge-ui/components", replacement: path.join(uiRoot, "components/index.ts") },
        // App alias
        { find: "@", replacement: path.resolve(__dirname, "./src") },
      ],
    },
  };
});
