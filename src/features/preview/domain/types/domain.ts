export interface DomainContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface DomainSuggestion {
  domain: string;
  available: boolean;
  price: number;
  currency: "BTN" | "USD";
}

export interface SelectedDomain {
  id?: string;
  domain: string;
  price: number;
  currency: string;
  hostingPrice?: number;
  websitePrice?: number;
}

export interface PricingDetails {
  domainPrice: number;
  hostingPrice: number;
  websiteGenerationPrice: number;
  totalPrice: number;
  currency: string;
}
