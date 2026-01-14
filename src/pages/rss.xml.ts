import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('posts')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );

  return rss({
    title: 'acesyde - Blog personnel',
    description: "Blog personnel sur l'informatique, le DIY et les projets techniques",
    site: context.site || context.url.origin,
    items: posts.map((post) => {
      const slugParts = post.id.split('/');
      slugParts.pop(); // Remove 'index.md'
      slugParts.shift(); // Remove 'posts'
      const slug = slugParts.join('/');
      
      return {
        title: post.data.title,
        description: post.data.title,
        pubDate: post.data.date,
        link: `/posts/${slug}/`,
      };
    }),
    customData: `<language>fr-FR</language>`,
  });
}
