import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import { defineConfig, fontProviders } from 'astro/config';

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
    // Only the homepages have translations; interior redirects are not indexed.
    sitemap({ filter: (page) => !/^\/(ca|en)\/.+/.test(new URL(page).pathname) }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
  compressHTML: true,
  build: {
    assets: '_assets',
  },
});
