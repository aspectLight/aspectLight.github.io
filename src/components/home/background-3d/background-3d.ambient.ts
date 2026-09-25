import {
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineSegments,
  Points,
  PointsMaterial,
} from 'three';
import type { Color, Material } from 'three';

import {
  DUST_COUNT,
  DUST_OPACITY,
  DUST_RADIUS_RANGE,
  DUST_SEED,
  DUST_SIZE,
  ORBIT_OPACITY,
  ORBIT_RINGS,
  ORBIT_SEGMENTS,
} from './background-3d.constants';
import type { OrbitRing } from './background-3d.types';

const FULL_TURN = Math.PI * 2;
const UINT32_RANGE = 2 ** 32;

export interface AmbientLayer {
  readonly group: Group;
  readonly materials: readonly (LineBasicMaterial | PointsMaterial)[];
}

/** mulberry32: a tiny seeded generator, so the dust never moves between visits. */
function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / UINT32_RANGE;
  };
}

function circlePositions(radius: number): Float32Array {
  const point = (index: number): number[] => {
    const angle = (FULL_TURN * index) / ORBIT_SEGMENTS;
    return [radius * Math.cos(angle), radius * Math.sin(angle), 0];
  };
  return new Float32Array(
    Array.from({ length: ORBIT_SEGMENTS }, (_, index) => [
      ...point(index),
      ...point(index + 1),
    ]).flat(),
  );
}

function dustPositions(): Float32Array {
  const random = createRandom(DUST_SEED);
  const [innerRadius, outerRadius] = DUST_RADIUS_RANGE;
  return new Float32Array(
    Array.from({ length: DUST_COUNT }, () => {
      const azimuth = random() * FULL_TURN;
      const polar = Math.acos(2 * random() - 1);
      const radius = innerRadius + random() * (outerRadius - innerRadius);
      return [
        radius * Math.sin(polar) * Math.cos(azimuth),
        radius * Math.cos(polar),
        radius * Math.sin(polar) * Math.sin(azimuth),
      ];
    }).flat(),
  );
}

function geometryOf(positions: Float32Array): BufferGeometry {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  return geometry;
}

function createOrbit(ring: OrbitRing, material: Material): LineSegments {
  const orbit = new LineSegments(geometryOf(circlePositions(ring.radius)), material);
  orbit.rotation.set(ring.tilt[0], 0, ring.tilt[1]);
  return orbit;
}

/** Faint orbit rings and dust that sit behind every shape, like a star chart. */
export function createAmbientLayer(color: Color): AmbientLayer {
  const orbitMaterial = new LineBasicMaterial({
    color,
    transparent: true,
    opacity: ORBIT_OPACITY,
    depthWrite: false,
  });
  const dustMaterial = new PointsMaterial({
    color,
    size: DUST_SIZE,
    transparent: true,
    opacity: DUST_OPACITY,
    depthWrite: false,
  });
  const group = new Group();
  ORBIT_RINGS.forEach((ring) => group.add(createOrbit(ring, orbitMaterial)));
  group.add(new Points(geometryOf(dustPositions()), dustMaterial));
  return { group, materials: [orbitMaterial, dustMaterial] };
}
