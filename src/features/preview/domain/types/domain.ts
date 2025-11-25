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
