import { WebsiteType } from "../types"
import { Briefcase, Home, Globe, ShoppingCart, Sparkles, Coffee } from "lucide-react"

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
    type: "shop" as WebsiteType,
    label: "Shop",
    description: "Showcase your products and offerings",
    icon: ShoppingCart,
  },
  {
    type: "marketing page" as WebsiteType,
    label: "Marketing Page",
    description: "Promote a product or service",
    icon: Sparkles,
  },
]

export const DESIGN_TYPES = ["Modern", "Minimalist", "Classic", "Creative", "Corporate"]
export const WEBSITE_TYPES = ["Portfolio", "Restaurant", "Hotel", "Travel Agency", "Marketing Page"]