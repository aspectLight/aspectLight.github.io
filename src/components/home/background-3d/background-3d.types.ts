import type { CanvasTexture, Color } from 'three';

export type Point3 = readonly [number, number, number];

export type Point2 = readonly [number, number];

/** Neurons, directed synapses between them (by index) and the silhouette they sit in. */
export interface CatNetwork {
  readonly neurons: readonly Point3[];
  readonly synapses: readonly (readonly [number, number])[];
  /** Where signals start: the bottom layer. */
  readonly inputs: readonly number[];
  readonly outline: readonly Point3[];
}

/** What every material is drawn with: the accent colour, and a round dot for points. */
export interface Palette {
  readonly color: Color;
  readonly dot: CanvasTexture;
}

/** The answer to a proximity query: the closest boundary point, and the edge it lies on. */
export interface ProximityAnswer {
  readonly point: Point2;
  /** Index of the edge from vertex `edge` to vertex `edge + 1` (wrapping). */
  readonly edge: number;
}

/** Counts shown to the visitor in the query readout. */
export interface QuerySummary {
  readonly queries: number;
  readonly foundEdges: number;
  readonly totalEdges: number;
  /** The query that uncovered the last edge, once the whole outline is known. */
  readonly reconstructedAfter: number | undefined;
}
