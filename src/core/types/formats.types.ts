type MonthNumber =
  '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';

/** Calendar month, e.g. "2027-12". A month outside 01–12 does not compile. */
export type IsoMonth = `${number}-${MonthNumber}`;

/** Calendar day, e.g. "2026-09-24". */
export type IsoDate = `${IsoMonth}-${number}`;

/** Only secure external links are publishable. */
export type HttpsUrl = `https://${string}`;

export type EmailAddress = `${string}@${string}.${string}`;
