import { SectionId } from '@core/enums/section-id.enum';
import { BackgroundShape } from './background-3d.enum';
import type { OrbitRing, Point2 } from './background-3d.types';

/** Which shape is drawn while each part of the page is on screen. */
export const HERO_SHAPE = BackgroundShape.HexTorus;
export const SHAPE_BY_SECTION: Readonly<Record<SectionId, BackgroundShape>> = {
  [SectionId.Education]: BackgroundShape.NeuralNetwork,
  [SectionId.Projects]: BackgroundShape.HexSphere,
  [SectionId.Certifications]: BackgroundShape.WideNeuralNetwork,
  [SectionId.Contact]: BackgroundShape.Cat,
};

/* Scene */
export const CAMERA_FIELD_OF_VIEW = 40;
export const CAMERA_DISTANCE = 7.2;
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 100;
export const MAX_PIXEL_RATIO = 2;
export const LINE_OPACITY = 0.26;
/** Opacity change per second while shapes cross-fade. */
export const FADE_SPEED = 0.9;
/** Radians per second. */
export const ROTATION_SPEED = 0.12;
export const SHAPE_TILT = 0.7;
export const MAX_FRAME_SECONDS = 0.1;
export const IDLE_TIMEOUT_MS = 1500;

/* Hexagon torus */
export const TORUS_MAJOR_RADIUS = 1.7;
export const TORUS_MINOR_RADIUS = 0.75;
export const TORUS_HEX_COLUMNS = 34;
/** Must be even so alternating hexagon rows wrap around seamlessly. */
export const TORUS_HEX_ROWS = 12;
export const HEX_EDGE_SUBDIVISIONS = 4;

/* Hexagon sphere */
export const SPHERE_RADIUS = 2.2;
export const SPHERE_DETAIL = 3;
export const SPHERE_EDGE_SUBDIVISIONS = 3;

/* Neural networks */
export const NETWORK_LAYER_SIZES: readonly number[] = [4, 7, 9, 7, 3];
export const WIDE_NETWORK_LAYER_SIZES: readonly number[] = [6, 10, 12, 10, 6];
export const NETWORK_LAYER_SPACING = 1.1;
export const NETWORK_BASE_RADIUS = 0.35;
export const NETWORK_RADIUS_PER_NODE = 0.14;
/** Rotates each layer's ring so edges don't line up into flat sheets. */
export const NETWORK_LAYER_TWIST = 0.4;
export const NETWORK_NODE_SIZE = 0.07;

/* Cat: sitting, seen from behind, like the avatar. Right half of the outline, bottom to ear tip to head centre. */
export const CAT_OUTLINE_RIGHT_HALF: readonly Point2[] = [
  [0, -1.1],
  [0.62, -1.1],
  [0.85, -0.85],
  [0.9, -0.4],
  [0.78, 0],
  [0.55, 0.3],
  [0.36, 0.46],
  [0.44, 0.68],
  [0.46, 0.9],
  [0.4, 1.08],
  [0.42, 1.42],
  [0.18, 1.16],
  [0, 1.16],
];
export const CAT_TAIL: readonly Point2[] = [
  [0.7, -1.05],
  [1.1, -0.95],
  [1.35, -0.6],
  [1.4, -0.2],
  [1.25, 0.1],
  [1.05, 0.15],
];
/** Depth slices of the extruded outline: z position and horizontal scale. */
export const CAT_SLICES: readonly Point2[] = [
  [-0.35, 0.85],
  [0, 1],
  [0.35, 0.85],
];
export const CAT_SCALE = 1.5;

/* Ambient layer: faint orbits and dust that stay behind every shape */
export const ORBIT_RINGS: readonly OrbitRing[] = [
  { radius: 4.2, tilt: [1.2, 0.35] },
  { radius: 5.4, tilt: [1.35, -0.5] },
];
export const ORBIT_SEGMENTS = 160;
export const ORBIT_OPACITY = 0.16;
export const DUST_COUNT = 140;
/** Dust sits in a shell between these distances from the centre. */
export const DUST_RADIUS_RANGE: Point2 = [2.5, 7];
export const DUST_SIZE = 0.025;
export const DUST_OPACITY = 0.45;
/** Fixed seed: the dust is scattered the same way on every visit. */
export const DUST_SEED = 47;
/** The ambient layer turns at this fraction of the shape's speed. */
export const AMBIENT_ROTATION_RATIO = 0.25;
