import type { Locale } from '@core/enums/locale.enum';
import type { HttpsUrl, IsoMonth } from '@core/types/formats.types';

export interface CertificationEntry {
  readonly title: string;
  /** Certification titles stay in their original language. */
  readonly titleLocale: Locale;
  readonly issuer: string;
  readonly issued: IsoMonth;
  readonly verifyUrl?: HttpsUrl;
}
