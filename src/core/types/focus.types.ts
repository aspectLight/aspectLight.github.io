import type { Localized } from '@core/types/localized.types';

/** One line of the "Currently" block: a subject and what is being done about it. */
export interface FocusItem {
  readonly topic: Localized<string>;
  readonly detail: Localized<string>;
}
