import { Sparkles, Grid3x3, MessageSquare, Megaphone, Images, FileText, HelpCircle, Users, Package, BookOpen, Shield } from "lucide-react"

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
  | "team"
  | "products"
  | "pricing"
  | "contact"
  | "process"

/**
 * A single section in a page.
 */
export interface Section {
  tag: string
  id: string
  type: SectionType
  content: string
  imageUrl?: string
  items?: string[] // For features, testimonials, gallery, team members, products, FAQ, etc.
  placeholder?: string
  aiGenerated?: boolean // <--- new

}

/**
 * Meta info for each section type, used for UI dropdowns or mapping.
 */
export const sectionTypes: { value: SectionType; label: string; icon: any; description: string }[] = [
  { value: "hero", label: "Hero Section", icon: Sparkles, description: "Large banner with headline and CTA" },
  { value: "features", label: "Features", icon: Grid3x3, description: "Highlight key features or services" },
  { value: "testimonials", label: "Testimonials", icon: MessageSquare, description: "Customer reviews and social proof" },
  { value: "cta", label: "Call to Action", icon: Megaphone, description: "Encourage users to take action" },
  { value: "gallery", label: "Gallery", icon: Images, description: "Image showcase or portfolio" },
  { value: "content", label: "Page Content", icon: FileText, description: "Main text area for page content or intro" },
  { value: "faq", label: "FAQ", icon: HelpCircle, description: "Frequently asked questions section" },
  { value: "team", label: "Team", icon: Users, description: "Show your team members with roles and bios" },
  { value: "products", label: "Products", icon: Package, description: "Showcase products for e-commerce or catalog" },
  { value: "pricing", label: "Pricing", icon: Shield, description: "Pricing plans or service packages" },
  { value: "contact", label: "Contact", icon: BookOpen, description: "Contact form or details section" },
  { value: "process", label: "Process", icon: BookOpen, description: "Step-by-step workflow or process" },
]
