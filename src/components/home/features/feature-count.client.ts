const COUNTER_SELECTOR = '[data-count-to]';
const COUNT_TARGET_ATTRIBUTE = 'data-count-to';
/** Set by ScrollReveal.astro when the reader has not asked for less motion. */
const MOTION_ATTRIBUTE = 'data-reveal-ready';
const COUNT_DURATION_MS = 1000;
const EXPO_OUT_STEEPNESS = -10;

function easeOutExpo(progress: number): number {
  return progress >= 1 ? 1 : 1 - 2 ** (EXPO_OUT_STEEPNESS * progress);
}

function countUp(counter: HTMLElement, target: number): void {
  const startedAt = performance.now();
  const step = (now: number): void => {
    const progress = Math.min((now - startedAt) / COUNT_DURATION_MS, 1);
    counter.textContent = String(Math.round(target * easeOutExpo(progress)));
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

/**
 * Counts each figure up from zero the first time it scrolls into view. The
 * page ships the final numbers, so without JavaScript or with reduced motion
 * they are simply shown; screen readers always get the final value.
 */
export function initFeatureCount(doc: Document): void {
  if (!doc.documentElement.hasAttribute(MOTION_ATTRIBUTE)) {
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries
      .filter((entry) => entry.isIntersecting)
      .forEach((entry) => {
        observer.unobserve(entry.target);
        if (entry.target instanceof HTMLElement) {
          countUp(entry.target, Number(entry.target.getAttribute(COUNT_TARGET_ATTRIBUTE)));
        }
      });
  });
  doc.querySelectorAll<HTMLElement>(COUNTER_SELECTOR).forEach((counter) => {
    counter.textContent = '0';
    observer.observe(counter);
  });
}
