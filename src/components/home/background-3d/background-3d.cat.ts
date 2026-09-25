import { BufferAttribute, BufferGeometry, Group, LineLoop, LineSegments, Points } from 'three';
import type { Color, LineBasicMaterial, PointsMaterial } from 'three';

import {
  BOB_HEIGHT,
  BOB_SPEED,
  NEURON_OPACITY,
  NEURON_SIZE,
  OUTLINE_OPACITY,
  PULSE_COUNT,
  PULSE_OPACITY,
  PULSE_SIZE,
  SWAY_ANGLE,
  SWAY_SPEED,
  SYNAPSE_OPACITY,
  TURN_ANGLE,
  TURN_SPEED,
} from './background-3d.constants';
import { createGeometry, createLineMaterial, createPointMaterial } from './background-3d.materials';
import { PulseSystem } from './background-3d.pulses';
import type { CatNetwork, Palette } from './background-3d.types';

function synapseSegments(network: CatNetwork): number[] {
  return network.synapses.flatMap(([from, to]) => {
    const start = network.neurons[from];
    const end = network.neurons[to];
    return start === undefined || end === undefined ? [] : [...start, ...end];
  });
}

/**
 * The avatar's cat drawn as a neural network: synapses, neurons, a faint
 * outline and the signals climbing through it. It sways but never changes shape.
 */
export class CatModel {
  readonly group = new Group();
  private readonly pulses: PulseSystem;
  private readonly pulseVertices = new Float32Array(PULSE_COUNT * 3);
  /** Keeps a reference to `pulseVertices`, so writes to the array reach the GPU. */
  private readonly pulseAttribute = new BufferAttribute(this.pulseVertices, 3);
  private readonly materials: readonly (LineBasicMaterial | PointsMaterial)[];

  constructor(network: CatNetwork, palette: Palette) {
    this.pulses = new PulseSystem(network);
    const synapses = createLineMaterial(palette.color, SYNAPSE_OPACITY);
    const outline = createLineMaterial(palette.color, OUTLINE_OPACITY);
    const neurons = createPointMaterial(palette, NEURON_SIZE, NEURON_OPACITY);
    const pulses = createPointMaterial(palette, PULSE_SIZE, PULSE_OPACITY);
    const pulseGeometry = new BufferGeometry();
    pulseGeometry.setAttribute('position', this.pulseAttribute);
    this.group.add(
      new LineSegments(createGeometry(synapseSegments(network)), synapses),
      new LineLoop(createGeometry(network.outline.flat()), outline),
      new Points(createGeometry(network.neurons.flat()), neurons),
      new Points(pulseGeometry, pulses),
    );
    this.materials = [synapses, outline, neurons, pulses];
  }

  /** Moves the signals on by `seconds`. */
  advance(seconds: number): void {
    this.pulses.advance(seconds);
  }

  /** A slow sway and bob, and the signals where they are now; the cat always faces forward. */
  pose(elapsed: number): void {
    this.pulses.writePositions(this.pulseVertices);
    this.pulseAttribute.needsUpdate = true;
    this.group.rotation.set(
      Math.sin(elapsed * SWAY_SPEED) * SWAY_ANGLE,
      Math.sin(elapsed * TURN_SPEED) * TURN_ANGLE,
      0,
    );
    this.group.position.y = Math.sin(elapsed * BOB_SPEED) * BOB_HEIGHT;
  }

  recolor(color: Color): void {
    this.materials.forEach((material) => material.color.copy(color));
  }
}
