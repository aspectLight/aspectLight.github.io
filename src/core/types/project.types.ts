import type { HttpsUrl, IsoMonth } from '@core/types/formats.types';
import type { Localized } from '@core/types/localized.types';

export interface ProjectEntry {
  readonly title: Localized<string>;
  readonly summary: Localized<string>;
  readonly date: IsoMonth;
  readonly context: Localized<string>;
  readonly sourceUrl?: HttpsUrl;
  readonly demoUrl?: HttpsUrl;
}
