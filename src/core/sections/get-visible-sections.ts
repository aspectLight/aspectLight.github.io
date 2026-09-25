import { SECTION_ORDER } from '@core/constants/site.constants';
import type {
  SectionEntryCounts,
  SectionSettings,
  VisibleSection,
} from '@core/types/section.types';

/**
 * Sections with entries are always shown; empty ones only when their setting allows it.
 * Numbering closes up when a section is hidden (1, 2, 3 — never 1, 3, 4).
 */
export function getVisibleSections(
  entryCounts: SectionEntryCounts,
  settings: SectionSettings,
): readonly VisibleSection[] {
  return SECTION_ORDER.filter((id) => entryCounts[id] > 0 || settings[id].showWhenEmpty).map(
    (id, index) => ({ id, number: index + 1 }),
  );
}
