export type Domain = {
  id: string;
  name: string;
  status:
    | "active"
    | "pending"
    | "transferred"
    | "transferred_out"
    | "transfer_requested"
    | "transfer_failed";
  registrar: string;
  expiryDate: string;
  autoRenew: boolean;
  connectedWebsite?: string;
};
