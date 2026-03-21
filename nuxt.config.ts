import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  ssr: false,
  site: {
    url: 'https://errandr.com',
    name: 'Errandr',
    description: 'Manage your deliveries, track earnings, and complete campus errands efficiently with Errandr.',
    defaultLocale: 'en',
  },

  devServer: {
    port: 3002,
    host: 'localhost'
  },

  postcss: {
    plugins: {
      "postcss-import": {},
      "tailwindcss/nesting": {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      title: 'Errandr - Errander Portal',
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "format-detection", content: "telephone=no" },

        // ✅ SEO meta
        {
          name: "description",
          content: 'Manage your deliveries, track earnings, and complete campus errands efficiently with Errandr.'
        },
        {
          name: "keywords",
          content: 'Errandr driver, campus delivery driver, food delivery errander, earn money on campus'
        },
        { name: "author", content: "Errandr" },

        // ✅ Open Graph (for social previews)
        { property: "og:title", content: "Errandr — Errander Portal" },
        {
          property: "og:description",
          content:
            "Manage your deliveries, track earnings, and complete campus errands efficiently with Errandr.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://errandr.com" },
        { property: "og:image", content: "https://errandr.com/og-image.jpg" },

        // ✅ Twitter meta
        { name: "twitter:card", content: "summary_large_image" },
        { property: "twitter:url", content: "https://errandr.com" },
        { name: "twitter:title", content: "Errandr — Errander Portal" },
        {
          name: "twitter:description",
          content:
            "Manage your deliveries, track earnings, and complete campus errands efficiently with Errandr.",
        },
        { name: "twitter:image", content: "https://errandr.com/og-image.jpg" },
      ],

      link: [
        { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
        { rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon-96x96.png" },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "manifest", href: "/site.webmanifest" }
      ],

      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js",
          type: "text/javascript",
        },
      ],
    },
  },

  build: {
    transpile: ["lucide-vue-next"],
  },

  css: ["/assets/css/main.css", "/assets/font/stylesheet.css"],

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/google-fonts",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "@nuxtjs/seo",
  ],

  compatibilityDate: "2025-11-01"
});