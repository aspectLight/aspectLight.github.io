import {
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineLoop,
  Points,
  PointsMaterial,
} from 'three';
import type { CanvasTexture, Color } from 'three';

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
import { createRandom } from './background-3d.random';
import type { OrbitRing } from './background-3d.types';

const FULL_TURN = Math.PI * 2;

interface Orbit {
  readonly ring: OrbitRing;
  readonly line: LineLoop<BufferGeometry, LineBasicMaterial>;
}

export interface AmbientLayer {
  readonly group: Group;
  readonly orbits: readonly Orbit[];
  readonly dust: Points<BufferGeometry, PointsMaterial>;
}

function geometryOf(positions: readonly number[]): BufferGeometry {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  return geometry;
}

function createOrbit(ring: OrbitRing, color: Color): Orbit {
  const points = Array.from({ length: ORBIT_SEGMENTS }, (_, index) => {
    const angle = (FULL_TURN * index) / ORBIT_SEGMENTS;
    return [ring.radius * Math.cos(angle), ring.radius * Math.sin(angle), 0];
  }).flat();
  const material = new LineBasicMaterial({
    color,
    transparent: true,
    opacity: ring.opacity,
    depthWrite: false,
  });
  const line = new LineLoop(geometryOf(points), material);
  line.rotation.set(...ring.baseRotation);
  return { ring, line };
}

function createDust(color: Color, dot: CanvasTexture): Points<BufferGeometry, PointsMaterial> {
  const random = createRandom(DUST_SEED);
  const positions = Array.from({ length: DUST_COUNT }, () =>
    DUST_BOX.map((extent) => (random() - 0.5) * extent),
  ).flat();
  const material = new PointsMaterial({
    color,
    map: dot,
    size: DUST_SIZE,
    transparent: true,
    opacity: DUST_OPACITY,
    depthWrite: false,
  });
  return new Points(geometryOf(positions), material);
}

/** Thin orbit rings and drifting dust that sit around every shape. */
export function createAmbientLayer(color: Color, dot: CanvasTexture): AmbientLayer {
  const orbits = ORBIT_RINGS.map((ring) => createOrbit(ring, color));
  const dust = createDust(color, dot);
  const group = new Group();
  orbits.forEach((orbit) => group.add(orbit.line));
  group.add(dust);
  return { group, orbits, dust };
}

/** Poses the rings and dust for `elapsed` seconds since the scene started. */
export function poseAmbientLayer(ambient: AmbientLayer, elapsed: number): void {
  ambient.orbits.forEach(({ ring, line }) => {
    line.rotation.set(
      ring.baseRotation[0] + ring.spin[0] * elapsed,
      ring.baseRotation[1] + ring.spin[1] * elapsed,
      ring.baseRotation[2] + ring.spin[2] * elapsed,
    );
  });
  ambient.dust.rotation.set(
    Math.sin(elapsed * DUST_SWAY_SPEED) * DUST_SWAY_ANGLE,
    elapsed * DUST_SPIN_SPEED,
    0,
  );
}

export function recolorAmbientLayer(ambient: AmbientLayer, color: Color): void {
  ambient.orbits.forEach(({ line }) => line.material.color.copy(color));
  ambient.dust.material.color.copy(color);
}
