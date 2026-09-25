export interface ReliabilityBin {
  readonly confidence: number;
  readonly accuracy: number;
}

export const RELIABILITY_BINS: readonly ReliabilityBin[] = [
  { confidence: 0.05, accuracy: 0.06 },
  { confidence: 0.15, accuracy: 0.16 },
  { confidence: 0.25, accuracy: 0.24 },
  { confidence: 0.35, accuracy: 0.33 },
  { confidence: 0.45, accuracy: 0.4 },
  { confidence: 0.55, accuracy: 0.48 },
  { confidence: 0.65, accuracy: 0.5 },
  { confidence: 0.75, accuracy: 0.52 },
  { confidence: 0.85, accuracy: 0.55 },
  { confidence: 0.95, accuracy: 0.58 },
];
