export type Point3 = readonly [number, number, number];

export type Point2 = readonly [number, number];

/** A straight line between two points; shapes are lists of these. */
export type Segment = readonly [Point3, Point3];

/** A circle of the ambient layer, tilted around the X and Z axes (radians). */
export interface OrbitRing {
  readonly radius: number;
  readonly tilt: Point2;
}
