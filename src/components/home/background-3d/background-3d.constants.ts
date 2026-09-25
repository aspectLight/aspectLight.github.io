import type { OrbitRing, Point2, Point3 } from './background-3d.types';

/* Scene */
export const CAMERA_FIELD_OF_VIEW = 40;
export const CAMERA_DISTANCE = 7.2;
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 100;
/** The scene is soft and faint; rendering above 1.5x costs a lot and shows nothing. */
export const MAX_PIXEL_RATIO = 1.5;
export const MAX_FRAME_SECONDS = 0.1;
/** On portrait screens the scene shrinks so the cat fits the narrow width. */
export const PORTRAIT_SCALE = 0.65;
export const IDLE_TIMEOUT_MS = 1500;

/* Motion (radians and seconds): a slow sway so the depth shows; the shape never changes */
export const TURN_SPEED = 0.12;
export const TURN_ANGLE = 0.45;
export const SWAY_SPEED = 0.15;
export const SWAY_ANGLE = 0.1;
export const BOB_SPEED = 0.3;
export const BOB_HEIGHT = 0.08;

/*
 * The cat from the avatar: sitting, seen from behind. Right half of the outline,
 * from the bottom centre to the ear tip to the top of the head; the left half is its mirror.
 */
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
/** Silhouette size in world units. */
export const CAT_SCALE = 1.3;

/* The network inside the cat: layers of neurons from the paws up to the ears */
export const LAYER_COUNT = 11;
/** Height of the lowest and highest layer, in outline units (the outline spans -1.1 to 1.42). */
export const LAYER_RANGE: Point2 = [-0.98, 1.22];
/** Horizontal distance between neighbouring neurons in a layer, in outline units. */
export const NEURON_SPACING = 0.26;
/** Neurons keep this far inside the silhouette. */
export const NEURON_MARGIN = 0.05;
/** A neuron connects to every neuron of the next layer within this horizontal distance. */
export const SYNAPSE_REACH = 0.42;
/** Depth of the body at its widest, as a fraction of its width. */
export const BODY_DEPTH = 0.55;
export const NETWORK_SEED = 7;

/* Look */
export const SYNAPSE_OPACITY = 0.2;
/** The outline starts faint: its edges are what the visitor can uncover. */
export const OUTLINE_OPACITY = 0.12;
export const NEURON_SIZE = 0.08;
export const NEURON_OPACITY = 0.75;

/* Signals travelling up the network, like a forward pass */
export const PULSE_COUNT = 22;
/** Synapses crossed per second. */
export const PULSE_SPEED = 0.9;
export const PULSE_SIZE = 0.13;
export const PULSE_OPACITY = 0.95;
export const PULSE_SEED = 13;

/* Proximity queries: a click on empty space asks the cat for its closest boundary point */
/** Edges an answer has landed on. */
export const FOUND_EDGE_OPACITY = 0.6;
/** Extra opacity on every edge for a moment once the whole outline is found. */
export const RECONSTRUCTED_GLOW = 0.4;
export const RECONSTRUCTED_GLOW_SECONDS = 1.6;
export const QUERY_LINE_OPACITY = 0.7;
/** How long the line from the click to the answer stays before it has faded out. */
export const QUERY_LINE_SECONDS = 2.4;
export const SAMPLE_SIZE = 0.07;
export const SAMPLE_OPACITY = 0.85;
/** Oldest answers are dropped past this many, so memory stays bounded. */
export const MAX_SAMPLES = 200;

/* Ambient layer: thin orbit rings and dust around the cat */
export const ORBIT_RINGS: readonly OrbitRing[] = [
  { radius: 3.4, opacity: 0.2, baseRotation: [0, 0, 0], spin: [0.1, 0, 0.05] },
  { radius: 3.85, opacity: 0.13, baseRotation: [Math.PI / 3, 0, 0], spin: [0.03, 0.08, 0] },
  { radius: 4.3, opacity: 0.09, baseRotation: [0, Math.PI / 4, 0], spin: [0, 0, 0.12] },
];
export const ORBIT_SEGMENTS = 160;
export const DUST_COUNT = 120;
/** Dust fills a box this size around the centre. */
export const DUST_BOX: Point3 = [12, 12, 6];
export const DUST_SIZE = 0.04;
export const DUST_OPACITY = 0.4;
/** Fixed seed: the dust is scattered the same way on every visit. */
export const DUST_SEED = 47;
export const DUST_SPIN_SPEED = 0.015;
export const DUST_SWAY_SPEED = 0.05;
export const DUST_SWAY_ANGLE = 0.05;
