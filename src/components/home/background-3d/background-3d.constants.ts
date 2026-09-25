import { BackgroundShape } from './background-3d.enum';
import type { OrbitRing, Point2, Point3 } from './background-3d.types';

/**
 * The shapes the wireframe morphs through, top of the page to bottom. Scroll
 * position maps evenly onto this list: the hero shows the first, the end of
 * the page the last.
 */
export const SHAPE_SEQUENCE: readonly BackgroundShape[] = [
  BackgroundShape.HexTorus,
  BackgroundShape.NeuralNetwork,
  BackgroundShape.HexSphere,
  BackgroundShape.WideNeuralNetwork,
  BackgroundShape.Cat,
];
/**
 * Fraction of each step spent holding a finished shape before the next morph
 * starts, at each end. 0 morphs continuously; 0.5 would never morph.
 */
export const SHAPE_HOLD = 0.18;

/* Scene */
export const CAMERA_FIELD_OF_VIEW = 40;
export const CAMERA_DISTANCE = 7.2;
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 100;
/** The scene is soft and faint; rendering above 1.5x costs a lot and shows nothing. */
export const MAX_PIXEL_RATIO = 1.5;
export const LINE_OPACITY = 0.26;
/** Seconds for the morph to close most of the gap to the scroll position: the "catch-up" lag. */
export const SCROLL_LAG_SECONDS = 0.45;
export const MAX_FRAME_SECONDS = 0.1;
/** On portrait screens the scene shrinks so shapes fit the narrow width. */
export const PORTRAIT_SCALE = 0.65;
export const IDLE_TIMEOUT_MS = 1500;
/** Morphs smaller than this are skipped, so a still page costs almost nothing. */
export const MORPH_EPSILON = 0.0005;

/* Motion (radians and seconds) */
/**
 * Idle side-to-side turn. A sway rather than a full spin, so every shape faces
 * the reader when it is complete; flat shapes like the cat only read from the front.
 */
export const TURN_SPEED = 0.12;
export const TURN_ANGLE = 0.6;
/** Extra turns around the vertical axis over the whole page; whole turns keep each stop facing front. */
export const SCROLL_SPIN_TURNS = 1;
/** Tilt toward the viewer at the top of the page, easing to none at the bottom. */
export const SHAPE_TILT = 0.55;
export const SWAY_SPEED = 0.15;
export const SWAY_ANGLE = 0.15;
export const ROLL_SPEED = 0.1;
export const ROLL_ANGLE = 0.05;
export const BOB_SPEED = 0.3;
export const BOB_HEIGHT = 0.15;
/** How far the shape drifts up over the whole page. */
export const SCROLL_RISE = 0.45;

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
export const CAT_SCALE = 1.05;

/* Ambient layer: thin orbit rings and dust around every shape */
export const ORBIT_RINGS: readonly OrbitRing[] = [
  { radius: 3.4, opacity: 0.2, baseRotation: [0, 0, 0], spin: [0.1, 0, 0.05] },
  { radius: 3.85, opacity: 0.13, baseRotation: [Math.PI / 3, 0, 0], spin: [0.03, 0.08, 0] },
  { radius: 4.3, opacity: 0.09, baseRotation: [0, Math.PI / 4, 0], spin: [0, 0, 0.12] },
];
export const ORBIT_SEGMENTS = 160;
export const DUST_COUNT = 120;
/** Dust fills a box this size around the centre. */
export const DUST_BOX: Point3 = [12, 12, 6];
export const DUST_SIZE = 0.025;
export const DUST_OPACITY = 0.4;
/** Fixed seed: the dust is scattered the same way on every visit. */
export const DUST_SEED = 47;
export const DUST_SPIN_SPEED = 0.015;
export const DUST_SWAY_SPEED = 0.05;
export const DUST_SWAY_ANGLE = 0.05;
