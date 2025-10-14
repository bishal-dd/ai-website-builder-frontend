"use client"

import { useState, useEffect, useCallback } from "react"
import { useWizardStore } from "../store/wizardStore"
import { PageType } from "../types"
import { Section, SectionType } from "../types/section"
import { pageSectionsMap, defaultPagePlaceholders } from "../constants"

export function useStepFourLogic() {
  const { selectedPages, pageContents, addSection, updateSection, deleteSection } = useWizardStore()
  const [activeTab, setActiveTab] = useState<PageType>(selectedPages[0] || "home")
  const [hydrated, setHydrated] = useState(false) // track hydration

  // --- Helper: generate unique section ID (client-only)
  const generateSectionId = (page: PageType) => `${page}-${Date.now()}-${Math.random()}`

  // --- Helper: create a new section (ID only on client)
  const createSection = useCallback(
    (page: PageType, type: SectionType, placeholder?: string): Section => {
      const id = hydrated ? generateSectionId(page) : `${page}-${type}` // deterministic ID for SSR
      return {
        id,
        type,
        content: "",
        placeholder,
        imageUrl: "",
        items: ["features", "testimonials", "gallery", "faq"].includes(type) ? [""] : undefined,
      }
    },
    [hydrated]
  )

  // --- Initialize default sections for a page (client-only)
  const initializePage = useCallback(
    (page: PageType) => {
      if (!hydrated) return // only initialize after hydration

      const existing = pageContents.find((pc) => pc.page === page)
      if (existing && existing.sections.length > 0) return

      const placeholders = defaultPagePlaceholders[page]
      if (placeholders && placeholders.length > 0) {
        placeholders.forEach((section) => addSection(page, createSection(page, section.type, section.placeholder)))
      } else {
        const defaultTypes = pageSectionsMap[page] || []
        defaultTypes.forEach((type) => addSection(page, createSection(page, type)))
      }
    },
    [pageContents, addSection, createSection, hydrated]
  )

  // --- Hydration effect
  useEffect(() => {
    setHydrated(true)
  }, [])

  // --- Initialize when active tab changes (after hydration)
  useEffect(() => {
    if (hydrated && activeTab !== "home") initializePage(activeTab)
  }, [activeTab, initializePage, hydrated])

  // --- Get content of the active page
  const getCurrentPageContent = useCallback(
    () => pageContents.find((pc) => pc.page === activeTab) || { page: activeTab, sections: [] },
    [activeTab, pageContents]
  )

  // --- Section operations
  const handleAddSection = useCallback(
    (type: SectionType) => hydrated && addSection(activeTab, createSection(activeTab, type)),
    [activeTab, addSection, createSection, hydrated]
  )

  const handleUpdateSection = useCallback(
    (sectionId: string, updates: Partial<Section>) => updateSection(activeTab, sectionId, updates),
    [activeTab, updateSection]
  )

  const handleDeleteSection = useCallback(
    (sectionId: string) => deleteSection(activeTab, sectionId),
    [activeTab, deleteSection]
  )

  // --- Item operations
  const handleAddItem = useCallback(
    (sectionId: string, section: Section) =>
      handleUpdateSection(sectionId, { items: [...(section.items || []), ""] }),
    [handleUpdateSection]
  )

  const handleUpdateItem = useCallback(
    (sectionId: string, section: Section, itemIndex: number, value: string) => {
      const newItems = [...(section.items || [])]
      newItems[itemIndex] = value
      handleUpdateSection(sectionId, { items: newItems })
    },
    [handleUpdateSection]
  )

  const handleDeleteItem = useCallback(
    (sectionId: string, section: Section, itemIndex: number) =>
      handleUpdateSection(sectionId, { items: section.items?.filter((_, i) => i !== itemIndex) || [] }),
    [handleUpdateSection]
  )

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
    hydrated, // optional, in case UI wants to show loading
  }
}
