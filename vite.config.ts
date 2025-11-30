import path from "path";
import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
  plugins: [
    handlebars({
      partialDirectory: path.resolve(__dirname, "src/components"),
    }),
  ],
  assetsInclude: ["**/*.hbs"],
});
