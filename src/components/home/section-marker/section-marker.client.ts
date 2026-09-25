import { HERO_ELEMENT_ID } from '@core/constants/site.constants';
import { PageEvent } from '@core/enums/page-event.enum';
import { findCurrentSection, watchCurrentSection } from '@core/sections/watch-current-section';

const LABEL_SELECTOR = '[data-section-marker-label]';
const SECTION_SELECTOR = '[data-marker]';
const LANGUAGE_LINK_SELECTOR = '[data-language-link]';
const MARKER_ATTRIBUTE = 'data-marker';

/** Where the reader was when they switched language: a section and how far into it. */
interface ReadingPosition {
  readonly sectionId: string;
  readonly offset: number;
}

function findSections(doc: Document): HTMLElement[] {
  return [...doc.querySelectorAll<HTMLElement>(SECTION_SELECTOR)];
}

function pageTop(element: HTMLElement): number {
  return element.getBoundingClientRect().top + window.scrollY;
}

/** Keeps the "§ n" label and the language link's section in sync with the reader. */
function followSections(doc: Document): () => void {
  const label = doc.querySelector<HTMLElement>(LABEL_SELECTOR);
  const languageLinks = doc.querySelectorAll<HTMLAnchorElement>(LANGUAGE_LINK_SELECTOR);
  if (label === null) {
    return () => undefined;
  }
  return watchCurrentSection(doc, findSections(doc), (section) => {
    label.textContent = section.getAttribute(MARKER_ATTRIBUTE);
    languageLinks.forEach((link) => {
      link.hash = section.id === HERO_ELEMENT_ID ? '' : section.id;
    });
  });
}

function readPosition(doc: Document): ReadingPosition | undefined {
  const section = findCurrentSection(doc, findSections(doc));
  return section === undefined
    ? undefined
    : { sectionId: section.id, offset: window.scrollY - pageTop(section) };
}

/**
 * Section ids are the same in both languages, so after switching the reader is
 * put back at the same distance into the same section, before the new page is
 * painted, instead of at the top of the section or of the page.
 */
function keepPositionAcrossLanguages(doc: Document): void {
  let pending: ReadingPosition | undefined;
  doc.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest(LANGUAGE_LINK_SELECTOR) !== null) {
      pending = readPosition(doc);
    }
  });
  doc.addEventListener(PageEvent.AfterSwap, () => {
    const section = pending === undefined ? null : doc.getElementById(pending.sectionId);
    if (pending !== undefined && section !== null) {
      window.scrollTo({ top: pageTop(section) + pending.offset, behavior: 'instant' });
    }
    pending = undefined;
  });
}

/**
 * Runs once; re-attaches to the new page after every in-place navigation
 * (the language switch), releasing the old page's listeners first.
 */
export function initSectionMarker(doc: Document): void {
  let stop: () => void = () => undefined;
  keepPositionAcrossLanguages(doc);
  doc.addEventListener(PageEvent.Load, () => {
    stop();
    stop = followSections(doc);
  });
}
