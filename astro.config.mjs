import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://dijichang.blog',
  trailingSlash: 'always',
  integrations: [preact()],
  build: {
    format: 'directory',
  },
});
