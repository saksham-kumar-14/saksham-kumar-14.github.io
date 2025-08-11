import { defineConfig } from 'astro/config';
import Icons from 'astro-icon';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [Icons(), mdx()],
  site: 'https://saksham-kumar-14.github.io',
});
