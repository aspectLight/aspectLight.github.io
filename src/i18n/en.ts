import { Locale } from '@core/enums/locale.enum';
import { SectionId } from '@core/enums/section-id.enum';
import type { Translations } from '@i18n/translations.types';

export const EN: Translations = {
  pageTitle: 'Sami Benabbou',
  pageDescription:
    'Software engineering student at Polytechnique Montréal working on combinatorial optimization, search algorithms and AI security.',
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
  currentFocusLabel: 'Currently',
  sectionTitles: {
    [SectionId.Education]: 'Education',
    [SectionId.Projects]: 'Projects',
    [SectionId.Certifications]: 'Certifications',
    [SectionId.Contact]: 'Contact',
  },
  emptyProjects: 'No projects deployed yet.',
  emptyCertifications: 'No certifications logged yet.',
  setIntro: 'Let',
  expectedLabel: '(expected)',
  sourceLabel: 'Source',
  demoLabel: 'Demo',
  verifyLabel: 'Verify',
  contactLead: 'Best way to prompt me: email.',
  linkedInLabel: 'LinkedIn',
  gitHubLabel: 'GitHub',
  revisionLabel: 'Checkpoint',
  queryLabel: 'query',
  queriesLabel: 'queries',
  edgesLabel: 'edges',
  reconstructedLabel: 'reconstructed in',
  epigraphQuote: '“All models are wrong, but some are useful.”',
  epigraphAuthor: 'George E. P. Box',
  notFoundMessage: '404: token not in vocabulary.',
  notFoundLinkLabel: 'Back to the beginning',
};
