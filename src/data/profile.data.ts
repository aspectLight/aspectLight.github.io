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
      'Software engineering student at Polytechnique Montréal, in the artificial intelligence and data science track. I like working on AI, especially optimization and algorithms, and making AI systems secure and robust.',
    [Locale.Fr]:
      'Étudiant en génie logiciel à Polytechnique Montréal, orientation intelligence artificielle et sciences des données. J’aime travailler en IA, surtout sur l’optimisation et les algorithmes, et sur la sécurité et la robustesse des systèmes d’IA.',
  },
};
