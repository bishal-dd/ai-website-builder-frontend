import { PageType, WebsiteType } from "@/features/wizard/store/wizardStore"
import { Briefcase, FileText, Home, Mail, Package, ShoppingCart, Sparkles, User } from "lucide-react"

export const STEPS = [
  { number: 1, label: "Website Type" },
  { number: 2, label: "Select Pages" },
  { number: 3, label: "Information" },
  { number: 4, label: "Page Content" },
]

export const pageOptions = [
  {
    type: "home" as PageType,
    label: "Home",
    description: "Main landing page",
    icon: Home,
  },
  {
    type: "about" as PageType,
    label: "About",
    description: "Tell your story",
    icon: User,
  },
  {
    type: "contact" as PageType,
    label: "Contact",
    description: "Get in touch form",
    icon: Mail,
  },
  {
    type: "blog" as PageType,
    label: "Blog",
    description: "Articles and posts",
    icon: FileText,
  },
  {
    type: "services" as PageType,
    label: "Services",
    description: "What you offer",
    icon: Briefcase,
  },
  {
    type: "products" as PageType,
    label: "Products",
    description: "Your product catalog",
    icon: Package,
  },
]

export const websiteTypes = [
  {
    type: "portfolio" as WebsiteType,
    label: "Portfolio",
    description: "Showcase your work and skills",
    icon: Briefcase,
  },
  {
    type: "blog" as WebsiteType,
    label: "Blog",
    description: "Share your thoughts and stories",
    icon: FileText,
  },
  {
    type: "ecommerce" as WebsiteType,
    label: "E-commerce",
    description: "Sell products online",
    icon: ShoppingCart,
  },
  {
    type: "landing" as WebsiteType,
    label: "Landing Page",
    description: "Promote a product or service",
    icon: Sparkles,
  },
]