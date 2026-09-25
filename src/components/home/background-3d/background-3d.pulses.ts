import { PULSE_COUNT, PULSE_SEED, PULSE_SPEED } from './background-3d.constants';
import { createRandom } from './background-3d.random';
import type { CatNetwork } from './background-3d.types';

/** A signal on its way along one synapse. */
interface Pulse {
  synapse: number;
  /** 0 at the synapse's source neuron, 1 at its target. */
  progress: number;
}

export interface PulseSystem {
  readonly network: CatNetwork;
  /** For each neuron, the synapses leaving it. */
  readonly outgoing: readonly (readonly number[])[];
  readonly pulses: readonly Pulse[];
  readonly random: () => number;
}

function pick(options: readonly number[], random: () => number): number | undefined {
  return options[Math.floor(random() * options.length)];
}

function outgoingSynapses(network: CatNetwork): number[][] {
  const outgoing = network.neurons.map((): number[] => []);
  network.synapses.forEach(([from], synapse) => {
    outgoing[from]?.push(synapse);
  });
  return outgoing;
}

/** A synapse leaving a random input neuron: where a fresh signal enters the network. */
function entrySynapse(system: Omit<PulseSystem, 'pulses'>): number {
  const input = pick(system.network.inputs, system.random) ?? 0;
  return pick(system.outgoing[input] ?? [], system.random) ?? 0;
}

/** Signals spread through the network at random stages of their climb. */
export function createPulseSystem(network: CatNetwork): PulseSystem {
  const random = createRandom(PULSE_SEED);
  const base = { network, outgoing: outgoingSynapses(network), random };
  const pulses = Array.from({ length: PULSE_COUNT }, () => ({
    synapse: Math.floor(random() * network.synapses.length),
    progress: random(),
  }));
  return { ...base, pulses };
}

/**
 * Moves every signal forward. At a neuron it carries on along one of the
 * synapses leaving it; at the top (or the tail tip) it starts again at the paws.
 */
export function advancePulses(system: PulseSystem, seconds: number): void {
  system.pulses.forEach((pulse) => {
    pulse.progress += PULSE_SPEED * seconds;
    while (pulse.progress >= 1) {
      pulse.progress -= 1;
      const [, reached = 0] = system.network.synapses[pulse.synapse] ?? [];
      pulse.synapse = pick(system.outgoing[reached] ?? [], system.random) ?? entrySynapse(system);
    }
  });
}

/** Writes each signal's current point into `output` (a Three.js position buffer). */
export function writePulsePositions(system: PulseSystem, output: Float32Array): void {
  system.pulses.forEach(({ synapse, progress }, index) => {
    const [from = 0, to = 0] = system.network.synapses[synapse] ?? [];
    const start = system.network.neurons[from] ?? [0, 0, 0];
    const end = system.network.neurons[to] ?? [0, 0, 0];
    for (let axis = 0; axis < 3; axis += 1) {
      const origin = start[axis] ?? 0;
      output[index * 3 + axis] = origin + ((end[axis] ?? 0) - origin) * progress;
    }
  });
}
