import { Section } from "./section";

export type WebsiteType = "portfolio" | "restaurant" | "hotel" | "travel agency" | "marketing page"

export type WizardStateForAPI = {
  websiteName: string;
  description?: string;
  designType?: string;
  primaryColor?: string;
  secondaryColor?: string;
  pageContents?: {
    page: string;
    sections: Section[];
  }[]; 
};

export type CreateWebsiteResponse = {
  success?: boolean;
  websiteId?: string;
  error?: string;
};