import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    showToc: z.boolean().default(true),
    cover: z.object({
      image: z.string(),
      alt: z.string().optional(),
      title: z.string().optional(),
      relative: z.boolean().optional().default(true),
    }).optional(),
  }).passthrough(),
});

export const collections = {
  posts,
};
