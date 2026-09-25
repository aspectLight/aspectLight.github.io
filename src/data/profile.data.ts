import { Locale } from '@core/enums/locale.enum';
import type { Profile } from '@core/types/profile.types';

export const PROFILE: Profile = {
  givenName: 'Sami',
  familyName: 'Benabbou',
  email: 'aspectlight93@gmail.com',
  linkedInUrl: 'https://www.linkedin.com/in/sami-benabbou-90195837b/',
  gitHubUrl: 'https://github.com/aspectLight',
  abstract: {
    [Locale.En]:
      'Undergraduate in software engineering, artificial intelligence and data science track, graduating in December 2027. I like building things that make AI models more reliable. I live in Montréal and work in French and English.',
    [Locale.Fr]:
      'Étudiant au baccalauréat en génie logiciel, orientation intelligence artificielle et sciences des données ; diplomation prévue en décembre 2027. J’aime bâtir des outils qui rendent les modèles d’IA plus fiables. J’habite à Montréal et je travaille en français et en anglais.',
  },
};
