import { create } from "zustand";
import { WizardState } from "../types";

const REQUIRED_PAGE = "home";

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
  selectedPages: [REQUIRED_PAGE],
  websiteName: "",
  tagline: "",
  designType: "",
  primaryColor: "",
  secondaryColor: "",
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

  setWebsiteId: (id: string) => set({ websiteId: id }), // <-- new setter

  setCurrentStep: (step) => set({ currentStep: step }),

  setWebsiteType: (type) => set({ websiteType: type }),

  togglePage: (page) =>
    set((state) => {
      if (page === REQUIRED_PAGE) return state;

      return {
        selectedPages: state.selectedPages.includes(page)
          ? state.selectedPages.filter((p) => p !== page)
          : [...state.selectedPages, page],
      };
    }),

  setWebsiteInfo: (info) => set(info),

  addSection: (page, section) =>
    set((state) => {
      const existingPageIndex = state.pageContents.findIndex(
        (pc) => pc.page === page,
      );
      const newPageContents = [...state.pageContents];

      if (existingPageIndex >= 0) {
        newPageContents[existingPageIndex] = {
          ...newPageContents[existingPageIndex],
          sections: [...newPageContents[existingPageIndex].sections, section],
        };
      } else {
        newPageContents.push({
          page,
          sections: [section],
        });
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

  resetWizard: () => set({ ...defaultState, selectedPages: [REQUIRED_PAGE] }),
}));
