import { Locale } from '@core/enums/locale.enum';
import { SectionId } from '@core/enums/section-id.enum';
import type { Translations } from '@i18n/translations.types';

// \u202F is the narrow no-break space French typography requires before « ; : ! ? ».
export const FR: Translations = {
  pageTitle: 'Sami Benabbou',
  pageDescription:
    'Étudiant au baccalauréat en génie logiciel, orientation intelligence artificielle et sciences des données ; diplomation prévue en décembre 2027.',
  skipToContent: 'Aller au contenu',
  languageNavLabel: 'Langue',
  localeLabels: {
    [Locale.En]: 'EN',
    [Locale.Fr]: 'FR',
  },
  authorLine: 'Génie logiciel · Polytechnique Montréal · Montréal',
  abstractLabel: 'Résumé.',
  avatarAlt:
    'Illustration : un chat noir vu de dos, assis devant un mur d’hexagones terre cuite et sable, à la texture hachurée.',
  contactShortcutLabel: './contact',
  sectionTitles: {
    [SectionId.Education]: 'Formation',
    [SectionId.Projects]: 'Projets',
    [SectionId.Certifications]: 'Certifications',
    [SectionId.Contact]: 'Contact',
  },
  emptyProjects: 'Aucun projet pour l’instant.',
  emptyCertifications: 'Aucune certification pour l’instant.',
  courseworkLabel: 'Cours pertinents',
  expectedLabel: '(prévue)',
  sourceLabel: 'Source',
  demoLabel: 'Démo',
  verifyLabel: 'Vérifier',
  contactLead: 'Le plus simple : un courriel.',
  linkedInLabel: 'LinkedIn',
  gitHubLabel: 'GitHub',
  revisionLabel: 'Rév.',
  notFoundMessage: 'Section introuvable.',
  notFoundLinkLabel: 'Retour au début',
};
