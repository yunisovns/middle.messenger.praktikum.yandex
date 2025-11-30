declare module "vite-plugin-handlebars" {
  import { Plugin } from "vite";

  interface VitePluginHandlebarsOptions {
    partialDirectory?: string;
    context?: Record<string, any>;
    helpers?: Record<string, (...args: any[]) => string>;
  }

  export default function handlebars(
    options?: VitePluginHandlebarsOptions
  ): Plugin;
}
