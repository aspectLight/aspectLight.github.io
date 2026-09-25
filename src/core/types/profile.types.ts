import type { EmailAddress, HttpsUrl } from '@core/types/formats.types';
import type { Localized } from '@core/types/localized.types';

export interface Profile {
  readonly givenName: string;
  readonly familyName: string;
  readonly email: EmailAddress;
  readonly linkedInUrl: HttpsUrl;
  readonly gitHubUrl: HttpsUrl;
  readonly abstract: Localized<string>;
}
