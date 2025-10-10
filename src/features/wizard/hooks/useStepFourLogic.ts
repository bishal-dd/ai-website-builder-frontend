"use client"

import { useState, useEffect } from "react"
import { useWizardStore } from "../store/wizardStore"
import { PageType } from "../types"
import { Section, SectionType } from "../types/section"
import { pageSectionsMap, defaultPagePlaceholders } from "../constants"

export function useStepFourLogic() {
  const { selectedPages, pageContents, addSection, updateSection, deleteSection } = useWizardStore()
  const [activeTab, setActiveTab] = useState<PageType>(selectedPages[0] || "home")

  // --- Helper: create a new section
  const createSection = (page: PageType, type: SectionType): Section => ({
    id: `${page}-${Date.now()}-${Math.random()}`,
    type,
    content: "",
    imageUrl: "",
    items: ["features", "testimonials", "gallery", "faq"].includes(type) ? [""] : undefined,
  })

  // --- Initialize default sections for non-home pages
  const initializePage = (page: PageType) => {
    const existing = pageContents.find((pc) => pc.page === page)
    if (existing && existing.sections.length > 0) return // already initialized

    // Check if page has placeholder content
    const placeholders = defaultPagePlaceholders[page]
    if (placeholders && placeholders.length > 0) {
      placeholders.forEach((section) => addSection(page, section))
    } else {
      // Fallback: use default section types (if no placeholders exist)
      const defaultTypes = pageSectionsMap[page] || []
      defaultTypes.forEach((type) => addSection(page, createSection(page, type)))
    }
  }

  // --- Initialize when active tab changes
  useEffect(() => {
    if (activeTab !== "home") initializePage(activeTab)
  }, [activeTab, pageContents])

  // --- Get content of the active page
  const getCurrentPageContent = () =>
    pageContents.find((pc) => pc.page === activeTab) || { page: activeTab, sections: [] }

  // --- Section operations
  const handleAddSection = (type: SectionType) => addSection(activeTab, createSection(activeTab, type))
  const handleUpdateSection = (sectionId: string, updates: Partial<Section>) =>
    updateSection(activeTab, sectionId, updates)
  const handleDeleteSection = (sectionId: string) => deleteSection(activeTab, sectionId)

  // --- Item operations
  const handleAddItem = (sectionId: string, section: Section) =>
    handleUpdateSection(sectionId, { items: [...(section.items || []), ""] })
  const handleUpdateItem = (sectionId: string, section: Section, itemIndex: number, value: string) => {
    const newItems = [...(section.items || [])]
    newItems[itemIndex] = value
    handleUpdateSection(sectionId, { items: newItems })
  }
  const handleDeleteItem = (sectionId: string, section: Section, itemIndex: number) =>
    handleUpdateSection(sectionId, { items: section.items?.filter((_, i) => i !== itemIndex) || [] })

  return {
    selectedPages,
    activeTab,
    setActiveTab,
    getCurrentPageContent,
    handleAddSection,
    handleUpdateSection,
    handleDeleteSection,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
  }
}
