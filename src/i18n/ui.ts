import type { SectionId } from '@sections/sections';
import type { Locale } from '@i18n/locales';
import type { NonEmptyLeaves } from '@typescript/non-empty-leaves';

export interface UiStrings {
  readonly pageTitle: string;
  readonly pageDescription: string;
  readonly skipToContent: string;
  readonly languageNavLabel: string;
  readonly localeName: Readonly<Record<Locale, string>>;
  readonly authorLine: string;
  readonly abstractLabel: string;
  readonly contentsLabel: string;
  readonly contentsNavLabel: string;
  readonly sectionTitle: Readonly<Record<SectionId, string>>;
  readonly emptyProjects: string;
  readonly emptyCertifications: string;
  readonly courseworkLabel: string;
  readonly expectedLabel: string;
  readonly contactLead: string;
  readonly linkedInLabel: string;
  readonly gitHubLabel: string;
  readonly revisionLabel: string;
  readonly avatarAlt: string;
  readonly avatarCaption: string;
  readonly reliabilityCaption: string;
  readonly confidenceAxis: string;
  readonly accuracyAxis: string;
  readonly notFound: string;
  readonly notFoundReturn: string;
}

export const UI = {
  en: {
    pageTitle: 'Sami Benabbou',
    pageDescription:
      'Undergraduate in software engineering, artificial intelligence and data science track, graduating in December 2027.',
    skipToContent: 'Skip to content',
    languageNavLabel: 'Language',
    localeName: { en: 'EN', fr: 'FR' },
    authorLine: 'Software engineering · Polytechnique Montréal · Montréal',
    abstractLabel: 'Abstract.',
    contentsLabel: 'Contents',
    contentsNavLabel: 'Contents',
    sectionTitle: {
      education: 'Education',
      projects: 'Projects',
      certifications: 'Certifications',
      contact: 'Contact',
    },
    emptyProjects: 'No projects listed yet.',
    emptyCertifications: 'No certifications listed yet.',
    courseworkLabel: 'Relevant coursework',
    expectedLabel: '(expected)',
    contactLead: 'The best way to reach me is email.',
    linkedInLabel: 'LinkedIn',
    gitHubLabel: 'GitHub',
    revisionLabel: 'Rev.',
    avatarAlt:
      'Illustration: a black cat seen from behind, sitting in front of a wall of terracotta and sand hexagons, with a hand-hatched texture.',
    avatarCaption: 'Fig. 0 — Avatar: a cat on hexagons, hatched.',
    reliabilityCaption:
      'Fig. 1 — A reliability diagram (illustrative): where a model’s confidence meets reality.',
    confidenceAxis: 'confidence',
    accuracyAxis: 'accuracy',
    notFound: 'Section not found.',
    notFoundReturn: 'Back to the beginning',
  },
  fr: {
    pageTitle: 'Sami Benabbou',
    pageDescription:
      'Étudiant au baccalauréat en génie logiciel, orientation intelligence artificielle et sciences des données\u202F; diplomation prévue en décembre 2027.',
    skipToContent: 'Aller au contenu',
    languageNavLabel: 'Langue',
    localeName: { en: 'EN', fr: 'FR' },
    authorLine: 'Génie logiciel · Polytechnique Montréal · Montréal',
    abstractLabel: 'Résumé.',
    contentsLabel: 'Sommaire',
    contentsNavLabel: 'Sommaire',
    sectionTitle: {
      education: 'Formation',
      projects: 'Projets',
      certifications: 'Certifications',
      contact: 'Contact',
    },
    emptyProjects: 'Aucun projet pour l’instant.',
    emptyCertifications: 'Aucune certification pour l’instant.',
    courseworkLabel: 'Cours pertinents',
    expectedLabel: '(prévue)',
    contactLead: 'Le plus simple\u202F: un courriel.',
    linkedInLabel: 'LinkedIn',
    gitHubLabel: 'GitHub',
    revisionLabel: 'Rév.',
    avatarAlt:
      'Illustration\u202F: un chat noir vu de dos, assis devant un mur d’hexagones terre cuite et sable, à la texture hachurée.',
    avatarCaption: 'Fig. 0 — Avatar\u202F: un chat sur des hexagones, hachuré.',
    reliabilityCaption:
      'Fig. 1 — Diagramme de fiabilité (illustratif)\u202F: là où la confiance d’un modèle rejoint la réalité.',
    confidenceAxis: 'confiance',
    accuracyAxis: 'exactitude',
    notFound: 'Section introuvable.',
    notFoundReturn: 'Retour au début',
  },
} as const satisfies NonEmptyLeaves<Record<Locale, UiStrings>>;
