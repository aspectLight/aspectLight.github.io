import { BufferAttribute, BufferGeometry, Group, LineSegments, Points } from 'three';
import type { Color, LineBasicMaterial, PointsMaterial } from 'three';

import {
  FOUND_EDGE_OPACITY,
  MAX_SAMPLES,
  QUERY_LINE_OPACITY,
  RECONSTRUCTED_GLOW,
  RECONSTRUCTED_GLOW_SECONDS,
  SAMPLE_OPACITY,
  SAMPLE_SIZE,
} from './background-3d.constants';
import { createLineMaterial, createPointMaterial } from './background-3d.materials';
import type { QueryLog } from './background-3d.queries';
import type { Palette } from './background-3d.types';

/** Vertices of the latest query line: the click and its answer. */
const LINE_VERTICES = 2;

/** A position buffer and the geometry drawing it, sized once for the worst case. */
class DrawBuffer {
  readonly geometry = new BufferGeometry();
  private readonly attribute: BufferAttribute;
  /** The array behind `attribute` (BufferAttribute keeps the reference). */
  readonly vertices: Float32Array;

  constructor(vertexCount: number) {
    this.vertices = new Float32Array(vertexCount * 3);
    this.attribute = new BufferAttribute(this.vertices, 3);
    this.geometry.setAttribute('position', this.attribute);
    this.geometry.setDrawRange(0, 0);
  }

  /** Draws the first `vertexCount` vertices, which have just been written. */
  refresh(vertexCount: number): void {
    this.geometry.setDrawRange(0, vertexCount);
    this.attribute.needsUpdate = true;
  }
}

/** Draws what the visitor's questions revealed: found edges, answer points, the latest line. */
export class QueryLayer {
  readonly group = new Group();
  private readonly edges: DrawBuffer;
  private readonly line = new DrawBuffer(LINE_VERTICES);
  private readonly samples = new DrawBuffer(MAX_SAMPLES);
  private readonly edgeMaterial: LineBasicMaterial;
  private readonly lineMaterial: LineBasicMaterial;
  private readonly sampleMaterial: PointsMaterial;
  /** Seconds left of the glow played when the outline is complete. */
  private glow = 0;

  constructor(edgeCount: number, palette: Palette) {
    this.edges = new DrawBuffer(edgeCount * 2);
    this.edgeMaterial = createLineMaterial(palette.color, FOUND_EDGE_OPACITY);
    this.lineMaterial = createLineMaterial(palette.color, 0);
    this.sampleMaterial = createPointMaterial(palette, SAMPLE_SIZE, SAMPLE_OPACITY);
    this.group.add(
      new LineSegments(this.edges.geometry, this.edgeMaterial),
      new LineSegments(this.line.geometry, this.lineMaterial),
      new Points(this.samples.geometry, this.sampleMaterial),
    );
  }

  /** Copies the log's latest state into the buffers: call once per query. */
  show(log: QueryLog, reconstructed: boolean): void {
    this.edges.refresh(log.writeFoundEdges(this.edges.vertices));
    this.samples.refresh(log.writeSamples(this.samples.vertices));
    this.line.refresh(log.writeLatestLine(this.line.vertices));
    if (reconstructed) {
      this.glow = RECONSTRUCTED_GLOW_SECONDS;
    }
  }

  /**
   * Advances the fades by `seconds`. A step of Infinity finishes them at once,
   * which is what reduced motion uses.
   */
  fade(log: QueryLog, seconds: number): void {
    log.age(seconds);
    this.lineMaterial.opacity = QUERY_LINE_OPACITY * log.latestLife();
    this.glow = Math.max(0, this.glow - seconds);
    this.edgeMaterial.opacity =
      FOUND_EDGE_OPACITY + RECONSTRUCTED_GLOW * (this.glow / RECONSTRUCTED_GLOW_SECONDS);
  }

  recolor(color: Color): void {
    [this.edgeMaterial, this.lineMaterial, this.sampleMaterial].forEach((material) =>
      material.color.copy(color),
    );
  }
}
