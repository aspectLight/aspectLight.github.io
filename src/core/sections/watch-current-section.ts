import { READING_LINE } from '@core/constants/site.constants';

/** Rounding slack, in pixels, when checking whether the page is scrolled to the end. */
const BOTTOM_TOLERANCE = 2;

function isScrolledToBottom(doc: Document): boolean {
  return window.scrollY + window.innerHeight >= doc.documentElement.scrollHeight - BOTTOM_TOLERANCE;
}

/**
 * The last element whose top has passed the reading line. At the very end of the
 * page the last element wins, because a short final section never reaches the line.
 */
export function findCurrentSection<T extends Element>(
  doc: Document,
  elements: readonly T[],
): T | undefined {
  if (isScrolledToBottom(doc)) {
    return elements.at(-1);
  }
  const line = window.innerHeight * READING_LINE;
  return elements.findLast((element) => element.getBoundingClientRect().top <= line) ?? elements[0];
}

/**
 * Calls `onChange` with the element being read, now and whenever it changes.
 * `elements` must be in document order. Recomputed from the layout on every
 * scroll frame, so a fast jump can never leave it stale. Returns a function
 * that stops watching (call it before the page content is replaced).
 */
export function watchCurrentSection<T extends Element>(
  doc: Document,
  elements: readonly T[],
  onChange: (element: T) => void,
): () => void {
  let current: T | undefined;
  let isFramePending = false;
  const update = (): void => {
    isFramePending = false;
    const next = findCurrentSection(doc, elements);
    if (next !== undefined && next !== current) {
      current = next;
      onChange(next);
    }
  };
  const scheduleUpdate = (): void => {
    if (!isFramePending) {
      isFramePending = true;
      window.requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  update();
  return () => {
    window.removeEventListener('scroll', scheduleUpdate);
    window.removeEventListener('resize', scheduleUpdate);
  };
}
