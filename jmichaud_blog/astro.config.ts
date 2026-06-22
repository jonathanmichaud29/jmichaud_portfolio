// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import { remarkReadingTime } from "./src/plugins/remark-reading-time";

// https://astro.build/config
export default defineConfig({
  site: "https://www.jmichaud.ca",
  output: "server",

  vite: {
    // Type assertion needed: @tailwindcss/vite plugin type doesn't align with Vite's PluginOption
    plugins: [tailwindcss() as any],
  },

  markdown: {
    remarkPlugins: [remarkReadingTime],
  },

  integrations: [react(), mdx(), sitemap()],

  adapter: node({
    mode: "standalone",
  }),
});
