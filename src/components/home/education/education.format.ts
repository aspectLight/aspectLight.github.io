import { formatMonthRange } from '@core/date/format-month-range';
import type { Locale } from '@core/enums/locale.enum';
import type { EducationEntry } from '@core/types/education.types';
import { getTranslations } from '@i18n/i18n';

/** "Aug 2023 – Dec 2027 (expected) · Montréal, QC". */
export function formatEducationPeriod(entry: EducationEntry, locale: Locale): string {
  const range = formatMonthRange(entry.start, entry.end, locale);
  const expected = entry.isEndExpected ? ` ${getTranslations(locale).expectedLabel}` : '';
  return `${range}${expected} · ${entry.place}`;
}
