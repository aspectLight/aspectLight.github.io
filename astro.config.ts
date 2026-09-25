import { defineConfig, fontProviders } from 'astro/config';

import { Locale } from './src/core/enums/locale.enum';

const SITE = 'https://aspectlight.github.io';
const FONT_SUBSETS: [string, ...string[]] = ['latin', 'latin-ext'];

export default defineConfig({
  site: SITE,
  i18n: {
    locales: Object.values(Locale),
    defaultLocale: Locale.En,
    routing: {
      prefixDefaultLocale: false,
    },
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'EB Garamond',
      cssVariable: '--font-serif',
      weights: [400],
      styles: ['normal', 'italic'],
      subsets: FONT_SUBSETS,
      fallbacks: ['serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      weights: [400],
      styles: ['normal'],
      subsets: FONT_SUBSETS,
      fallbacks: ['monospace'],
    },
  ],
});
