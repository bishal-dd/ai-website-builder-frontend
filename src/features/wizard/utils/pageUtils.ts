import { PageType } from "../types"
import { SectionType } from "../types/section"
import { pageSectionsMap, defaultPagePlaceholders } from "../constants"
import { createSection } from "./sectionUtils"
import { Section } from "../types/section"

export const initializePageSections = (
  page: PageType,
  hydrated: boolean,
  pageContents: { page: PageType; sections: Section[] }[],
  addSection: (page: PageType, section: Section) => void
) => {
  if (!hydrated) return

  const existing = pageContents.find((pc) => pc.page === page)
  if (existing && existing.sections.length > 0) return

  const placeholders = defaultPagePlaceholders[page]
  if (placeholders?.length) {
    placeholders.forEach((section) =>
      addSection(page, createSection(page, section.type, hydrated, section.placeholder))
    )
  } else {
    const defaultTypes = pageSectionsMap[page] || []
    defaultTypes.forEach((type: SectionType) =>
      addSection(page, createSection(page, type, hydrated))
    )
  }
}
