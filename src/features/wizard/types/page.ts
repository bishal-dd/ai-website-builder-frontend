import { Section } from "./section"

export type PageType = 
  | "home" | "about" | "contact" | "projects" | "services" 
  | "team" | "products" | "shop" | "pricing" | "menu" 
  | "rooms" | "amenities" | "location" | "tours" 
  | "process"

export interface PageContent {
  page: PageType
  sections: Section[]
  
}