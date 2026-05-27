import { FIXED_MAIN_PAGE_SLUGS } from "@/features/preview/constants/previewPanel";
import type { PreviewPage } from "@/features/preview/types/previewPanel";
import type { WebElement, WebsiteData } from "../types/webElement";

export const canDeletePage = (pageSlug: string) => {
  const normalizedSlug = pageSlug.toLowerCase();
  const isSubPage = normalizedSlug.includes("/");

  if (isSubPage) {
    return true;
  }

  return !FIXED_MAIN_PAGE_SLUGS.includes(normalizedSlug);
};

export function getGroupedPreviewPages(elements: WebsiteData["elements"]) {
  const sortedPages = [...elements].sort(
    (a, b) => (a.sequence ?? 0) - (b.sequence ?? 0),
  );

  const mainPages = sortedPages.filter(
    (page) => !page.page.includes("/") || page.page === "index",
  );

  const nestedPages = sortedPages.filter(
    (page) => page.page.includes("/") && page.page !== "index",
  );

  const groupedSubPages = nestedPages.reduce(
    (acc, page) => {
      const parent = page.page.split("/")[0];

      if (!acc[parent]) {
        acc[parent] = [];
      }

      acc[parent].push(page);

      return acc;
    },
    {} as Record<string, PreviewPage[]>,
  );

  return {
    sortedPages,
    mainPages,
    nestedPages,
    groupedSubPages,
  };
}

export function getInitialPreviewPage(pages: PreviewPage[]) {
  return pages.find((page) => page.sequence === 1) ?? pages[0];
}

export function findScripts(elements: WebElement[]): WebElement[] {
  return elements.flatMap((element) => {
    const current = element.tag === "script" ? [element] : [];
    const nested = element.children ? findScripts(element.children) : [];

    return [...current, ...nested];
  });
}

export function getIframeWidth(device: "desktop" | "tablet" | "mobile") {
  return {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  }[device];
}
