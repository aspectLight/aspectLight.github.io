import { RELIABILITY_BINS, type ReliabilityBin } from './reliability-sample';

const PLOT_ORIGIN = 28;
const PLOT_SIZE = 180;

export interface ReliabilityBar {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

function plotCoordinate(value: number, axis: 'x' | 'y'): number {
  if (axis === 'x') {
    return PLOT_ORIGIN + value * PLOT_SIZE;
  }
  return PLOT_ORIGIN + (1 - value) * PLOT_SIZE;
}

export function reliabilityBars(bins: readonly ReliabilityBin[]): readonly ReliabilityBar[] {
  const width = PLOT_SIZE / bins.length;
  return bins.map((bin, index) => {
    const height = bin.accuracy * PLOT_SIZE;
    return {
      x: PLOT_ORIGIN + index * width,
      y: PLOT_ORIGIN + PLOT_SIZE - height,
      width,
      height,
    };
  });
}

export function reliabilityStepPoints(bins: readonly ReliabilityBin[]): string {
  return bins
    .map((bin) => `${plotCoordinate(bin.confidence, 'x')},${plotCoordinate(bin.accuracy, 'y')}`)
    .join(' ');
}

export function reliabilityDiagonal(): string {
  const start = `${plotCoordinate(0, 'x')},${plotCoordinate(0, 'y')}`;
  const end = `${plotCoordinate(1, 'x')},${plotCoordinate(1, 'y')}`;
  return `${start} ${end}`;
}

export function reliabilityBarsFromSample(): readonly ReliabilityBar[] {
  return reliabilityBars(RELIABILITY_BINS);
}

export function reliabilityStepFromSample(): string {
  return reliabilityStepPoints(RELIABILITY_BINS);
}
