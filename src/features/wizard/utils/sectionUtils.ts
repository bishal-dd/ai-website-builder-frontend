import { PageType } from "../types"
import { Section, SectionType } from "../types/section"

/** Generate unique section ID (random only on client) */
export const generateSectionId = (page: PageType) =>
  `${page}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

/** Create a new section object */
export const createSection = (
  page: PageType,
  type: SectionType,
  hydrated: boolean,
  placeholder?: string
): Section => ({
  id: hydrated ? generateSectionId(page) : `${page}-${type}`,
  type,
  content: "",
  placeholder,
  imageUrl: "",
  items: ["features", "testimonials", "gallery", "faq"].includes(type)
    ? [""]
    : undefined,
})
