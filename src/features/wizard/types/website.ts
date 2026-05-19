import { Section } from "./section";

export type WebsiteType =
  | "portfolio"
  | "restaurant"
  | "hotel"
  | "travel agency"
  | "smallMediumBusiness"
  | "real estate";

export type WizardStateForAPI = {
  websiteName: string;
  description?: string;
  designType?: string;
  primaryColor?: string;
  pageContents?: {
    page: string;
    sections: Section[];
  }[];
};

export type CreateWebsiteResponse = {
  success?: boolean;
  websiteId?: string;
  error?: string;
  jobId?: string;
};
