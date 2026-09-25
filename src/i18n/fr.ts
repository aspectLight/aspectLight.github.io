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
  emptyProjects: 'Aucun projet déployé pour l’instant.',
  emptyCertifications: 'Aucune certification enregistrée pour l’instant.',
  featureListLabel: 'Chiffres clés',
  featureLabel: 'Variable',
  setIntro: 'Soit',
  courseworkLabel: 'cours pertinents',
  expectedLabel: '(prévue)',
  sourceLabel: 'Source',
  demoLabel: 'Démo',
  verifyLabel: 'Vérifier',
  contactLead: 'Pour m’envoyer un prompt\u202F: un courriel.',
  linkedInLabel: 'LinkedIn',
  gitHubLabel: 'GitHub',
  revisionLabel: 'Point de contrôle',
  epigraphQuote: '«\u202FTous les modèles sont faux, mais certains sont utiles.\u202F»',
  epigraphAuthor: 'George E. P. Box',
  notFoundMessage: '404\u202F: jeton hors vocabulaire.',
  notFoundLinkLabel: 'Retour au début',
};
