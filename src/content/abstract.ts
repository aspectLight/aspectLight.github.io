import type { Localized } from '@i18n/locales';

export interface Abstract {
  readonly text: Localized<string>;
}

export const ABSTRACT: Abstract = {
  text: {
    en: 'Undergraduate in software engineering, artificial intelligence and data science track, graduating in December 2027. I like building things that make AI models more reliable. I live in Montréal and work in French and English.',
    fr: 'Étudiant au baccalauréat en génie logiciel, orientation intelligence artificielle et sciences des données\u202F; diplomation prévue en décembre 2027. J’aime bâtir des outils qui rendent les modèles d’IA plus fiables. J’habite à Montréal et je travaille en français et en anglais.',
  },
};
