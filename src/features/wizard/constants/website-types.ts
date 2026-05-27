import { WebsiteType } from "../types";
import { Briefcase, Home, Globe, Coffee, Building, Store } from "lucide-react";

export const websiteTypes = [
  {
    type: "hotel" as WebsiteType,
    label: "Hotel",
    description: "Showcase hotel listings and bookings",
    icon: Home,
  },
  {
    type: "restaurant" as WebsiteType,
    label: "Restaurant",
    description: "Promote your food and services",
    icon: Coffee,
  },
  {
    type: "portfolio" as WebsiteType,
    label: "Portfolio",
    description: "Showcase your work and skills",
    icon: Briefcase,
  },
  {
    type: "travel agency" as WebsiteType,
    label: "Travel Agency",
    description: "Promote travel packages and bookings",
    icon: Globe,
  },
  {
    type: "smallMediumBusiness" as WebsiteType,
    label: "Small & Medium Business",
    description:
      "Create a website for (shops, local businesses, or service-based brands)",
    icon: Store,
  },
  {
    type: "real estate" as WebsiteType,
    label: "Real Estate",
    description: "Showcase property listings and real estate services",
    icon: Building,
  },
];

export const DESIGN_TYPES = ["Modern", "Creative", "Corporate"];
