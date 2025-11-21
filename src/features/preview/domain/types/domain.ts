export interface DomainContact {
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  AddressLine1: string;
  AddressLine2?: string;
  City: string;
  State: string;
  CountryCode: string; // e.g., "BT"
  ZipCode: string;
}
