import type { QuerySummary } from './background-3d.types';

const READOUT_SELECTOR = '[data-query-readout]';
const VISIBLE_ATTRIBUTE = 'data-visible';
/** Localized words, rendered by Background3D.astro into these attributes. */
const LABEL_ATTRIBUTES = {
  query: 'data-label-query',
  queries: 'data-label-queries',
  edges: 'data-label-edges',
  reconstructed: 'data-label-reconstructed',
} as const;

function label(readout: Element, attribute: string): string {
  return readout.getAttribute(attribute) ?? '';
}

function queries(readout: Element, count: number): string {
  const noun = label(readout, count === 1 ? LABEL_ATTRIBUTES.query : LABEL_ATTRIBUTES.queries);
  return `${String(count)} ${noun}`;
}

function describe(readout: Element, summary: QuerySummary): string {
  if (summary.reconstructedAfter !== undefined) {
    return `${label(readout, LABEL_ATTRIBUTES.reconstructed)} ${queries(readout, summary.reconstructedAfter)}`;
  }
  const edges = `${String(summary.foundEdges)}/${String(summary.totalEdges)}`;
  return `${queries(readout, summary.queries)} · ${edges} ${label(readout, LABEL_ATTRIBUTES.edges)}`;
}

/**
 * Shows the running totals ("3 queries · 9/22 edges", then "reconstructed in
 * 17 queries"). Hidden until the first query, so it only exists for visitors
 * who found the interaction; re-rendered after a language switch.
 */
export function renderReadout(doc: Document, summary: QuerySummary): void {
  const readout = doc.querySelector(READOUT_SELECTOR);
  if (readout === null) {
    return;
  }
  readout.textContent = describe(readout, summary);
  readout.setAttribute(VISIBLE_ATTRIBUTE, '');
}
