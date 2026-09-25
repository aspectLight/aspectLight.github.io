import type { Locale } from '@i18n/locales';

const HOME_PATH: Readonly<Record<Locale, string>> = {
  en: '/',
  fr: '/fr/',
};

export interface AlternateLink {
  readonly locale: Locale;
  readonly href: string;
}

export function homePath(locale: Locale): string {
  return HOME_PATH[locale];
}
