import { Points } from 'three';
import type { BufferGeometry, Color, PointsMaterial } from 'three';

import {
  DUST_BOX,
  DUST_COUNT,
  DUST_OPACITY,
  DUST_SEED,
  DUST_SIZE,
  DUST_SPIN_SPEED,
  DUST_SWAY_ANGLE,
  DUST_SWAY_SPEED,
} from './background-3d.constants';
import { createGeometry, createPointMaterial } from './background-3d.materials';
import { createRandom } from './background-3d.random';
import type { Palette } from './background-3d.types';

/** Faint specks drifting slowly around the cat. */
export class DustLayer {
  readonly points: Points<BufferGeometry, PointsMaterial>;

  constructor(palette: Palette) {
    const random = createRandom(DUST_SEED);
    const positions = Array.from({ length: DUST_COUNT }, () =>
      DUST_BOX.map((extent) => (random() - 0.5) * extent),
    ).flat();
    this.points = new Points(
      createGeometry(positions),
      createPointMaterial(palette, DUST_SIZE, DUST_OPACITY),
    );
  }

  /** Poses the dust for `elapsed` seconds since the scene started. */
  pose(elapsed: number): void {
    this.points.rotation.set(
      Math.sin(elapsed * DUST_SWAY_SPEED) * DUST_SWAY_ANGLE,
      elapsed * DUST_SPIN_SPEED,
      0,
    );
  }

  recolor(color: Color): void {
    this.points.material.color.copy(color);
  }
}
