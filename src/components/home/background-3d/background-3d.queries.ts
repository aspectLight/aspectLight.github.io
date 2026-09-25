import { nearestBoundaryPoint } from './background-3d.proximity';
import type { Point2 } from './background-3d.types';

/** The most recent query, drawn as a fading line from where the visitor clicked. */
interface QueryLine {
  readonly from: Point2;
  readonly to: Point2;
  /** Seconds since it was asked. */
  age: number;
}

/** What the visitor has learned about the cat's outline so far. */
export interface QueryState {
  readonly outline: readonly Point2[];
  /** Edges of the outline that some answer landed on. */
  readonly found: Set<number>;
  /** Every boundary point returned so far, oldest first. */
  readonly samples: Point2[];
  count: number;
  /** The query that uncovered the last edge; the count shown stops there. */
  reconstructedAfter: number | undefined;
  latest: QueryLine | undefined;
}

/** Counts shown to the visitor. */
export interface QuerySummary {
  readonly queries: number;
  readonly foundEdges: number;
  readonly totalEdges: number;
  readonly reconstructedAfter: number | undefined;
}

export function createQueryState(outline: readonly Point2[]): QueryState {
  return {
    outline,
    found: new Set(),
    samples: [],
    count: 0,
    reconstructedAfter: undefined,
    latest: undefined,
  };
}

/** Asks the outline for its closest point to `query`, and records what that reveals. */
export function askProximity(state: QueryState, query: Point2, maxSamples: number): void {
  const answer = nearestBoundaryPoint(query, state.outline);
  state.count += 1;
  state.found.add(answer.edge);
  state.samples.push(answer.point);
  if (state.samples.length > maxSamples) {
    state.samples.shift();
  }
  state.latest = { from: query, to: answer.point, age: 0 };
  if (state.reconstructedAfter === undefined && state.found.size === state.outline.length) {
    state.reconstructedAfter = state.count;
  }
}

export function summarize(state: QueryState): QuerySummary {
  return {
    queries: state.count,
    foundEdges: state.found.size,
    totalEdges: state.outline.length,
    reconstructedAfter: state.reconstructedAfter,
  };
}

export function isReconstructed(summary: QuerySummary): boolean {
  return summary.reconstructedAfter !== undefined;
}

/** Endpoints of every found edge, flattened for a LineSegments buffer. Returns the vertex count. */
export function writeFoundEdges(state: QueryState, output: Float32Array): number {
  let vertex = 0;
  state.found.forEach((edge) => {
    const start = state.outline[edge];
    const end = state.outline[(edge + 1) % state.outline.length];
    [start, end].forEach((point) => {
      output.set([point?.[0] ?? 0, point?.[1] ?? 0, 0], vertex * 3);
      vertex += 1;
    });
  });
  return vertex;
}

/** Every sample point, flattened for a Points buffer. Returns the point count. */
export function writeSamples(state: QueryState, output: Float32Array): number {
  state.samples.forEach(([x, y], index) => {
    output.set([x, y, 0], index * 3);
  });
  return state.samples.length;
}
