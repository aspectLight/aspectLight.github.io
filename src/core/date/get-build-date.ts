import type { IsoDate } from '@core/types/formats.types';

const ISO_DATE_PATTERN = /^\d{4}-(?:0[1-9]|1[0-2])-\d{2}$/;

function isIsoDate(value: string): value is IsoDate {
  return ISO_DATE_PATTERN.test(value);
}

/**
 * The date the site was built, shown as its revision date.
 * The site is rebuilt on every push, so this is the date of the last change.
 */
export function getBuildDate(): IsoDate {
  const today = new Date().toISOString().slice(0, 10);
  if (!isIsoDate(today)) {
    throw new Error(`Unexpected build date "${today}" (expected YYYY-MM-DD)`);
  }
  return today;
}
