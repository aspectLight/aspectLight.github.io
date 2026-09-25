import { Locale } from '@core/enums/locale.enum';
import type { IsoMonth } from '@core/types/formats.types';

const INTL_LOCALES: Readonly<Record<Locale, string>> = {
  [Locale.En]: 'en-CA',
  [Locale.Fr]: 'fr-CA',
};

/** "2027-12" → "Dec 2027" (en) / "déc. 2027" (fr). */
export function formatMonth(month: IsoMonth, locale: Locale): string {
  const [year, monthNumber] = month.split('-').map(Number);
  if (year === undefined || monthNumber === undefined) {
    throw new Error(`Invalid ISO month "${month}" (expected YYYY-MM)`);
  }
  const firstDayOfMonth = new Date(Date.UTC(year, monthNumber - 1, 1));
  return new Intl.DateTimeFormat(INTL_LOCALES[locale], {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(firstDayOfMonth);
}
