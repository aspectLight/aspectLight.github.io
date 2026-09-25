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
      'Software engineering student at Polytechnique Montréal, in the artificial intelligence and data science track. I like problems where the answer has to be searched for, and systems that have to keep working when someone is trying to break them.',
    [Locale.Fr]:
      'Étudiant en génie logiciel à Polytechnique Montréal, orientation intelligence artificielle et sciences des données. J’aime les problèmes dont la réponse doit se chercher, et les systèmes qui doivent tenir quand quelqu’un essaie de les casser.',
  },
};
