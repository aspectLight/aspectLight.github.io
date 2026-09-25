import { Locale } from '@core/enums/locale.enum';
import type { EducationEntry } from '@core/types/education.types';

export const EDUCATION: readonly EducationEntry[] = [
  {
    institution: 'Polytechnique Montréal',
    degree: {
      [Locale.En]: 'B.Eng. in Software Engineering',
      [Locale.Fr]: 'Baccalauréat en génie logiciel',
    },
    track: {
      [Locale.En]: 'Artificial Intelligence and Data Science Track',
      [Locale.Fr]: 'Orientation intelligence artificielle et sciences des données',
    },
    start: '2023-08',
    end: '2027-05',
    isEndExpected: true,
    place: 'Montréal, QC',
    coursework: {
      [Locale.En]: [
        'Artificial Intelligence',
        'Statistics for AI',
        'Operations Research',
        'Data Mining',
      ],
      [Locale.Fr]: [
        'intelligence artificielle',
        'statistiques pour l’IA',
        'recherche opérationnelle',
        'fouille de données',
      ],
    },
  },
];
