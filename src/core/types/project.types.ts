import type { ProjectId } from '@core/enums/project-id.enum';
import type { HttpsUrl } from '@core/types/formats.types';
import type { Localized } from '@core/types/localized.types';

export interface ProjectEntry {
  readonly id: ProjectId;
  readonly title: Localized<string>;
  /** What was built and how, in plain sentences. */
  readonly summary: Localized<string>;
  /** Academic term or span, as precise as the facts allow: "Fall 2025". */
  readonly period: Localized<string>;
  /** Where it was done and with whom. */
  readonly context: Localized<string>;
  readonly sourceUrl?: HttpsUrl;
  readonly demoUrl?: HttpsUrl;
}
