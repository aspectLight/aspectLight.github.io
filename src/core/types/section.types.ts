import type { SectionId } from '@core/enums/section-id.enum';

export interface SectionSetting {
  readonly showWhenEmpty: boolean;
}

export type SectionSettings = Readonly<Record<SectionId, SectionSetting>>;

export type SectionEntryCounts = Readonly<Record<SectionId, number>>;

export interface VisibleSection {
  readonly id: SectionId;
  readonly number: number;
}
