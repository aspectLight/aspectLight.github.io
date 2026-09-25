import type { IsoMonth } from '@core/types/formats.types';
import type { Localized } from '@core/types/localized.types';

export interface EducationEntry {
  readonly institution: string;
  readonly degree: Localized<string>;
  readonly track: Localized<string>;
  readonly start: IsoMonth;
  readonly end: IsoMonth;
  readonly isEndExpected: boolean;
  readonly place: string;
  readonly coursework: Localized<readonly string[]>;
}
