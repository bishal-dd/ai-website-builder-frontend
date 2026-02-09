import { PageType, PageContent } from "./page";
import { Section } from "./section";
import { WebsiteType } from "./website";

export interface WizardState {
  currentStep: number;
  websiteType: WebsiteType | null;
  selectedPages: PageType[];
  websiteName: string;
  designType: string;
  primaryColor: string;
  contactEmail?: string;
  contactPhone?: string;
  country: string;
  description: string;
  socialLinks: string;
  pageContents: PageContent[];
  websiteId: string | null;
  latitude: number | null;
  longitude: number | null;

  setWebsiteId: (id: string) => void;
  setCurrentStep: (step: number) => void;
  setWebsiteType: (type: WebsiteType) => void;
  togglePage: (page: PageType) => void;
  setWebsiteInfo: (
    info: Partial<{
      websiteName: string;
      designType: string;
      primaryColor: string;
      contactEmail: string;
      contactPhone: string;
      country: string;
      description: string;
      socialLinks: string;
      latitude: number | null;
      longitude: number | null;
    }>,
  ) => void;

  addSection: (page: PageType, section: Section) => void;
  updateSection: (
    page: PageType,
    sectionId: string,
    updates: Partial<Section>,
  ) => void;
  deleteSection: (page: PageType, sectionId: string) => void;
  reorderSections: (page: PageType, sections: Section[]) => void;
  resetWizard: () => void;
}

