import type { Locale } from '@i18n/locales';
import type { IsoDate } from '@values/iso-date';
import type { IsoMonth } from '@values/iso-month';
import { UI } from '@i18n/ui';

const INTL_LOCALE: Readonly<Record<Locale, string>> = {
  en: 'en-CA',
  fr: 'fr-CA',
};

export function formatMonth(month: IsoMonth, locale: Locale): string {
  const parts = month.split('-');
  const yearText = parts[0];
  const monthText = parts[1];
  if (yearText === undefined || monthText === undefined) {
    throw new Error(`Invalid ISO month "${month}" (expected YYYY-MM with month 01–12)`);
  }
  const year = Number(yearText);
  const monthIndex = Number(monthText) - 1;
  const date = new Date(Date.UTC(year, monthIndex, 1));
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatRevision(date: IsoDate, locale: Locale): string {
  return `${UI[locale].revisionLabel} ${date}`;
}
