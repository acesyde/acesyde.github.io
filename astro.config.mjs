import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import markdoc from '@astrojs/markdoc';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
// https://astro.build/config
export default defineConfig({
  site: 'https://acesyde.github.io',
  base: '/',
  integrations: [svelte(), markdoc(), mdx(), sitemap()]
});