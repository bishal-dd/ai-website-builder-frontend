"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useWizardStore } from "../store/wizardStore";
import { PageType } from "../types";
import { Section, SectionType } from "../types/section";
import { initializePageSections } from "../utils/pageUtils";
import { createSection } from "../utils/sectionUtils";

export function useStepFourLogic() {
  const {
    selectedPages,
    pageContents,
    addSection,
    updateSection,
    deleteSection,
  } = useWizardStore();

  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<PageType>("home");

  // 🧠 Hydration guard (important for Zustand + Next)
  useEffect(() => {
    setHydrated(true);
  }, []);

  // 📌 Ensure "home" is always first
  const orderedPages = useMemo<PageType[]>(() => {
    return ["home", ...selectedPages.filter((page) => page !== "home")].filter(
      (page, index, self) => self.indexOf(page) === index,
    ) as PageType[];
  }, [selectedPages]);

  // 🏠 Sync active tab (default → home)
  useEffect(() => {
    if (!hydrated) return;

    if (!orderedPages.includes(activeTab)) {
      setActiveTab(orderedPages[0]);
    }
  }, [hydrated, orderedPages, activeTab]);

  // 🧱 Initialize sections when active page changes
  useEffect(() => {
    if (!hydrated) return;

    initializePageSections(activeTab, hydrated, pageContents, addSection);
  }, [activeTab, hydrated, pageContents, addSection]);

  // 🔍 Get content of current page
  const getCurrentPageContent = useCallback(() => {
    return (
      pageContents.find((pc) => pc.page === activeTab) || {
        page: activeTab,
        sections: [],
      }
    );
  }, [activeTab, pageContents]);

  // ⚙️ Section operations
  const handleAddSection = useCallback(
    (type: SectionType) => {
      if (!hydrated) return;

      const section = createSection(activeTab, type, hydrated);
      addSection(activeTab, section);
    },
    [activeTab, hydrated, addSection],
  );

  const handleUpdateSection = useCallback(
    (sectionId: string, updates: Partial<Section>) => {
      updateSection(activeTab, sectionId, updates);
    },
    [activeTab, updateSection],
  );

  const handleDeleteSection = useCallback(
    (sectionId: string) => {
      deleteSection(activeTab, sectionId);
    },
    [activeTab, deleteSection],
  );

  // ⚡ Item operations
  const handleAddItem = useCallback(
    (sectionId: string, section: Section) => {
      handleUpdateSection(sectionId, {
        items: [...(section.items || []), ""],
      });
    },
    [handleUpdateSection],
  );

  const handleUpdateItem = useCallback(
    (sectionId: string, section: Section, itemIndex: number, value: string) => {
      const newItems = [...(section.items || [])];
      newItems[itemIndex] = value;

      handleUpdateSection(sectionId, { items: newItems });
    },
    [handleUpdateSection],
  );

  const handleDeleteItem = useCallback(
    (sectionId: string, section: Section, itemIndex: number) => {
      handleUpdateSection(sectionId, {
        items: section.items?.filter((_, i) => i !== itemIndex) || [],
      });
    },
    [handleUpdateSection],
  );

  return {
    selectedPages: orderedPages,
    activeTab,
    setActiveTab,
    getCurrentPageContent,
    handleAddSection,
    handleUpdateSection,
    handleDeleteSection,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    hydrated,
  };
}
