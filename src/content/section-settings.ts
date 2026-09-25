import type { SectionId } from '@sections/sections';
import type { SectionSetting } from '@sections/sections';

export const SECTION_SETTINGS: Readonly<Record<SectionId, SectionSetting>> = {
  education: { showWhenEmpty: false },
  projects: { showWhenEmpty: true },
  certifications: { showWhenEmpty: true },
  contact: { showWhenEmpty: false },
};
