// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Site GitHub Pages "projet" : https://hustlrokkk.github.io/Othmankhanfara/
// Si un jour tu branches un domaine personnalisé, mets simplement base: '/'
// (toutes les URLs utilisent import.meta.env.BASE_URL, donc elles s'adaptent toutes seules).
export default defineConfig({
  site: 'https://hustlrokkk.github.io',
  base: '/Othmankhanfara',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
});
