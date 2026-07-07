import {
  Building2,
  Hotel,
  House,
  Plane,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type TemplateCategory = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  image?: string;
};

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: "hotel",
    title: "Hotel",
    description: "Hotels, resorts and lodges",
    icon: Hotel,
    image: "/images/category/hotel.png",
  },
  {
    id: "restaurant",
    title: "Restaurant",
    description: "Restaurants, cafés and bakeries",
    icon: UtensilsCrossed,
    image: "/images/category/restaurant.png",
  },
  {
    id: "portfolio",
    title: "Portfolio",
    description: "Personal websites and portfolios",
    icon: Building2,
    image: "/images/category/portfolio.png",
  },
  {
    id: "travel-agency",
    title: "Travel Agency",
    description: "Tours, travel and trekking companies",
    icon: Plane,
    image: "/images/category/travel-agency.png",
  },
  {
    id: "small-medium-business",
    title: "Small & Medium Business",
    description: "Corporate and business websites",
    icon: Store,
    image: "/images/category/smb.png",
  },
  {
    id: "real-estate",
    title: "Real Estate",
    description: "Property agencies and listings",
    icon: House,
    image: "/images/category/real-estate.png",
  },
];
