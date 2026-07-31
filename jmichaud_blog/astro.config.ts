// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import { unified } from "@astrojs/markdown-remark"; // new
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap, { ChangeFreqEnum } from "@astrojs/sitemap";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import { remarkReadingTime } from "./src/plugins/remark-reading-time";

// https://astro.build/config
export default defineConfig({
  site: "https://www.jmichaud.ca",
  output: "server",
  security: {
    checkOrigin: false, // ← disables the CSRF origin check
  },
  trailingSlash: "never",

  fonts: [
    {
      provider: fontProviders.google(),
      name: "Inter",
      cssVariable: "--font-inter",
      weights: [400, 500, 600],
      styles: ["normal"],
      fallbacks: ["system-ui", "sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains-mono",
      weights: [400, 500],
      styles: ["normal"],
      fallbacks: ["monospace"],
    },
  ],

  vite: {
    // Type assertion needed: @tailwindcss/vite plugin type doesn't align with Vite's PluginOption
    plugins: [tailwindcss() as any],
    ssr: {
      // Force Vite to bundle these instead of treating them as external
      noExternal: ["resend"],
    },
  },

  markdown: {
    processor: unified({
      remarkPlugins: [remarkReadingTime],
    }),
  },

  integrations: [
    react(),
    mdx(),
    sitemap({
      serialize(item) {
        // Exclude noindex pages
        if (item.url.includes("/404")) return undefined;

        // Boost blog posts
        if (item.url.includes("/blog/")) {
          return { ...item, priority: 0.8, changefreq: ChangeFreqEnum.WEEKLY };
        }
        // Series index
        if (item.url.includes("/series/")) {
          return { ...item, priority: 0.7, changefreq: ChangeFreqEnum.MONTHLY };
        }
        // Root + about
        return { ...item, priority: 1.0, changefreq: ChangeFreqEnum.MONTHLY };
      },
    }),
  ],

  adapter: node({
    mode: "standalone",
  }),
});
