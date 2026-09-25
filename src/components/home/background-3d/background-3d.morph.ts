import { SHAPE_HOLD } from './background-3d.constants';

interface MorphStep {
  readonly fromIndex: number;
  readonly toIndex: number;
  /** 0 = fully `fromIndex`, 1 = fully `toIndex`, already eased. */
  readonly blend: number;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/** Slow at both ends, fast in the middle. */
function smoothstep(value: number): number {
  return value * value * (3 - 2 * value);
}

/**
 * Which two shapes a page progress (0 to 1) sits between, and how far along.
 * Each step holds its finished shape for SHAPE_HOLD at both ends, so every
 * shape is readable for a while before it starts to change.
 */
function morphStep(progress: number, shapeCount: number): MorphStep {
  const steps = shapeCount - 1;
  const position = clamp01(progress) * steps;
  const fromIndex = Math.min(Math.floor(position), steps - 1);
  const local = position - fromIndex;
  const held = clamp01((local - SHAPE_HOLD) / (1 - 2 * SHAPE_HOLD));
  return { fromIndex, toIndex: fromIndex + 1, blend: smoothstep(held) };
}

/** Writes the vertex positions for `progress` into `output` (a Three.js position buffer). */
export function writeMorph(
  output: Float32Array,
  targets: readonly Float32Array[],
  progress: number,
): void {
  const { fromIndex, toIndex, blend } = morphStep(progress, targets.length);
  const from = targets[fromIndex];
  const to = targets[toIndex];
  if (from === undefined || to === undefined) {
    return;
  }
  for (let index = 0; index < output.length; index += 1) {
    const start = from[index] ?? 0;
    output[index] = start + ((to[index] ?? 0) - start) * blend;
  }
}

/** How far down the page the reader is, from 0 (top) to 1 (bottom). */
export function readScrollProgress(doc: Document): number {
  const scrollable = doc.documentElement.scrollHeight - window.innerHeight;
  return scrollable > 0 ? clamp01(window.scrollY / scrollable) : 0;
}
