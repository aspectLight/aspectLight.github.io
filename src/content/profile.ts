import type { EmailAddress } from '@values/email-address';
import type { HttpsUrl } from '@values/https-url';

export interface Profile {
  readonly displayName: string;
  readonly givenName: string;
  readonly familyName: string;
  readonly email: EmailAddress;
  readonly linkedInUrl: HttpsUrl;
  readonly gitHubUrl: HttpsUrl;
  readonly place: string;
}

export const PROFILE: Profile = {
  displayName: 'Sami Benabbou',
  givenName: 'Sami',
  familyName: 'Benabbou',
  email: 'aspectlight93@gmail.com',
  linkedInUrl: 'https://www.linkedin.com/in/sami-benabbou-90195837b/',
  gitHubUrl: 'https://github.com/aspectLight',
  place: 'Montréal, QC',
};
