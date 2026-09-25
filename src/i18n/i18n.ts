import { Locale } from '@core/enums/locale.enum';
import { EN } from '@i18n/en';
import { FR } from '@i18n/fr';
import type { Translations } from '@i18n/translations.types';

const TRANSLATIONS: Readonly<Record<Locale, Translations>> = {
  [Locale.En]: EN,
  [Locale.Fr]: FR,
};

export function getTranslations(locale: Locale): Translations {
  return TRANSLATIONS[locale];
}

export function getOtherLocale(locale: Locale): Locale {
  return locale === Locale.En ? Locale.Fr : Locale.En;
}
