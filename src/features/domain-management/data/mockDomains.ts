import { Domain } from "../types/domain";

export const mockDomains: Domain[] = [
  {
    id: "1",
    name: "myawesomesite.com",
    status: "active",
    registrar: "GoDaddy",
    expiryDate: "2025-12-15",
    autoRenew: true,
    connectedWebsite: "Portfolio",
  },
  {
    id: "2",
    name: "techblog.io",
    status: "active",
    registrar: "Namecheap",
    expiryDate: "2026-03-20",
    autoRenew: false,
    connectedWebsite: "Tech Blog",
  },
  {
    id: "3",
    name: "startup-demo.com",
    status: "pending",
    registrar: "Google Domains",
    expiryDate: "2025-08-10",
    autoRenew: true,
  },
];
