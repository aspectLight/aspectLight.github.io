const REVEAL_SELECTOR = '[data-reveal]';
const READY_ATTRIBUTE = 'data-reveal-ready';
const ACTIVE_ATTRIBUTE = 'data-reveal-active';
const REVEALED_ATTRIBUTE = 'data-revealed';
/** Elements start fading in once they are this far inside the bottom of the viewport. */
const REVEAL_ROOT_MARGIN = '0px 0px -60px 0px';

/**
 * Fades, lifts and un-blurs each `[data-reveal]` element the first time it
 * scrolls into view. The hidden state is switched on by the inline script in
 * ScrollReveal.astro; this only runs when that script decided motion is wanted.
 */
export function initScrollReveal(doc: Document): void {
  const root = doc.documentElement;
  if (!root.hasAttribute(READY_ATTRIBUTE)) {
    return;
  }
  root.setAttribute(ACTIVE_ATTRIBUTE, '');
  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry) => {
          entry.target.setAttribute(REVEALED_ATTRIBUTE, '');
          observer.unobserve(entry.target);
        });
    },
    { rootMargin: REVEAL_ROOT_MARGIN },
  );
  doc.querySelectorAll(REVEAL_SELECTOR).forEach((target) => {
    observer.observe(target);
  });
}
