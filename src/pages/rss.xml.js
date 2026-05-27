import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '') + '/';
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Le Blog — Othman Khanfara',
    description: "Méthodes et retours d'expérience sur le Paid Media et le growth marketing.",
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `${base}blog/${p.id}/`,
    })),
    customData: `<language>fr-FR</language>`,
  });
}
