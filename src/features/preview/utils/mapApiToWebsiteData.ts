import { WebsiteData, WebPages } from "../types";

interface ApiPage {
  id: string;
  content: WebPages[];
}

interface ApiData {
  title?: string;
  description?: string;
  design_type?: string;
  pages: ApiPage[];
}

export const mapApiToWebsiteData = (apiData: ApiData): WebsiteData => {
  const elements: WebPages[] = apiData.pages.flatMap((page) =>
    page.content.map((contentItem) => ({
      ...contentItem,
      page_id: page.id, // add page_id to each WebPages
    })),
  );
  return {
    elements,
    metadata: {
      title: apiData.title || "",
      description: apiData.description || "",
      theme: apiData.design_type || "light",
    },
  };
};
