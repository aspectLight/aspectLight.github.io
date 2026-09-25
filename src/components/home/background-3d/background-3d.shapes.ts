import { IcosahedronGeometry } from 'three';

import { BackgroundShape } from './background-3d.enum';
import {
  CAT_OUTLINE_RIGHT_HALF,
  CAT_SCALE,
  CAT_SLICES,
  CAT_TAIL,
  HEX_EDGE_SUBDIVISIONS,
  NETWORK_BASE_RADIUS,
  NETWORK_LAYER_SIZES,
  NETWORK_LAYER_SPACING,
  NETWORK_LAYER_TWIST,
  NETWORK_NODE_SIZE,
  NETWORK_RADIUS_PER_NODE,
  SPHERE_DETAIL,
  SPHERE_EDGE_SUBDIVISIONS,
  SPHERE_RADIUS,
  TORUS_HEX_COLUMNS,
  TORUS_HEX_ROWS,
  TORUS_MAJOR_RADIUS,
  TORUS_MINOR_RADIUS,
  WIDE_NETWORK_LAYER_SIZES,
} from './background-3d.constants';
import type { Point2, Point3, Segment } from './background-3d.types';

const FULL_TURN = Math.PI * 2;
const HEX_CORNER_COUNT = 6;
/** Pointy-top hexagons: the first corner sits 30° above the horizontal. */
const HEX_FIRST_CORNER_ANGLE = Math.PI / 6;
/**
 * Each hexagon draws 3 of its 6 edges; its neighbours draw the other 3,
 * so every edge of the tiling is drawn exactly once.
 */
const HEX_OWNED_EDGES: readonly number[] = [0, 1, 2];
const VERTEX_KEY_PRECISION = 4;

/* ---------- Shared geometry ---------- */

function lerp(from: number, to: number, fraction: number): number {
  return from + (to - from) * fraction;
}

function subdivide2(from: Point2, to: Point2, steps: number): Point2[] {
  return Array.from({ length: steps + 1 }, (_, step) => {
    const fraction = step / steps;
    return [lerp(from[0], to[0], fraction), lerp(from[1], to[1], fraction)];
  });
}

function subdivide3(from: Point3, to: Point3, steps: number): Point3[] {
  return Array.from({ length: steps + 1 }, (_, step) => {
    const fraction = step / steps;
    return [
      lerp(from[0], to[0], fraction),
      lerp(from[1], to[1], fraction),
      lerp(from[2], to[2], fraction),
    ];
  });
}

/** Joins consecutive points into segments: [a, b, c] → [a–b, b–c]. */
function toSegments(points: readonly Point3[]): Segment[] {
  const segments: Segment[] = [];
  for (let index = 1; index < points.length; index += 1) {
    const from = points[index - 1];
    const to = points[index];
    if (from !== undefined && to !== undefined) {
      segments.push([from, to]);
    }
  }
  return segments;
}

function closeLoop(points: readonly Point3[]): Point3[] {
  const first = points[0];
  return first === undefined ? [] : [...points, first];
}

function projectToSphere(point: Point3, radius: number): Point3 {
  const length = Math.hypot(point[0], point[1], point[2]);
  return [(point[0] / length) * radius, (point[1] / length) * radius, (point[2] / length) * radius];
}

/* ---------- Hexagon torus ---------- */

function torusPoint([u, v]: Point2): Point3 {
  const ringRadius = TORUS_MAJOR_RADIUS + TORUS_MINOR_RADIUS * Math.cos(v);
  return [ringRadius * Math.cos(u), TORUS_MINOR_RADIUS * Math.sin(v), ringRadius * Math.sin(u)];
}

function hexCorner(center: Point2, corner: number, radius: Point2): Point2 {
  const angle = HEX_FIRST_CORNER_ANGLE + (FULL_TURN / HEX_CORNER_COUNT) * corner;
  return [center[0] + radius[0] * Math.cos(angle), center[1] + radius[1] * Math.sin(angle)];
}

function hexGridCenters(columnStep: number, rowStep: number): Point2[] {
  return Array.from({ length: TORUS_HEX_ROWS }, (_, row) =>
    Array.from({ length: TORUS_HEX_COLUMNS }, (_unused, column): Point2 => [
      (column + (row % 2) / 2) * columnStep,
      row * rowStep,
    ]),
  ).flat();
}

/** A honeycomb wrapped around a torus, echoing the hexagons behind the avatar's cat. */
function buildHexTorus(): Segment[] {
  const columnStep = FULL_TURN / TORUS_HEX_COLUMNS;
  const rowStep = FULL_TURN / TORUS_HEX_ROWS;
  const radius: Point2 = [columnStep / Math.sqrt(3), rowStep / 1.5];
  return hexGridCenters(columnStep, rowStep).flatMap((center) =>
    HEX_OWNED_EDGES.flatMap((edge) => {
      const from = hexCorner(center, edge, radius);
      const to = hexCorner(center, edge + 1, radius);
      return toSegments(subdivide2(from, to, HEX_EDGE_SUBDIVISIONS).map(torusPoint));
    }),
  );
}

/* ---------- Hexagon sphere (dual of a subdivided icosahedron) ---------- */

type Triangle = readonly [Point3, Point3, Point3];

function vertexKey(point: Point3): string {
  return point.map((coordinate) => coordinate.toFixed(VERTEX_KEY_PRECISION)).join(',');
}

function edgeKey(from: Point3, to: Point3): string {
  return [vertexKey(from), vertexKey(to)].sort().join('|');
}

function icosahedronTriangles(): Triangle[] {
  const geometry = new IcosahedronGeometry(SPHERE_RADIUS, SPHERE_DETAIL);
  const position = geometry.getAttribute('position');
  const vertex = (index: number): Point3 => [
    position.getX(index),
    position.getY(index),
    position.getZ(index),
  ];
  const triangles = Array.from({ length: position.count / 3 }, (_, face): Triangle => [
    vertex(face * 3),
    vertex(face * 3 + 1),
    vertex(face * 3 + 2),
  ]);
  geometry.dispose();
  return triangles;
}

function facesByEdge(triangles: readonly Triangle[]): Map<string, number[]> {
  const faces = new Map<string, number[]>();
  triangles.forEach(([a, b, c], face) => {
    [edgeKey(a, b), edgeKey(b, c), edgeKey(c, a)].forEach((key) => {
      faces.set(key, [...(faces.get(key) ?? []), face]);
    });
  });
  return faces;
}

/**
 * Connecting the centres of neighbouring triangles turns the triangle mesh into
 * hexagons (plus 12 pentagons), the classic geodesic "hexagon ball".
 */
function buildHexSphere(): Segment[] {
  const triangles = icosahedronTriangles();
  const centres = triangles.map(([a, b, c]) =>
    projectToSphere(
      [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3, (a[2] + b[2] + c[2]) / 3],
      SPHERE_RADIUS,
    ),
  );
  return [...facesByEdge(triangles).values()].flatMap(([first, second]) => {
    const from = first === undefined ? undefined : centres[first];
    const to = second === undefined ? undefined : centres[second];
    if (from === undefined || to === undefined) {
      return [];
    }
    const arc = subdivide3(from, to, SPHERE_EDGE_SUBDIVISIONS).map((point) =>
      projectToSphere(point, SPHERE_RADIUS),
    );
    return toSegments(arc);
  });
}

/* ---------- Neural network ---------- */

function networkLayers(layerSizes: readonly number[]): Point3[][] {
  const centreOffset = (layerSizes.length - 1) / 2;
  return layerSizes.map((size, layerIndex) => {
    const x = (layerIndex - centreOffset) * NETWORK_LAYER_SPACING;
    const ringRadius = NETWORK_BASE_RADIUS + NETWORK_RADIUS_PER_NODE * size;
    return Array.from({ length: size }, (_, nodeIndex): Point3 => {
      const angle = (FULL_TURN * nodeIndex) / size + layerIndex * NETWORK_LAYER_TWIST;
      return [x, ringRadius * Math.cos(angle), ringRadius * Math.sin(angle)];
    });
  });
}

function nodeMarker([x, y, z]: Point3): Segment[] {
  const size = NETWORK_NODE_SIZE;
  return [
    [
      [x - size, y, z],
      [x + size, y, z],
    ],
    [
      [x, y - size, z],
      [x, y + size, z],
    ],
    [
      [x, y, z - size],
      [x, y, z + size],
    ],
  ];
}

/** Layers of neurons as rings, every neuron connected to every neuron of the next layer. */
function buildNeuralNetwork(layerSizes: readonly number[]): Segment[] {
  const layers = networkLayers(layerSizes);
  const connections = layers.slice(1).flatMap((layer, index) => {
    const previousLayer = layers[index] ?? [];
    return previousLayer.flatMap((from) => layer.map((to): Segment => [from, to]));
  });
  return [...connections, ...layers.flat().flatMap(nodeMarker)];
}

/* ---------- Cat ---------- */

function catOutline(): Point2[] {
  const leftHalf = CAT_OUTLINE_RIGHT_HALF.slice(1, -1)
    .toReversed()
    .map(([x, y]): Point2 => [-x, y]);
  return [...CAT_OUTLINE_RIGHT_HALF, ...leftHalf];
}

function catSlice(outline: readonly Point2[], [z, scale]: Point2): Point3[] {
  return outline.map(([x, y]): Point3 => [x * scale * CAT_SCALE, y * CAT_SCALE, z * CAT_SCALE]);
}

/** A low-poly wireframe of the avatar's cat: sitting, seen from behind, tail curled right. */
function buildCat(): Segment[] {
  const outline = catOutline();
  const slices = CAT_SLICES.map((slice) => catSlice(outline, slice));
  const rings = slices.flatMap((slice) => toSegments(closeLoop(slice)));
  const rungs = slices.slice(1).flatMap((slice, sliceIndex) => {
    const previousSlice = slices[sliceIndex] ?? [];
    return slice.flatMap((point, pointIndex): Segment[] => {
      const previousPoint = previousSlice[pointIndex];
      return previousPoint === undefined ? [] : [[previousPoint, point]];
    });
  });
  const tail = toSegments(CAT_TAIL.map(([x, y]): Point3 => [x * CAT_SCALE, y * CAT_SCALE, 0]));
  return [...rings, ...rungs, ...tail];
}

/* ---------- Public API ---------- */

const SHAPE_BUILDERS: Readonly<Record<BackgroundShape, () => Segment[]>> = {
  [BackgroundShape.HexTorus]: buildHexTorus,
  [BackgroundShape.NeuralNetwork]: () => buildNeuralNetwork(NETWORK_LAYER_SIZES),
  [BackgroundShape.HexSphere]: buildHexSphere,
  [BackgroundShape.WideNeuralNetwork]: () => buildNeuralNetwork(WIDE_NETWORK_LAYER_SIZES),
  [BackgroundShape.Cat]: buildCat,
};

/** Line-segment vertex positions for a shape, ready for a Three.js BufferGeometry. */
export function buildShapePositions(shape: BackgroundShape): Float32Array {
  return new Float32Array(SHAPE_BUILDERS[shape]().flatMap(([from, to]) => [...from, ...to]));
}
