export const LOCALES = ['en', 'fr'] as const;

export type Locale = (typeof LOCALES)[number];

export type Localized<T> = Readonly<Record<Locale, T>>;

export function otherLocale(locale: Locale): Locale {
  if (locale === 'en') {
    return 'fr';
  }
  return 'en';
}
