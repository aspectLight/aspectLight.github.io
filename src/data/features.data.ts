import { getYear } from '@core/date/get-year';
import { Locale } from '@core/enums/locale.enum';
import type { Feature } from '@core/types/feature.types';
import { CURRENT_PROGRAM } from '@data/education.data';

/**
 * Every value is derived from data published elsewhere on the page,
 * so the row can never claim something the rest of the site does not.
 */
export const FEATURES: readonly Feature[] = [
  {
    value: getYear(CURRENT_PROGRAM.start),
    description: {
      [Locale.En]: 'started software engineering at Polytechnique Montréal',
      [Locale.Fr]: 'début en génie logiciel à Polytechnique Montréal',
    },
  },
  {
    value: CURRENT_PROGRAM.coursework[Locale.En].length,
    description: {
      [Locale.En]: 'courses in AI and data science',
      [Locale.Fr]: 'cours en IA et en sciences des données',
    },
  },
  {
    value: Object.values(Locale).length,
    description: {
      [Locale.En]: 'working languages: French and English',
      [Locale.Fr]: 'langues de travail\u202F: français et anglais',
    },
  },
  {
    value: getYear(CURRENT_PROGRAM.end),
    description: {
      [Locale.En]: 'expected graduation',
      [Locale.Fr]: 'diplomation prévue',
    },
  },
];
