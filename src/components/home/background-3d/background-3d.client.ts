import { PageEvent } from '@core/enums/page-event.enum';
import { IDLE_TIMEOUT_MS } from './background-3d.constants';
import { renderReadout } from './background-3d.readout';
import type { BackgroundScene } from './background-3d.scene';
import type { QuerySummary } from './background-3d.types';

const CANVAS_SELECTOR = '[data-background-3d]';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
/** Clicks on these do their own job and never count as a question to the cat. */
const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, label, summary, [role="button"], [contenteditable]';
const PRIMARY_BUTTON = 0;

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

/** After the page (fonts, avatar) has finished loading, so Three.js never competes with it. */
function afterLoad(doc: Document, task: () => void): void {
  if (doc.readyState === 'complete') {
    task();
  } else {
    window.addEventListener('load', task, { once: true });
  }
}

/** Primary button, no modifier keys, not already handled by something else. */
function isPlainClick(event: MouseEvent): boolean {
  const hasModifier = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
  return event.button === PRIMARY_BUTTON && !event.defaultPrevented && !hasModifier;
}

/** Not on anything interactive, and not the end of a text selection. */
function isOnEmptySpace(event: MouseEvent, doc: Document): boolean {
  const onInteractive =
    !(event.target instanceof Element) || event.target.closest(INTERACTIVE_SELECTOR) !== null;
  const isSelecting = !(doc.getSelection()?.isCollapsed ?? true);
  return !onInteractive && !isSelecting;
}

function isQueryClick(event: MouseEvent, doc: Document): boolean {
  return isPlainClick(event) && isOnEmptySpace(event, doc);
}

/** Turns clicks on empty space into proximity queries, and keeps the readout current. */
function listenForQueries(doc: Document, background: BackgroundScene): void {
  let latest: QuerySummary | undefined;
  doc.addEventListener('click', (event) => {
    if (!isQueryClick(event, doc)) {
      return;
    }
    latest = background.ask(event.clientX, event.clientY) ?? latest;
    if (latest !== undefined) {
      renderReadout(doc, latest);
    }
  });
  doc.addEventListener(PageEvent.Load, () => {
    if (latest !== undefined) {
      renderReadout(doc, latest);
    }
  });
}

/**
 * Loads Three.js only once the page has loaded and the browser is idle, so the
 * text and the avatar come first.
 * Without WebGL, or if loading fails, the canvas is removed and the page
 * stays as it is: plain paper, and clicks do nothing extra.
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
  afterLoad(doc, () => {
    whenIdle(() => {
      import('./background-3d.scene')
        .then(({ BackgroundScene }) => {
          const background = new BackgroundScene(canvas, doc, prefersReducedMotion);
          background.start();
          listenForQueries(doc, background);
        })
        .catch(() => {
          canvas.remove();
        });
    });
  });
}
