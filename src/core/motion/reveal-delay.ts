/** Seconds between neighbouring elements fading in, so a block reads top to bottom. */
const REVEAL_STAGGER_SECONDS = 0.08;

/**
 * Inline style that delays an element's scroll reveal by its position in a group.
 * Use it next to `data-reveal`: `<p data-reveal style={revealDelay(2)}>`.
 */
export function revealDelay(order: number): string {
  return `--reveal-delay: ${(order * REVEAL_STAGGER_SECONDS).toFixed(2)}s`;
}
