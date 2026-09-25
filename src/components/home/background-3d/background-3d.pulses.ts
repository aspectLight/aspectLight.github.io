import { PULSE_COUNT, PULSE_SEED, PULSE_SPEED } from './background-3d.constants';
import { createRandom } from './background-3d.random';
import type { CatNetwork } from './background-3d.types';

/** A signal on its way along one synapse. */
interface Pulse {
  synapse: number;
  /** 0 at the synapse's source neuron, 1 at its target. */
  progress: number;
}

function pick(options: readonly number[], random: () => number): number | undefined {
  return options[Math.floor(random() * options.length)];
}

/** For each neuron, the synapses leaving it. */
function outgoingSynapses(network: CatNetwork): number[][] {
  const outgoing = network.neurons.map((): number[] => []);
  network.synapses.forEach(([from], synapse) => {
    outgoing[from]?.push(synapse);
  });
  return outgoing;
}

/** Signals climbing the cat network from the paws to the ears, like a forward pass. */
export class PulseSystem {
  private readonly outgoing: readonly (readonly number[])[];
  private readonly random = createRandom(PULSE_SEED);
  private readonly pulses: Pulse[];

  /** Signals start spread through the network at random stages of their climb. */
  constructor(private readonly network: CatNetwork) {
    this.outgoing = outgoingSynapses(network);
    this.pulses = Array.from({ length: PULSE_COUNT }, () => ({
      synapse: Math.floor(this.random() * network.synapses.length),
      progress: this.random(),
    }));
  }

  /**
   * Moves every signal forward. At a neuron it carries on along one of the
   * synapses leaving it; at the top (or the tail tip) it starts again at the paws.
   */
  advance(seconds: number): void {
    this.pulses.forEach((pulse) => {
      pulse.progress += PULSE_SPEED * seconds;
      while (pulse.progress >= 1) {
        pulse.progress -= 1;
        const [, reached = 0] = this.network.synapses[pulse.synapse] ?? [];
        pulse.synapse = pick(this.outgoing[reached] ?? [], this.random) ?? this.entrySynapse();
      }
    });
  }

  /** Writes each signal's current point into `output` (a Three.js position buffer). */
  writePositions(output: Float32Array): void {
    this.pulses.forEach(({ synapse, progress }, index) => {
      const [from = 0, to = 0] = this.network.synapses[synapse] ?? [];
      const start = this.network.neurons[from] ?? [0, 0, 0];
      const end = this.network.neurons[to] ?? [0, 0, 0];
      for (let axis = 0; axis < 3; axis += 1) {
        const origin = start[axis] ?? 0;
        output[index * 3 + axis] = origin + ((end[axis] ?? 0) - origin) * progress;
      }
    });
  }

  /** A synapse leaving a random input neuron: where a fresh signal enters the network. */
  private entrySynapse(): number {
    const input = pick(this.network.inputs, this.random) ?? 0;
    return pick(this.outgoing[input] ?? [], this.random) ?? 0;
  }
}
