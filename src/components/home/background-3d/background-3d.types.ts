export type Point3 = readonly [number, number, number];

export type Point2 = readonly [number, number];

/** A straight line between two points; shapes are lists of these. */
export type Segment = readonly [Point3, Point3];

/** A thin circle of the ambient layer that turns on its own axes. */
export interface OrbitRing {
  readonly radius: number;
  readonly opacity: number;
  /** Starting rotation around X, Y and Z, in radians. */
  readonly baseRotation: Point3;
  /** Rotation speed around X, Y and Z, in radians per second. */
  readonly spin: Point3;
}
