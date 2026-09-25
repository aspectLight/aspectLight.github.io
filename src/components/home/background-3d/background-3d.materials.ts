import { BufferAttribute, BufferGeometry, LineBasicMaterial, PointsMaterial } from 'three';
import type { Color } from 'three';

import type { Palette } from './background-3d.types';

/** A geometry holding `positions` (x, y, z, x, y, z, …) as its vertices. */
export function createGeometry(positions: readonly number[]): BufferGeometry {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
  return geometry;
}

/** Faint, see-through lines that never hide what is behind them. */
export function createLineMaterial(color: Color, opacity: number): LineBasicMaterial {
  return new LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
}

/** Round, see-through points of a given world size. */
export function createPointMaterial(
  { color, dot }: Palette,
  size: number,
  opacity: number,
): PointsMaterial {
  return new PointsMaterial({
    color,
    map: dot,
    size,
    transparent: true,
    opacity,
    depthWrite: false,
  });
}
