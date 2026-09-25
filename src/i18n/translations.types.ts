import type { Locale } from '@core/enums/locale.enum';
import type { SectionId } from '@core/enums/section-id.enum';

/** Every user-visible string. `en.ts` and `fr.ts` must both implement all of it. */
export interface Translations {
  readonly pageTitle: string;
  readonly pageDescription: string;
  readonly skipToContent: string;
  readonly languageNavLabel: string;
  readonly localeLabels: Readonly<Record<Locale, string>>;
  readonly authorLine: string;
  readonly abstractLabel: string;
  readonly avatarAlt: string;
  /** Terminal-style shortcut from the title block down to the contact section. */
  readonly contactShortcutLabel: string;
  readonly sectionTitles: Readonly<Record<SectionId, string>>;
  readonly emptyProjects: string;
  readonly emptyCertifications: string;
  /** Accessible name of the "Feature xₙ." row. */
  readonly featureListLabel: string;
  /** "Feature" in "Feature x₁." */
  readonly featureLabel: string;
  /** Opens a set definition: "Let D = { … }". */
  readonly setIntro: string;
  /** Annotation after the coursework set: "← coursework". */
  readonly courseworkLabel: string;
  readonly expectedLabel: string;
  readonly sourceLabel: string;
  readonly demoLabel: string;
  readonly verifyLabel: string;
  readonly contactLead: string;
  readonly linkedInLabel: string;
  readonly gitHubLabel: string;
  readonly revisionLabel: string;
  readonly epigraphQuote: string;
  readonly epigraphAuthor: string;
  readonly notFoundMessage: string;
  readonly notFoundLinkLabel: string;
}
