import { Group, LineLoop, Points } from 'three';
import type { BufferGeometry, Color, LineBasicMaterial, PointsMaterial } from 'three';

import {
  DUST_BOX,
  DUST_COUNT,
  DUST_OPACITY,
  DUST_SEED,
  DUST_SIZE,
  DUST_SPIN_SPEED,
  DUST_SWAY_ANGLE,
  DUST_SWAY_SPEED,
  ORBIT_RINGS,
  ORBIT_SEGMENTS,
} from './background-3d.constants';
import { createGeometry, createLineMaterial, createPointMaterial } from './background-3d.materials';
import { createRandom } from './background-3d.random';
import type { OrbitRing, Palette } from './background-3d.types';

const FULL_TURN = Math.PI * 2;

interface Orbit {
  readonly ring: OrbitRing;
  readonly line: LineLoop<BufferGeometry, LineBasicMaterial>;
}

function createOrbit(ring: OrbitRing, color: Color): Orbit {
  const points = Array.from({ length: ORBIT_SEGMENTS }, (_, index) => {
    const angle = (FULL_TURN * index) / ORBIT_SEGMENTS;
    return [ring.radius * Math.cos(angle), ring.radius * Math.sin(angle), 0];
  }).flat();
  const line = new LineLoop(createGeometry(points), createLineMaterial(color, ring.opacity));
  line.rotation.set(...ring.baseRotation);
  return { ring, line };
}

function createDust(palette: Palette): Points<BufferGeometry, PointsMaterial> {
  const random = createRandom(DUST_SEED);
  const positions = Array.from({ length: DUST_COUNT }, () =>
    DUST_BOX.map((extent) => (random() - 0.5) * extent),
  ).flat();
  return new Points(
    createGeometry(positions),
    createPointMaterial(palette, DUST_SIZE, DUST_OPACITY),
  );
}

/** Thin orbit rings, each turning on its own axes, and slowly drifting dust around the cat. */
export class AmbientLayer {
  readonly group = new Group();
  private readonly orbits: readonly Orbit[];
  private readonly dust: Points<BufferGeometry, PointsMaterial>;

  constructor(palette: Palette) {
    this.orbits = ORBIT_RINGS.map((ring) => createOrbit(ring, palette.color));
    this.dust = createDust(palette);
    this.orbits.forEach((orbit) => this.group.add(orbit.line));
    this.group.add(this.dust);
  }

  /** Poses the rings and dust for `elapsed` seconds since the scene started. */
  pose(elapsed: number): void {
    this.orbits.forEach(({ ring, line }) => {
      line.rotation.set(
        ring.baseRotation[0] + ring.spin[0] * elapsed,
        ring.baseRotation[1] + ring.spin[1] * elapsed,
        ring.baseRotation[2] + ring.spin[2] * elapsed,
      );
    });
    this.dust.rotation.set(
      Math.sin(elapsed * DUST_SWAY_SPEED) * DUST_SWAY_ANGLE,
      elapsed * DUST_SPIN_SPEED,
      0,
    );
  }

  recolor(color: Color): void {
    this.orbits.forEach(({ line }) => line.material.color.copy(color));
    this.dust.material.color.copy(color);
  }
}
