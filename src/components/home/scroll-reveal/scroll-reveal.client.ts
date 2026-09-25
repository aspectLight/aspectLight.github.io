const REVEAL_SELECTOR = '[data-reveal]';
const READY_ATTRIBUTE = 'data-reveal-ready';
const REVEALED_ATTRIBUTE = 'data-revealed';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
/** Fraction of a section that must be visible before it fades in. */
const REVEAL_THRESHOLD = 0.12;

/**
 * Fades sections up as they scroll into view. The hiding CSS only applies once
 * READY_ATTRIBUTE is set here, so without JavaScript nothing is ever hidden.
 */
export function initScrollReveal(doc: Document): void {
  const targets = doc.querySelectorAll<HTMLElement>(REVEAL_SELECTOR);
  const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
  if (targets.length === 0 || prefersReducedMotion || !('IntersectionObserver' in window)) {
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry) => {
          entry.target.setAttribute(REVEALED_ATTRIBUTE, '');
          observer.unobserve(entry.target);
        });
    },
    { threshold: REVEAL_THRESHOLD },
  );
  targets.forEach((target) => {
    observer.observe(target);
  });
  doc.documentElement.setAttribute(READY_ATTRIBUTE, '');
}
