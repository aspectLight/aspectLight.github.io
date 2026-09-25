import type { IsoMonth } from '@core/types/formats.types';

/** 2023 for "2023-08". */
export function getYear(month: IsoMonth): number {
  return Number(month.slice(0, month.indexOf('-')));
}
