import { MAX_SAMPLES, QUERY_LINE_SECONDS } from './background-3d.constants';
import { nearestBoundaryPoint } from './background-3d.proximity';
import type { Point2, QuerySummary } from './background-3d.types';

/** The most recent query: the point clicked and the answer it got. */
interface QueryLine {
  readonly from: Point2;
  readonly to: Point2;
  /** Seconds since it was asked. */
  age: number;
}

export function isReconstructed(summary: QuerySummary): boolean {
  return summary.reconstructedAfter !== undefined;
}

/** Everything the visitor's proximity queries have revealed about the cat's outline. */
export class QueryLog {
  /** Edges of the outline that some answer landed on. */
  private readonly found = new Set<number>();
  /** Every boundary point returned so far, oldest first. */
  private readonly samples: Point2[] = [];
  private count = 0;
  /** The query that uncovered the last edge; the count shown stops there. */
  private reconstructedAfter: number | undefined;
  private latest: QueryLine | undefined;

  constructor(private readonly outline: readonly Point2[]) {}

  /** Asks the outline for its closest point to `query`, and records what that reveals. */
  ask(query: Point2): void {
    const answer = nearestBoundaryPoint(query, this.outline);
    this.count += 1;
    this.found.add(answer.edge);
    this.samples.push(answer.point);
    if (this.samples.length > MAX_SAMPLES) {
      this.samples.shift();
    }
    this.latest = { from: query, to: answer.point, age: 0 };
    if (this.reconstructedAfter === undefined && this.found.size === this.outline.length) {
      this.reconstructedAfter = this.count;
    }
  }

  summary(): QuerySummary {
    return {
      queries: this.count,
      foundEdges: this.found.size,
      totalEdges: this.outline.length,
      reconstructedAfter: this.reconstructedAfter,
    };
  }

  /** Ages the latest answer; a step of Infinity ends its life at once. */
  age(seconds: number): void {
    if (this.latest !== undefined) {
      this.latest.age += seconds;
    }
  }

  /** How much of the latest answer's life is left, from 1 (just asked) to 0 (gone). */
  latestLife(): number {
    return this.latest === undefined ? 0 : Math.max(0, 1 - this.latest.age / QUERY_LINE_SECONDS);
  }

  /** Writes the latest click and its answer into `output`. Returns the vertex count. */
  writeLatestLine(output: Float32Array): number {
    if (this.latest === undefined) {
      return 0;
    }
    output.set([...this.latest.from, 0, ...this.latest.to, 0]);
    return 2;
  }

  /** Endpoints of every found edge, for a LineSegments buffer. Returns the vertex count. */
  writeFoundEdges(output: Float32Array): number {
    let vertex = 0;
    this.found.forEach((edge) => {
      const start = this.outline[edge];
      const end = this.outline[(edge + 1) % this.outline.length];
      [start, end].forEach((point) => {
        output.set([point?.[0] ?? 0, point?.[1] ?? 0, 0], vertex * 3);
        vertex += 1;
      });
    });
    return vertex;
  }

  /** Every answer point, for a Points buffer. Returns the point count. */
  writeSamples(output: Float32Array): number {
    this.samples.forEach(([x, y], index) => {
      output.set([x, y, 0], index * 3);
    });
    return this.samples.length;
  }
}
