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
