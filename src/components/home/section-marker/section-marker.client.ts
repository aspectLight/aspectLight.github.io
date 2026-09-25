import { HERO_ELEMENT_ID } from '@core/constants/site.constants';
import { watchCurrentSection } from '@core/sections/watch-current-section';

const LABEL_SELECTOR = '[data-section-marker-label]';
const SECTION_SELECTOR = '[data-marker]';
const LANGUAGE_LINK_SELECTOR = '[data-language-link]';
const MARKER_ATTRIBUTE = 'data-marker';

/**
 * Keeps the floating "§ n" marker in sync with the section being read, and
 * points the language switch at that same section: ids are identical in both
 * languages, so switching keeps the reader's place.
 */
export function initSectionMarker(doc: Document): void {
  const label = doc.querySelector<HTMLElement>(LABEL_SELECTOR);
  const sections = [...doc.querySelectorAll<HTMLElement>(SECTION_SELECTOR)];
  const languageLinks = doc.querySelectorAll<HTMLAnchorElement>(LANGUAGE_LINK_SELECTOR);
  if (label === null) {
    return;
  }
  watchCurrentSection(doc, sections, (section) => {
    label.textContent = section.getAttribute(MARKER_ATTRIBUTE);
    languageLinks.forEach((link) => {
      link.hash = section.id === HERO_ELEMENT_ID ? '' : section.id;
    });
  });
}
