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
  currency: string;
}

export interface SelectedDomain {
  domain: string;
  price: number;
  currency: string;
}

export interface PricingDetails {
  domainPrice: number;
  hostingPrice: number;
  websiteGenerationPrice: number;
  totalPrice: number;
  currency: string;
}
