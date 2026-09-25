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
      [Locale.En]: 'AI security and robustness',
      [Locale.Fr]: 'Sécurité et robustesse de l’IA',
    },
    detail: {
      [Locale.En]:
        'Exploring how learning systems get attacked, and how to tell whether a defence actually holds.',
      [Locale.Fr]:
        'J’explore comment on attaque les systèmes d’apprentissage, et comment vérifier qu’une défense tient vraiment.',
    },
  },
];
