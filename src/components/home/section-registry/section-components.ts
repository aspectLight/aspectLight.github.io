import { SectionId } from '@core/enums/section-id.enum';
import CertificationsSection from '../certifications/CertificationsSection.astro';
import ContactSection from '../contact/ContactSection.astro';
import EducationSection from '../education/EducationSection.astro';
import ProjectsSection from '../projects/ProjectsSection.astro';

/**
 * Which component renders each section. Adding a SectionId member without
 * a component here is a compile error.
 */
export const SECTION_COMPONENTS: Readonly<Record<SectionId, typeof EducationSection>> = {
  [SectionId.Education]: EducationSection,
  [SectionId.Projects]: ProjectsSection,
  [SectionId.Certifications]: CertificationsSection,
  [SectionId.Contact]: ContactSection,
};
