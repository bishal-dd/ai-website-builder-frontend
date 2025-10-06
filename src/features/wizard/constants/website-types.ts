import { WebsiteType } from "../types"
import { Briefcase, FileText, ShoppingCart, Sparkles } from "lucide-react"

export const websiteTypes = [
  { type: "portfolio" as WebsiteType, label: "Portfolio", description: "Showcase your work and skills", icon: Briefcase },
  { type: "blog" as WebsiteType, label: "Blog", description: "Share your thoughts and stories", icon: FileText },
  { type: "ecommerce" as WebsiteType, label: "E-commerce", description: "Sell products online", icon: ShoppingCart },
  { type: "landing" as WebsiteType, label: "Landing Page", description: "Promote a product or service", icon: Sparkles },
]
