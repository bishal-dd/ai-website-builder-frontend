import { create } from "zustand"
import { WizardState } from "../types"

// 📝 Define all your default values ONCE here
const initialState: Omit<WizardState, 
  "setCurrentStep" | 
  "setWebsiteType" | 
  "togglePage" | 
  "setWebsiteInfo" | 
  "updatePageContent" | 
  "resetWizard"
> = {
  currentStep: 1,
  websiteType: null,
  selectedPages: [],
  websiteName: "",
  tagline: "",
  ownerName: "",
  ownerEmail: "",
  primaryColor: "#8b5cf6",
  secondaryColor: "#6366f1",
  pageContents: [],
}

export const useWizardStore = create<WizardState>((set) => ({
  ...initialState,

  setCurrentStep: (step) => set({ currentStep: step }),

  setWebsiteType: (type) => set({ websiteType: type }),

  togglePage: (page) =>
    set((state) => ({
      selectedPages: state.selectedPages.includes(page)
        ? state.selectedPages.filter((p) => p !== page)
        : [...state.selectedPages, page],
    })),

  setWebsiteInfo: (info) => set(info),

  updatePageContent: (page, content) =>
    set((state) => {
      const existingIndex = state.pageContents.findIndex((pc) => pc.page === page)
      const newPageContents = [...state.pageContents]

      if (existingIndex >= 0) {
        newPageContents[existingIndex] = {
          ...newPageContents[existingIndex],
          ...content,
        }
      } else {
        newPageContents.push({
          page,
          headline: "",
          description: "",
          ...content,
        })
      }

      return { pageContents: newPageContents }
    }),

  resetWizard: () => set(initialState),
}))
