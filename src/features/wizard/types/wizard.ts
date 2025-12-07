import { PageType, PageContent } from "./page";
import { Section } from "./section";
import { WebsiteType } from "./website";

export interface WizardState {
  currentStep: number;
  websiteType: WebsiteType | null;
  selectedPages: PageType[];
  websiteName: string;
  tagline?: string;
  designType: string;
  primaryColor: string;
  secondaryColor: string;
  pageContents: PageContent[];
  websiteId: string | null; // <-- add this

  setWebsiteId: (id: string) => void;
  setCurrentStep: (step: number) => void;
  setWebsiteType: (type: WebsiteType) => void;
  togglePage: (page: PageType) => void;
  setWebsiteInfo: (
    info: Partial<{
      websiteName: string;
      tagline: string;
      designType: string;
      primaryColor: string;
      secondaryColor: string;
    }>
  ) => void;
  addSection: (page: PageType, section: Section) => void;
  updateSection: (
    page: PageType,
    sectionId: string,
    updates: Partial<Section>
  ) => void;
  deleteSection: (page: PageType, sectionId: string) => void;
  reorderSections: (page: PageType, sections: Section[]) => void;
  resetWizard: () => void;
}
