export type WebElement = {
  id: number;
  tag: keyof HTMLElementTagNameMap | "svg" | "path" | "el-dropdown" | "el-menu";
  class?: string;
  attributes?: Record<string, string>;
  content?: string;
  type?: string;
  children?: WebElement[];
};

export type WebPages = {
  page: string;
  id: string;
  title: string;
  description: string;
  theme: string;
  pageContent: WebElement[];
  page_id: string;
};

export type WebsiteData = {
  elements: WebPages[];
  metadata?: {
    title?: string;
    description?: string;
    theme?: string;
  };
};
