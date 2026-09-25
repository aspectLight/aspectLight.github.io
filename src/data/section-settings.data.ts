import { SectionId } from '@core/enums/section-id.enum';
import type { SectionSettings } from '@core/types/section.types';

/** Owner decision: Projects and Certifications stay visible while empty. */
export const SECTION_SETTINGS: SectionSettings = {
  [SectionId.Education]: { showWhenEmpty: false },
  [SectionId.Projects]: { showWhenEmpty: true },
  [SectionId.Certifications]: { showWhenEmpty: true },
  [SectionId.Contact]: { showWhenEmpty: true },
};
