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
        'UPIR research internship with Prof. Thibaut Vidal, where optimization is used to audit and attack models.',
      [Locale.Fr]:
        'Stage de recherche UPIR avec le professeur Thibaut Vidal, où l’optimisation sert à auditer et à attaquer des modèles.',
    },
  },
];
