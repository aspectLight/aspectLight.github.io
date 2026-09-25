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
  emptyProjects: 'No projects listed yet.',
  emptyCertifications: 'No certifications listed yet.',
  courseworkLabel: 'Relevant coursework',
  expectedLabel: '(expected)',
  sourceLabel: 'Source',
  demoLabel: 'Demo',
  verifyLabel: 'Verify',
  contactLead: 'The best way to reach me is email.',
  linkedInLabel: 'LinkedIn',
  gitHubLabel: 'GitHub',
  revisionLabel: 'Rev.',
  notFoundMessage: 'Section not found.',
  notFoundLinkLabel: 'Back to the beginning',
};
