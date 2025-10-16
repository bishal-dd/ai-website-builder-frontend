"use client"

import { useState, useEffect, useCallback } from "react"
import { useWizardStore } from "../store/wizardStore"
import { PageType } from "../types"
import { Section } from "../types/section"
import { initializePageSections } from "../utils/pageUtils"

export function useStepFourLogic() {
  const { selectedPages, pageContents, addSection, updateSection, deleteSection } =
    useWizardStore()
  const [activeTab, setActiveTab] = useState<PageType>(selectedPages[0] || "home")
  const [hydrated, setHydrated] = useState(false)

  // 🧠 Hydration
  useEffect(() => {
    setHydrated(true)
  }, [])

  // 🧱 Initialize sections when active tab changes
  useEffect(() => {
    if (hydrated) initializePageSections(activeTab, hydrated, pageContents, addSection)
  }, [activeTab, pageContents, addSection, hydrated])

  // 🔍 Get content of current page
  const getCurrentPageContent = useCallback(
    () => pageContents.find((pc) => pc.page === activeTab) || { page: activeTab, sections: [] },
    [activeTab, pageContents]
  )

  // ⚙️ Section operations
  const handleUpdateSection = useCallback(
    (sectionId: string, updates: Partial<Section>) =>
      updateSection(activeTab, sectionId, updates),
    [activeTab, updateSection]
  )

  const handleDeleteSection = useCallback(
    (sectionId: string) => deleteSection(activeTab, sectionId),
    [activeTab, deleteSection]
  )

  // ⚡ Item operations
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
      handleUpdateSection(sectionId, {
        items: section.items?.filter((_, i) => i !== itemIndex) || [],
      }),
    [handleUpdateSection]
  )

  return {
    selectedPages,
    activeTab,
    setActiveTab,
    getCurrentPageContent,
    handleUpdateSection,
    handleDeleteSection,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    hydrated,
  }
}
