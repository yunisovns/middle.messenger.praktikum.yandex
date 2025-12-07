import path from "path";
import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
import stylelint from "vite-plugin-stylelint";

export default defineConfig({
  server: {
    port: 3000,
  },
  preview: {
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
    stylelint(),
    handlebars({
      partialDirectory: path.resolve(__dirname, "src/components"),
    }),
  ],
  assetsInclude: ["**/*.hbs"],
});
