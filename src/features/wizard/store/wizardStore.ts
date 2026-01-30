import { create } from "zustand";
import { WizardState } from "../types";
import { websitePageDefaults } from "../constants";
import { Section } from "../types/section";

const getInitialSections = (page: string): Section[] => {
  const isHome = page.toLowerCase() === "home";
  return [
    {
      id: crypto.randomUUID(),
      type: isHome ? "hero" : "content",
      content: "",
      aiGenerated: true,
    },
  ];
};

const defaultState: Omit<
  WizardState,
  | "setWebsiteId"
  | "setCurrentStep"
  | "setWebsiteType"
  | "togglePage"
  | "setWebsiteInfo"
  | "addSection"
  | "updateSection"
  | "deleteSection"
  | "reorderSections"
  | "resetWizard"
> = {
  currentStep: 1,
  websiteType: null,
  selectedPages: [],
  websiteName: "",
  designType: "",
  primaryColor: "",
  contactEmail: "",
  contactPhone: "",
  country: "",
  description: "",
  socialLinks: "",
  pageContents: [],
  websiteId: null,
};

export const useWizardStore = create<WizardState>((set) => ({
  ...defaultState,

  setWebsiteId: (id: string) => set({ websiteId: id }),

  setCurrentStep: (step) => set({ currentStep: step }),

  setWebsiteType: (type) =>
    set(() => {
      if (!type) return { websiteType: null };

      const config = websitePageDefaults[type];
      const pages = [
        ...new Set([...config.required, ...config.defaultSelected]),
      ];

      const initialPageContents = pages.map((page) => ({
        page,
        sections: getInitialSections(page),
      }));

      return {
        websiteType: type,
        selectedPages: pages,
        pageContents: initialPageContents,
      };
    }),

  togglePage: (page) =>
    set((state) => {
      if (!state.websiteType) return state;

      const { required } = websitePageDefaults[state.websiteType];
      if (required.includes(page)) return state;

      const isRemoving = state.selectedPages.includes(page);

      const nextSelectedPages = isRemoving
        ? state.selectedPages.filter((p) => p !== page)
        : [...state.selectedPages, page];

      // Keep pageContents synced so unvisited tabs still get sent to AI
      const nextPageContents = isRemoving
        ? state.pageContents.filter((pc) => pc.page !== page)
        : [
            ...state.pageContents,
            {
              page,
              sections: getInitialSections(page),
            },
          ];

      return {
        selectedPages: nextSelectedPages,
        pageContents: nextPageContents,
      };
    }),

  setWebsiteInfo: (info) => set(info),

  addSection: (page, section) =>
    set((state) => {
      const pageIndex = state.pageContents.findIndex((pc) => pc.page === page);
      const newPageContents = [...state.pageContents];

      if (pageIndex >= 0) {
        newPageContents[pageIndex] = {
          ...newPageContents[pageIndex],
          sections: [...newPageContents[pageIndex].sections, section],
        };
      } else {
        newPageContents.push({ page, sections: [section] });
      }

      return { pageContents: newPageContents };
    }),

  updateSection: (page, sectionId, updates) =>
    set((state) => {
      const pageIndex = state.pageContents.findIndex((pc) => pc.page === page);
      if (pageIndex < 0) return state;

      const newPageContents = [...state.pageContents];
      const sectionIndex = newPageContents[pageIndex].sections.findIndex(
        (s) => s.id === sectionId,
      );

      if (sectionIndex >= 0) {
        newPageContents[pageIndex].sections[sectionIndex] = {
          ...newPageContents[pageIndex].sections[sectionIndex],
          ...updates,
        };
      }

      return { pageContents: newPageContents };
    }),

  deleteSection: (page, sectionId) =>
    set((state) => {
      const pageIndex = state.pageContents.findIndex((pc) => pc.page === page);
      if (pageIndex < 0) return state;

      const newPageContents = [...state.pageContents];
      newPageContents[pageIndex].sections = newPageContents[
        pageIndex
      ].sections.filter((s) => s.id !== sectionId);

      return { pageContents: newPageContents };
    }),

  reorderSections: (page, sections) =>
    set((state) => {
      const pageIndex = state.pageContents.findIndex((pc) => pc.page === page);
      if (pageIndex < 0) return state;

      const newPageContents = [...state.pageContents];
      newPageContents[pageIndex].sections = sections;

      return { pageContents: newPageContents };
    }),

  resetWizard: () =>
    set((state) => {
      // If we have a type, reset back to that type's defaults
      if (state.websiteType) {
        const config = websitePageDefaults[state.websiteType];
        const pages = [
          ...new Set([...config.required, ...config.defaultSelected]),
        ];
        const initialPageContents = pages.map((page) => ({
          page,
          sections: getInitialSections(page),
        }));

        return {
          ...defaultState,
          websiteType: state.websiteType,
          selectedPages: pages,
          pageContents: initialPageContents,
        };
      }
      return defaultState;
    }),
}));
