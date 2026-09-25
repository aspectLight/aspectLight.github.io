import { SectionId } from '@core/enums/section-id.enum';
import type { SectionSettings } from '@core/types/section.types';

/** Empty sections stay hidden: an empty heading reads as a missing piece, not a plan. */
export const SECTION_SETTINGS: SectionSettings = {
  [SectionId.Education]: { showWhenEmpty: false },
  [SectionId.Projects]: { showWhenEmpty: false },
  [SectionId.Certifications]: { showWhenEmpty: false },
  [SectionId.Contact]: { showWhenEmpty: true },
};
