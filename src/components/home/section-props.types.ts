import type { Locale } from '@core/enums/locale.enum';

/** Every home-page section component receives exactly these props. */
export interface SectionProps {
  readonly locale: Locale;
  readonly number: number;
}
