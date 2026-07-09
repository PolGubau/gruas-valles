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
  // Mientras ca/en no tengan páginas propias, redirigimos al contenido en ES.
  // Cuando se cree src/pages/ca/foo.astro esta entrada deja de tener efecto.
  redirects: {
    '/ca': '/',
    '/en': '/',
    '/ca/[...path]': '/[...path]',
    '/en/[...path]': '/[...path]',
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
    sitemap(),
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
