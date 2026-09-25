import type { Point2, ProximityAnswer } from './background-3d.types';

interface Candidate {
  readonly point: Point2;
  readonly distanceSquared: number;
}

function closestOnSegment([px, py]: Point2, [ax, ay]: Point2, [bx, by]: Point2): Candidate {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;
  const along = lengthSquared === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / lengthSquared;
  const t = Math.min(1, Math.max(0, along));
  const point: Point2 = [ax + t * dx, ay + t * dy];
  return { point, distanceSquared: (px - point[0]) ** 2 + (py - point[1]) ** 2 };
}

/**
 * Which point of a closed polygon's boundary is closest to `query` (Euclidean
 * distance), from inside or outside. This is the only thing a visitor may ask
 * the hidden cat.
 */
export function nearestBoundaryPoint(query: Point2, polygon: readonly Point2[]): ProximityAnswer {
  return polygon.reduce<ProximityAnswer & { readonly distanceSquared: number }>(
    (best, start, edge) => {
      const end = polygon[(edge + 1) % polygon.length] ?? start;
      const candidate = closestOnSegment(query, start, end);
      return candidate.distanceSquared < best.distanceSquared ? { ...candidate, edge } : best;
    },
    { point: query, edge: 0, distanceSquared: Number.POSITIVE_INFINITY },
  );
}
