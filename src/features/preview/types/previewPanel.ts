import type { WebElement, WebsiteData } from "../types/webElement";

export type DeviceType = "desktop" | "tablet" | "mobile";

export type PreviewPage = WebsiteData["elements"][number];

export interface PreviewPanelJsonProps {
  websiteId: string;
  websiteData: WebsiteData;
  contactPhone: string;
  isAdmin: boolean;
  onUpdateElement?: (
    pageId: string,
    elementId: number,
    updates: Partial<WebElement>,
  ) => void;
  onUpdateSharedElement: (
    componentKey: "navbar" | "footer",
    elementId: number,
    updates: Partial<WebElement>,
  ) => void;
  onPageChange: (pageId: string) => void;
  currentPageId: string;
  onReorderSections: (pageId: string, reorderedSections: WebElement[]) => void;
  onDeleteSection?: (pageId: string, sectionId: number) => void;
}
