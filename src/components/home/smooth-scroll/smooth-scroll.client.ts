import Lenis from 'lenis';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
/** Seconds a wheel gesture takes to settle. */
const SCROLL_DURATION = 1.2;
const EXPO_OUT_STEEPNESS = -10;

/** Fast start, long soft landing: 1 − 2^(−10t), clamped so it reaches 1. */
function easeOutExpo(progress: number): number {
  return Math.min(1, 1.001 - 2 ** (EXPO_OUT_STEEPNESS * progress));
}

/**
 * Replaces the browser's stepped wheel scrolling with an eased, inertial one.
 * Touch scrolling stays native. Skipped entirely when the reader asks for less motion.
 */
export function initSmoothScroll(): void {
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
    return;
  }
  new Lenis({
    duration: SCROLL_DURATION,
    easing: easeOutExpo,
    smoothWheel: true,
    anchors: true,
    autoRaf: true,
  });
}
