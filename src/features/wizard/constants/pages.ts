import { PageType } from "../types"
import { Home, User, Mail, FileText, Briefcase, Package } from "lucide-react"

export const pageOptions = [
  { type: "home" as PageType, label: "Home", description: "Main landing page", icon: Home },
  { type: "about" as PageType, label: "About", description: "Tell your story", icon: User },
  { type: "contact" as PageType, label: "Contact", description: "Get in touch form", icon: Mail },
  { type: "blog" as PageType, label: "Blog", description: "Articles and posts", icon: FileText },
  { type: "services" as PageType, label: "Services", description: "What you offer", icon: Briefcase },
  { type: "products" as PageType, label: "Products", description: "Your product catalog", icon: Package },
]
