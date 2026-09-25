import { Locale } from '@core/enums/locale.enum';
import type { FocusItem } from '@core/types/focus.types';

/** What is being worked on right now. Keep it to what is true this term. */
export const CURRENT_FOCUS: readonly FocusItem[] = [
  {
    topic: {
      [Locale.En]: 'Combinatorial optimization on GPUs',
      [Locale.Fr]: 'Optimisation combinatoire sur GPU',
    },
    detail: {
      [Locale.En]: 'Implementing an Ising machine as a research project.',
      [Locale.Fr]: 'J’implémente une machine d’Ising dans le cadre d’un projet de recherche.',
    },
  },
  {
    topic: {
      [Locale.En]: 'Trustworthy and secure machine learning',
      [Locale.Fr]: 'Apprentissage automatique fiable et sécuritaire',
    },
    detail: {
      [Locale.En]:
        'UPIR research: how much of a model’s decision boundary its counterfactual explanations give away.',
      [Locale.Fr]:
        'Recherche UPIR : ce que les explications contrefactuelles d’un modèle révèlent de sa frontière de décision.',
    },
  },
];
