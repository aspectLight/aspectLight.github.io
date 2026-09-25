import { IDLE_TIMEOUT_MS } from './background-3d.constants';

const CANVAS_SELECTOR = '[data-background-3d]';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function supportsWebGl(doc: Document): boolean {
  if (!('WebGLRenderingContext' in window)) {
    return false;
  }
  const probe = doc.createElement('canvas');
  return probe.getContext('webgl2') !== null || probe.getContext('webgl') !== null;
}

function whenIdle(task: () => void): void {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(task, { timeout: IDLE_TIMEOUT_MS });
  } else {
    setTimeout(task, 0);
  }
}

/**
 * Loads Three.js only after the page is idle, so the text renders first.
 * Without WebGL, or if loading fails, the canvas is removed and the page
 * stays as it is: plain paper.
 */
export function initBackground3d(doc: Document): void {
  const canvas = doc.querySelector<HTMLCanvasElement>(CANVAS_SELECTOR);
  if (canvas === null) {
    return;
  }
  if (!supportsWebGl(doc)) {
    canvas.remove();
    return;
  }
  const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
  whenIdle(() => {
    import('./background-3d.scene')
      .then(({ startBackgroundScene }) => {
        startBackgroundScene(canvas, doc, prefersReducedMotion);
      })
      .catch(() => {
        canvas.remove();
      });
  });
}
