import { defineConfig, fontProviders } from 'astro/config';

import { LOCALES } from './src/i18n/locales';

const SITE = 'https://aspectlight.github.io';

export default defineConfig({
  site: SITE,
  i18n: {
    locales: [...LOCALES],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Libre Caslon Display',
      cssVariable: '--font-display',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Libre Caslon Text',
      cssVariable: '--font-text',
      weights: [400],
      styles: ['italic'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Commit Mono',
      cssVariable: '--font-mono',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['monospace'],
    },
  ],
});
