export type Point3 = readonly [number, number, number];

export type Point2 = readonly [number, number];

/** A thin circle of the ambient layer that turns on its own axes. */
export interface OrbitRing {
  readonly radius: number;
  readonly opacity: number;
  /** Starting rotation around X, Y and Z, in radians. */
  readonly baseRotation: Point3;
  /** Rotation speed around X, Y and Z, in radians per second. */
  readonly spin: Point3;
}

/** Neurons, directed synapses between them (by index) and the silhouette they sit in. */
export interface CatNetwork {
  readonly neurons: readonly Point3[];
  readonly synapses: readonly (readonly [number, number])[];
  /** Where signals start: the bottom layer. */
  readonly inputs: readonly number[];
  readonly outline: readonly Point3[];
}
