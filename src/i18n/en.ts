import { Locale } from '@core/enums/locale.enum';
import { SectionId } from '@core/enums/section-id.enum';
import type { Translations } from '@i18n/translations.types';

export const EN: Translations = {
  pageTitle: 'Sami Benabbou',
  pageDescription:
    'Undergraduate in software engineering, artificial intelligence and data science track, graduating in December 2027.',
  skipToContent: 'Skip to content',
  languageNavLabel: 'Language',
  localeLabels: {
    [Locale.En]: 'EN',
    [Locale.Fr]: 'FR',
  },
  authorLine: 'Software engineering · Polytechnique Montréal · Montréal',
  abstractLabel: 'Abstract.',
  avatarAlt:
    'Illustration: a black cat seen from behind, sitting in front of a wall of terracotta and sand hexagons, with a hand-hatched texture.',
  contactShortcutLabel: './contact',
  sectionTitles: {
    [SectionId.Education]: 'Education',
    [SectionId.Projects]: 'Projects',
    [SectionId.Certifications]: 'Certifications',
    [SectionId.Contact]: 'Contact',
  },
  emptyProjects: 'No projects deployed yet.',
  emptyCertifications: 'No certifications logged yet.',
  featureListLabel: 'Key figures',
  featureLabel: 'Feature',
  setIntro: 'Let',
  courseworkLabel: 'coursework',
  expectedLabel: '(expected)',
  sourceLabel: 'Source',
  demoLabel: 'Demo',
  verifyLabel: 'Verify',
  contactLead: 'Best way to prompt me: email.',
  linkedInLabel: 'LinkedIn',
  gitHubLabel: 'GitHub',
  revisionLabel: 'Checkpoint',
  epigraphQuote: '“All models are wrong, but some are useful.”',
  epigraphAuthor: 'George E. P. Box',
  notFoundMessage: '404: token not in vocabulary.',
  notFoundLinkLabel: 'Back to the beginning',
};
