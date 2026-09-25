import type { Locale } from '@i18n/locales';
import { UI } from '@i18n/ui';
import { CERTIFICATIONS } from '@content/certifications';
import { EDUCATION } from '@content/education';
import { PROJECTS } from '@content/projects';
import { SECTION_SETTINGS } from '@content/section-settings';
import {
  SECTION_IDS,
  isSectionVisible,
  numberVisibleSections,
  type SectionContent,
  type SectionId,
} from '@sections/sections';

export interface VisibleSection {
  readonly id: SectionId;
  readonly number: number;
  readonly title: string;
  readonly state: SectionContent<unknown>['state'];
  readonly emptyMessage: string;
}

function toSectionContent<T>(entries: readonly T[]): SectionContent<T> {
  const [first, ...rest] = entries;
  if (first === undefined) {
    return { state: 'empty' };
  }
  return { state: 'filled', entries: [first, ...rest] };
}

function emptyMessage(sectionId: SectionId, locale: Locale): string {
  if (sectionId === 'projects') {
    return UI[locale].emptyProjects;
  }
  if (sectionId === 'certifications') {
    return UI[locale].emptyCertifications;
  }
  return '';
}

export function buildHomeSections(locale: Locale): readonly VisibleSection[] {
  const education = toSectionContent(EDUCATION);
  const projects = toSectionContent(PROJECTS);
  const certifications = toSectionContent(CERTIFICATIONS);
  const visibility = {
    education: isSectionVisible(education, SECTION_SETTINGS.education),
    projects: isSectionVisible(projects, SECTION_SETTINGS.projects),
    certifications: isSectionVisible(certifications, SECTION_SETTINGS.certifications),
    contact: true,
  } satisfies Readonly<Record<SectionId, boolean>>;
  const numbers = numberVisibleSections(visibility);
  const visible: VisibleSection[] = [];

  for (const sectionId of SECTION_IDS) {
    const number = numbers[sectionId];
    if (number === undefined) {
      continue;
    }
    visible.push({
      id: sectionId,
      number,
      title: UI[locale].sectionTitle[sectionId],
      state: sectionId === 'contact' ? 'filled' : stateOf(sectionId, education, projects, certifications),
      emptyMessage: emptyMessage(sectionId, locale),
    });
  }

  return visible;
}

function stateOf(
  sectionId: SectionId,
  education: SectionContent<unknown>,
  projects: SectionContent<unknown>,
  certifications: SectionContent<unknown>,
): SectionContent<unknown>['state'] {
  if (sectionId === 'education') {
    return education.state;
  }
  if (sectionId === 'projects') {
    return projects.state;
  }
  if (sectionId === 'certifications') {
    return certifications.state;
  }
  return 'filled';
}
