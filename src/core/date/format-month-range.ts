import { formatMonth } from '@core/date/format-month';
import type { Locale } from '@core/enums/locale.enum';
import type { IsoMonth } from '@core/types/formats.types';

/** "Aug 2023 – Dec 2027". */
export function formatMonthRange(start: IsoMonth, end: IsoMonth, locale: Locale): string {
  return `${formatMonth(start, locale)} – ${formatMonth(end, locale)}`;
}
