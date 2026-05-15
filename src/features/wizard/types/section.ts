import { Sparkles, Grid3x3, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Section types that can be used in a page.
 */
export type SectionType =
  | "hero"
  | "features"
  | "testimonials"
  | "gallery"
  | "content"
  | "faq"
  | "how-it-works"
  | "about-preview"
  | "cta"
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
    value: "faq",
    label: "Frequently Asked Questions",
    icon: Grid3x3,
    description: "Answers to common questions about your product or service",
  },
  {
    value: "testimonials",
    label: "Testimonials",
    icon: MessageSquare,
    description: "Customer reviews and social proof",
  },
  {
    value: "team",
    label: "Team",
    icon: MessageSquare,
    description: "Team members and their roles",
  },
];
