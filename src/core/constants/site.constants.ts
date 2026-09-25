import { SectionId } from '@core/enums/section-id.enum';

/** The order sections appear in on the home page. */
export const SECTION_ORDER: readonly SectionId[] = [
  SectionId.Education,
  SectionId.Projects,
  SectionId.Certifications,
  SectionId.Contact,
];

/** Element id of the title block; the section marker and the 3D background track it. */
export const HERO_ELEMENT_ID = 'abstract';

/** Marker shown while the title block is on screen (sections show "§ n"). */
export const HERO_MARKER = '§ 0.1';

/** Where the reader is assumed to be looking, as a fraction of the viewport height from the top. */
export const READING_LINE = 0.45;
