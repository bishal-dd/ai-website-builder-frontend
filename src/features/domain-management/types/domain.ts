export type Domain = {
  id: string;
  name: string;
  status: "active" | "pending" | "transferred";
  registrar: string;
  expiryDate: string;
  autoRenew: boolean;
  connectedWebsite?: string;
};
