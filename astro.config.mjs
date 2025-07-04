import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'astro-icon';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [Icons()],
});
