import type { Locale } from '@core/enums/locale.enum';
import type { SectionId } from '@core/enums/section-id.enum';

/** Every user-visible string. `en.ts` and `fr.ts` must both implement all of it. */
export interface Translations {
  readonly pageTitle: string;
  readonly pageDescription: string;
  readonly skipToContent: string;
  readonly languageNavLabel: string;
  readonly localeLabels: Readonly<Record<Locale, string>>;
  readonly abstractLabel: string;
  readonly avatarAlt: string;
  /** Terminal-style shortcuts from the title block down to the projects and the contact section. */
  readonly projectsShortcutLabel: string;
  readonly contactShortcutLabel: string;
  /** Heading of the short list of what is being worked on now. */
  readonly currentFocusLabel: string;
  readonly sectionTitles: Readonly<Record<SectionId, string>>;
  readonly emptyProjects: string;
  readonly emptyCertifications: string;
  /** Opens a set definition: "Let D = { … }". */
  readonly setIntro: string;
  readonly expectedLabel: string;
  readonly sourceLabel: string;
  readonly demoLabel: string;
  readonly verifyLabel: string;
  readonly contactLead: string;
  readonly linkedInLabel: string;
  readonly gitHubLabel: string;
  readonly revisionLabel: string;
  /** Words of the proximity-query readout: "3 queries · 9/22 edges", "reconstructed in 17 queries". */
  readonly queryLabel: string;
  readonly queriesLabel: string;
  readonly edgesLabel: string;
  readonly reconstructedLabel: string;
  readonly epigraphQuote: string;
  readonly epigraphAuthor: string;
  readonly notFoundMessage: string;
  readonly notFoundLinkLabel: string;
}
