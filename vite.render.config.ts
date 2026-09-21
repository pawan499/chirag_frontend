import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Render serves only the generated public directory. Node is used at build time
// to prerender the client-side application shell, not as a deployed server.
export default defineConfig({
  nitro: false,
  tanstackStart: {
    server: { entry: "server" },
    spa: { enabled: true, prerender: { outputPath: "/index.html" } },
  },
});
