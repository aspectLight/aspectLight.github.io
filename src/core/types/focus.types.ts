import type { ProjectId } from '@core/enums/project-id.enum';
import type { Localized } from '@core/types/localized.types';

/** One line of the "Currently" block: a subject and what is being done about it. */
export interface FocusItem {
  readonly topic: Localized<string>;
  readonly detail: Localized<string>;
  /** The project entry this item leads to. */
  readonly project: ProjectId;
}
