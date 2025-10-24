import { PageContent, PageType } from "../types"
import { Section } from "../types/section"
import { pageSectionsMap, defaultPagePlaceholders } from "../constants"
import { createSection } from "./sectionUtils"

/**
 * Initialize sections for a page
 * - Home page gets a default hero section
 * - Other pages use placeholders or default mapping
 */
export function initializePageSections(
  page: PageType,
  hydrated: boolean,
  pageContents: PageContent[],
  addSection: (page: PageType, section: Section) => void
) {
  const existing = pageContents.find(pc => pc.page === page)
  if (existing && existing.sections.length > 0) return

  // Home page gets default hero
  if (page === "home") {
    addSection(
      "home",
      createSection("home", "hero", hydrated, "Welcome to your website! Enter hero content here.")
    )
  }

  // Page-specific placeholders
  const placeholders = defaultPagePlaceholders[page] || []
  if (placeholders.length > 0) {
    placeholders.forEach(section =>
      addSection(page, createSection(page, section.type, hydrated, section.placeholder))
    )
  } else {
    const defaultTypes = pageSectionsMap[page] || []
    defaultTypes.forEach(type =>
      addSection(page, createSection(page, type, hydrated))
    )
  }
}
