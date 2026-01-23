import { WebsiteType } from "../types";
import {
  Briefcase,
  Home,
  Globe,
  Sparkles,
  Coffee,
  Building,
} from "lucide-react";

export const websiteTypes = [
  {
    type: "portfolio" as WebsiteType,
    label: "Portfolio",
    description: "Showcase your work and skills",
    icon: Briefcase,
  },
  {
    type: "restaurant" as WebsiteType,
    label: "Restaurant",
    description: "Promote your food and services",
    icon: Coffee,
  },
  {
    type: "hotel" as WebsiteType,
    label: "Hotel",
    description: "Showcase hotel listings and bookings",
    icon: Home,
  },
  {
    type: "travel agency" as WebsiteType,
    label: "Travel Agency",
    description: "Promote travel packages and bookings",
    icon: Globe,
  },
  {
    type: "marketing page" as WebsiteType,
    label: "Marketing Page (Default)",
    description: "Promote a product or service",
    icon: Sparkles,
  },
  {
    type: "smallMediumBusiness" as WebsiteType,
    label: "Small & Medium Business",
    description:
      "Create a website designed for small and medium-sized businesses",
    icon: Building,
  },
];

export const DESIGN_TYPES = ["Modern", "Creative", "Corporate"];
