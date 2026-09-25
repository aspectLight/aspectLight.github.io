import {
  BufferAttribute,
  BufferGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Points,
  PointsMaterial,
} from 'three';
import type { CanvasTexture, Color } from 'three';

import {
  FOUND_EDGE_OPACITY,
  MAX_SAMPLES,
  QUERY_LINE_OPACITY,
  QUERY_LINE_SECONDS,
  RECONSTRUCTED_GLOW,
  RECONSTRUCTED_GLOW_SECONDS,
  SAMPLE_OPACITY,
  SAMPLE_SIZE,
} from './background-3d.constants';
import { writeFoundEdges, writeSamples } from './background-3d.queries';
import type { QueryState } from './background-3d.queries';

/** A position buffer and the geometry drawing it, sized once for the worst case. */
interface Buffer {
  readonly geometry: BufferGeometry;
  readonly attribute: BufferAttribute;
  /** The array behind `attribute` (BufferAttribute keeps the reference). */
  readonly vertices: Float32Array;
}

/** Everything the visitor's questions add to the cat: found edges, answer points, the last line. */
export interface QueryLayer {
  readonly group: Group;
  readonly materials: {
    readonly edges: LineBasicMaterial;
    readonly line: LineBasicMaterial;
    readonly samples: PointsMaterial;
  };
  readonly edges: Buffer;
  readonly line: Buffer;
  readonly samples: Buffer;
  /** Seconds left of the glow played when the outline is complete. */
  glow: number;
}

function createBuffer(vertexCount: number): Buffer {
  const vertices = new Float32Array(vertexCount * 3);
  const attribute = new BufferAttribute(vertices, 3);
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', attribute);
  geometry.setDrawRange(0, 0);
  return { geometry, attribute, vertices };
}

function refresh(buffer: Buffer, vertexCount: number): void {
  buffer.geometry.setDrawRange(0, vertexCount);
  buffer.attribute.needsUpdate = true;
}

function lines(color: Color, opacity: number): LineBasicMaterial {
  return new LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
}

export function createQueryLayer(edgeCount: number, color: Color, dot: CanvasTexture): QueryLayer {
  const layer: QueryLayer = {
    group: new Group(),
    materials: {
      edges: lines(color, FOUND_EDGE_OPACITY),
      line: lines(color, 0),
      samples: new PointsMaterial({
        color,
        map: dot,
        size: SAMPLE_SIZE,
        transparent: true,
        opacity: SAMPLE_OPACITY,
        depthWrite: false,
      }),
    },
    edges: createBuffer(edgeCount * 2),
    line: createBuffer(2),
    samples: createBuffer(MAX_SAMPLES),
    glow: 0,
  };
  layer.group.add(
    new LineSegments(layer.edges.geometry, layer.materials.edges),
    new LineSegments(layer.line.geometry, layer.materials.line),
    new Points(layer.samples.geometry, layer.materials.samples),
  );
  return layer;
}

/** Copies a new answer into the buffers: call once per query. */
export function showQuery(layer: QueryLayer, state: QueryState, reconstructed: boolean): void {
  refresh(layer.edges, writeFoundEdges(state, layer.edges.vertices));
  refresh(layer.samples, writeSamples(state, layer.samples.vertices));
  const latest = state.latest;
  if (latest !== undefined) {
    layer.line.vertices.set([...latest.from, 0, ...latest.to, 0]);
    refresh(layer.line, 2);
  }
  if (reconstructed) {
    layer.glow = RECONSTRUCTED_GLOW_SECONDS;
  }
}

/**
 * Advances the fades by `seconds`. A step of Infinity finishes them at once,
 * which is what reduced motion uses.
 */
export function fadeQueryLayer(layer: QueryLayer, state: QueryState, seconds: number): void {
  const latest = state.latest;
  if (latest !== undefined) {
    latest.age += seconds;
  }
  const lineLeft = latest === undefined ? 0 : Math.max(0, 1 - latest.age / QUERY_LINE_SECONDS);
  layer.materials.line.opacity = QUERY_LINE_OPACITY * lineLeft;
  layer.glow = Math.max(0, layer.glow - seconds);
  layer.materials.edges.opacity =
    FOUND_EDGE_OPACITY + RECONSTRUCTED_GLOW * (layer.glow / RECONSTRUCTED_GLOW_SECONDS);
}

export function recolorQueryLayer(layer: QueryLayer, color: Color): void {
  Object.values(layer.materials).forEach((material) => material.color.copy(color));
}
