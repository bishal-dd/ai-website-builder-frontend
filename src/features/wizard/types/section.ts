import {
  Sparkles,
  Grid3x3,
  MessageSquare,
  Megaphone,
  Images,
  HelpCircle,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Section types that can be used in a page.
 */
export type SectionType =
  | "hero"
  | "features"
  | "testimonials"
  | "cta"
  | "gallery"
  | "content"
  | "faq"
  | "team";

/**
 * A single section in a page.
 */
export interface Section {
  id: string;
  type: SectionType;
  content: string;
  imageUrl?: string;
  items?: string[]; // For features, testimonials, gallery, team members, products, FAQ, etc.
  placeholder?: string;
  aiGenerated?: boolean; // <--- new
}

/**
 * Meta info for each section type, used for UI dropdowns or mapping.
 */
export const sectionTypes: {
  value: SectionType;
  label: string;
  icon: LucideIcon;
  description: string;
}[] = [
  {
    value: "hero",
    label: "Hero Section",
    icon: Sparkles,
    description: "Large banner with headline and CTA",
  },
  {
    value: "features",
    label: "Features",
    icon: Grid3x3,
    description: "Highlight key features or services",
  },
  {
    value: "testimonials",
    label: "Testimonials",
    icon: MessageSquare,
    description: "Customer reviews and social proof",
  },
  {
    value: "cta",
    label: "Call to Action",
    icon: Megaphone,
    description: "Encourage users to take action",
  },
  {
    value: "gallery",
    label: "Gallery",
    icon: Images,
    description: "Image showcase or portfolio",
  },
  {
    value: "faq",
    label: "FAQ",
    icon: HelpCircle,
    description: "Frequently asked questions section",
  },
  {
    value: "team",
    label: "Team",
    icon: Users,
    description: "Show your team members with roles and bios",
  },
];
