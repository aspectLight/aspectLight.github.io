import {
  BODY_DEPTH,
  CAT_OUTLINE_RIGHT_HALF,
  CAT_SCALE,
  CAT_TAIL,
  LAYER_COUNT,
  LAYER_RANGE,
  NETWORK_SEED,
  NEURON_MARGIN,
  NEURON_SPACING,
  SYNAPSE_REACH,
} from './background-3d.constants';
import { createRandom } from './background-3d.random';
import type { CatNetwork, Point2, Point3 } from './background-3d.types';

/** A neuron before it is placed in 3D: outline coordinates and its layer. */
interface PlannedNeuron {
  readonly x: number;
  readonly y: number;
  readonly layer: number;
}

/** The full silhouette: the right half, then the left half mirrored back to the start. */
function catOutline(): Point2[] {
  // The half's end points sit on the centre line; dropping them joins the two
  // halves of the base and of the head top into single edges, so every edge a
  // visitor can uncover is one straight side of the cat.
  const rightHalf = CAT_OUTLINE_RIGHT_HALF.slice(1, -1);
  const leftHalf = rightHalf.toReversed().map(([x, y]): Point2 => [-x, y]);
  return [...rightHalf, ...leftHalf];
}

/** Where a horizontal line at height `y` crosses the outline, left to right. */
function crossings(outline: readonly Point2[], y: number): number[] {
  return outline
    .flatMap((from, index) => {
      const to = outline[(index + 1) % outline.length] ?? from;
      const crosses = (from[1] <= y && to[1] > y) || (to[1] <= y && from[1] > y);
      return crosses ? [from[0] + ((y - from[1]) / (to[1] - from[1])) * (to[0] - from[0])] : [];
    })
    .sort((a, b) => a - b);
}

/** Inside-the-cat spans of one layer; the ears give two separate spans. */
function spans(outline: readonly Point2[], y: number): Point2[] {
  const xs = crossings(outline, y);
  return Array.from({ length: Math.floor(xs.length / 2) }, (_, index): Point2 => [
    (xs[index * 2] ?? 0) + NEURON_MARGIN,
    (xs[index * 2 + 1] ?? 0) - NEURON_MARGIN,
  ]).filter(([left, right]) => right >= left);
}

/** Evenly spaced positions across a span; a span too narrow for two gets one, centred. */
function spread([left, right]: Point2): number[] {
  const count = Math.max(1, Math.floor((right - left) / NEURON_SPACING) + 1);
  const step = count > 1 ? (right - left) / (count - 1) : 0;
  const start = count > 1 ? left : (left + right) / 2;
  return Array.from({ length: count }, (_, index) => start + index * step);
}

function planLayers(outline: readonly Point2[]): PlannedNeuron[] {
  const [bottom, top] = LAYER_RANGE;
  return Array.from({ length: LAYER_COUNT }, (_, layer) => {
    const y = bottom + ((top - bottom) * layer) / (LAYER_COUNT - 1);
    return spans(outline, y).flatMap((span) => spread(span).map((x) => ({ x, y, layer })));
  }).flat();
}

/** Each neuron feeds the neurons of the layer above that sit within reach. */
function connectLayers(planned: readonly PlannedNeuron[]): [number, number][] {
  return planned.flatMap((from, fromIndex) =>
    planned.flatMap((to, toIndex): [number, number][] =>
      to.layer === from.layer + 1 && Math.abs(to.x - from.x) <= SYNAPSE_REACH
        ? [[fromIndex, toIndex]]
        : [],
    ),
  );
}

/** Pushes neurons forward or back so the body reads as rounded when it turns. */
function placeInDepth(planned: readonly PlannedNeuron[], outline: readonly Point2[]): Point3[] {
  const random = createRandom(NETWORK_SEED);
  return planned.map(({ x, y }) => {
    const xs = crossings(outline, y);
    const halfWidth = ((xs.at(-1) ?? 0) - (xs.at(0) ?? 0)) / 2;
    const z = (random() * 2 - 1) * halfWidth * BODY_DEPTH;
    return [x * CAT_SCALE, y * CAT_SCALE, z * CAT_SCALE];
  });
}

/** The tail as a chain of neurons, fed by the bottom-layer neuron closest to its root. */
function addTail(
  neurons: readonly Point3[],
  planned: readonly PlannedNeuron[],
): { neurons: Point3[]; synapses: [number, number][] } {
  const tail = CAT_TAIL.map(([x, y]): Point3 => [x * CAT_SCALE, y * CAT_SCALE, 0]);
  const first = neurons.length;
  const [rootX] = CAT_TAIL[0] ?? [0, 0];
  const root = planned.reduce(
    (best, neuron, index) =>
      neuron.layer === 0 &&
      Math.abs(neuron.x - rootX) < Math.abs((planned[best]?.x ?? Infinity) - rootX)
        ? index
        : best,
    0,
  );
  const chain = tail
    .slice(1)
    .map((_, index): [number, number] => [first + index, first + index + 1]);
  return { neurons: [...neurons, ...tail], synapses: [[root, first], ...chain] };
}

/**
 * The avatar's cat drawn as a neural network: layers of neurons filling the
 * silhouette from the paws to the ears, each feeding the layer above.
 */
export function buildCatNetwork(): CatNetwork {
  const outline = catOutline();
  const planned = planLayers(outline);
  const body = placeInDepth(planned, outline);
  const tail = addTail(body, planned);
  return {
    neurons: tail.neurons,
    synapses: [...connectLayers(planned), ...tail.synapses],
    inputs: planned.flatMap((neuron, index) => (neuron.layer === 0 ? [index] : [])),
    outline: outline.map(([x, y]): Point3 => [x * CAT_SCALE, y * CAT_SCALE, 0]),
  };
}
