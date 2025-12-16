import { WebsiteData, WebPages, SharedComponents } from "../types";

// In mapApiToWebsiteData.ts

// ... (other imports)

// The API type for a page in the DB (like the object in your 'pages' array)
interface ApiPage {
  id: string;
  // The 'content' field in your API example *is* the WebPages object.
  // I'm assuming it looks like this:
  content: WebPages;
}

// Update the ApiData to use the new SharedComponents type
interface ApiData {
  title?: string;
  description?: string;
  design_type?: string;
  sequence: number;
  shared_components: SharedComponents; // <-- Use the new type
  pages: ApiPage[];
}

export const mapApiToWebsiteData = (apiData: ApiData): WebsiteData => {
  const elements: WebPages[] = apiData.pages.flatMap((page) => {
    // Assuming page.content is the full WebPages object based on your data structure
    return {
      ...page.content,
      page_id: page.id,
    };
  });

  // *** KEY CHANGE: Extract and include shared_components ***
  const sharedComponents: SharedComponents =
    apiData.shared_components as SharedComponents;

  return {
    elements,
    sharedComponents: sharedComponents, // <-- Include shared components
    metadata: {
      title: apiData.title || "",
      description: apiData.description || "",
      theme: apiData.design_type || "light",
    },
  };
};
