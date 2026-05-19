import { Section } from "./section";

export type PageType =
  | "home"
  | "about"
  | "contact"
  | "projects"
  | "services"
  | "team"
  | "products"
  | "shop"
  | "menu"
  | "rooms"
  | "amenities"
  | "location"
  | "tours"
  | "process"
  | "properties"
  | "agents";
export interface PageContent {
  page: PageType;
  sections: Section[];
}
