import type { Localized } from '@i18n/locales';
import type { IsoMonth } from '@values/iso-month';

export interface EducationEntry {
  readonly institution: string;
  readonly degree: Localized<string>;
  readonly track: Localized<string>;
  readonly start: IsoMonth;
  readonly end: IsoMonth;
  readonly place: string;
  readonly coursework: Localized<readonly [string, ...string[]]>;
}

export const EDUCATION: readonly [EducationEntry, ...EducationEntry[]] = [
  {
    institution: 'Polytechnique Montréal',
    degree: {
      en: 'B.Eng. in Software Engineering',
      fr: 'Baccalauréat en génie logiciel',
    },
    track: {
      en: 'Artificial Intelligence and Data Science Track',
      fr: 'Orientation intelligence artificielle et sciences des données',
    },
    start: '2023-08',
    end: '2027-12',
    place: 'Montréal, QC',
    coursework: {
      en: ['Artificial Intelligence', 'Statistics for AI', 'Operations Research', 'Data Mining'],
      fr: [
        'intelligence artificielle',
        'statistiques pour l’IA',
        'recherche opérationnelle',
        'fouille de données',
      ],
    },
  },
];
