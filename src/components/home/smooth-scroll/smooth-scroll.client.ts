import Lenis from 'lenis';

import { PageEvent } from '@core/enums/page-event.enum';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
/** Links to a place on this same page: "#projects", "#contact", "#content". */
const IN_PAGE_LINK_SELECTOR = 'a[href^="#"]';
/** Seconds a wheel gesture takes to settle. */
const SCROLL_DURATION = 1.2;
const EXPO_OUT_STEEPNESS = -10;
const PRIMARY_BUTTON = 0;

/** Fast start, long soft landing: 1 − 2^(−10t), clamped so it reaches 1. */
function easeOutExpo(progress: number): number {
  return Math.min(1, 1.001 - 2 ** (EXPO_OUT_STEEPNESS * progress));
}

function createLenis(): Lenis {
  return new Lenis({
    duration: SCROLL_DURATION,
    easing: easeOutExpo,
    smoothWheel: true,
    autoRaf: true,
  });
}

/** The element a plain click on an in-page link points to, if any. */
function inPageTarget(event: MouseEvent, doc: Document): HTMLElement | null {
  const hasModifier = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
  if (event.defaultPrevented || event.button !== PRIMARY_BUTTON || hasModifier) {
    return null;
  }
  const link =
    event.target instanceof Element
      ? event.target.closest<HTMLAnchorElement>(IN_PAGE_LINK_SELECTOR)
      : null;
  const id = link === null ? '' : decodeURIComponent(link.hash.slice(1));
  return id === '' ? null : doc.getElementById(id);
}

/** Keyboard and screen-reader users continue from where the link led, not from the link. */
function moveFocus(target: HTMLElement): void {
  if (!target.hasAttribute('tabindex')) {
    target.setAttribute('tabindex', '-1');
  }
  target.focus({ preventScroll: true });
}

/**
 * Replaces the browser's stepped wheel scrolling with an eased, inertial one
 * (touch scrolling stays native; nothing is smoothed when the reader asks for
 * less motion), and takes charge of in-page links.
 *
 * In-page links need a single owner: left alone, Astro's router and Lenis both
 * react to the same click and cancel each other out, so the URL changes but
 * the page does not move. This listener runs first (capture phase), scrolls to
 * the target itself and marks the click handled, which the router respects.
 *
 * An in-place navigation replaces the <html> attributes Lenis relies on, so
 * Lenis is rebuilt after each one, starting from the new scroll position.
 */
export function initSmoothScroll(doc: Document): void {
  const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
  let lenis = prefersReducedMotion ? undefined : createLenis();
  doc.addEventListener(
    'click',
    (event) => {
      const target = inPageTarget(event, doc);
      if (target === null) {
        return;
      }
      event.preventDefault();
      history.replaceState(history.state, '', `#${target.id}`);
      if (lenis === undefined) {
        target.scrollIntoView();
      } else {
        // Lenis, like scrollIntoView, honours the target's scroll-margin itself.
        lenis.scrollTo(target);
      }
      moveFocus(target);
    },
    { capture: true },
  );
  doc.addEventListener(PageEvent.AfterSwap, () => {
    if (lenis !== undefined) {
      lenis.destroy();
      lenis = createLenis();
    }
  });
}
