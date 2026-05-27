// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Domaine personnalisé servi à la racine → base: '/'.
// Toutes les URLs utilisent import.meta.env.BASE_URL, donc elles s'adaptent au base.
export default defineConfig({
  site: 'https://www.quedelaperf.com',
  base: '/',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
});
