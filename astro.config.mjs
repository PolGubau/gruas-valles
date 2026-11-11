import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import { defineConfig, fontProviders } from 'astro/config';
import { hasTranslations } from './src/i18n/routes.mjs';
import { blogSlugs } from './src/lib/blog-slugs.mjs';

export default defineConfig({
  site: 'https://www.gruasdelvalles.com',
  publicDir: './src/public',
  i18n: {
    locales: ['es', 'ca', 'en'],
    defaultLocale: 'es',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: 'Plus Jakarta Sans',
        cssVariable: '--font-jakarta',
        weights: [400, 500, 600, 700, 800],
        styles: ['normal'],
      },
    ],
  },
  integrations: [
    icon(),
    // Do not index locale URLs that only redirect to Spanish.
    sitemap({ filter: (page) => {
      const path = new URL(page).pathname;
      const blogRoute = path.match(/^\/(?:ca\/|en\/)?blog\/([^/]+)\/?$/);
      if (blogRoute && Object.hasOwn(blogSlugs, blogRoute[1])) return false;
      if (path.endsWith('.vcf')) return false;
      const localized = path.match(/^\/(ca|en)(\/.*)?$/);
      return !localized || hasTranslations(localized[2] || '/');
    } }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          // Image filenames can otherwise reveal a project's client or location.
          assetFileNames: (asset) => /\.(?:avif|jpe?g|png|webp)$/i.test(asset.names?.[0] ?? asset.name ?? '')
            ? '_assets/[hash][extname]'
            : '_assets/[name].[hash][extname]',
        },
      },
    },
  },
  output: 'static',
  compressHTML: true,
  build: {
    assets: '_assets',
  },
});
