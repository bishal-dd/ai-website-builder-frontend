import { create } from "zustand"

export type WebsiteType = "portfolio" | "blog" | "ecommerce" | "landing"
export type PageType = "home" | "about" | "contact" | "blog" | "services" | "products"

export interface PageContent {
  page: PageType
  headline: string
  description: string
  imageUrl?: string
}

export interface WizardState {
  currentStep: number
  websiteType: WebsiteType | null
  selectedPages: PageType[]
  websiteName: string
  tagline: string
  ownerName: string
  ownerEmail: string
  primaryColor: string
  secondaryColor: string
  pageContents: PageContent[]

  setCurrentStep: (step: number) => void
  setWebsiteType: (type: WebsiteType) => void
  togglePage: (page: PageType) => void
  setWebsiteInfo: (info: {
    websiteName: string
    tagline: string
    ownerName: string
    ownerEmail: string
    primaryColor: string
    secondaryColor: string
  }) => void
  updatePageContent: (page: PageType, content: Partial<PageContent>) => void
  resetWizard: () => void
}

export const useWizardStore = create<WizardState>((set) => ({
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

  resetWizard: () =>
    set({
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
    }),
}))
