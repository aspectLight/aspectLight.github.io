export const SECTION_IDS = ['education', 'projects', 'certifications', 'contact'] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export type SectionContent<T> =
  | { readonly state: 'filled'; readonly entries: readonly [T, ...T[]] }
  | { readonly state: 'empty' };

export interface SectionSetting {
  readonly showWhenEmpty: boolean;
}

export function isSectionVisible<T>(content: SectionContent<T>, setting: SectionSetting): boolean {
  if (content.state === 'filled') {
    return true;
  }
  return setting.showWhenEmpty;
}

export function numberVisibleSections(
  visibility: Readonly<Record<SectionId, boolean>>,
): Readonly<Record<SectionId, number | undefined>> {
  const numbers: { [Key in SectionId]?: number } = {};
  let nextNumber = 1;

  for (const sectionId of SECTION_IDS) {
    if (visibility[sectionId]) {
      numbers[sectionId] = nextNumber;
      nextNumber += 1;
    }
  }

  return {
    education: numbers.education,
    projects: numbers.projects,
    certifications: numbers.certifications,
    contact: numbers.contact,
  };
}
