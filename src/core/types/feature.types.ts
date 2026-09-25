import type { Localized } from '@core/types/localized.types';

/** A headline number in the "Feature xₙ." row under the title block. */
export interface Feature {
  readonly value: number;
  readonly description: Localized<string>;
}
