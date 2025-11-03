export type WebElement = {
  id: number;
  tag: keyof HTMLElementTagNameMap | "svg" | "path";
  class?: string;
  attributes?: Record<string, string>;
  content?: string;
  type?: string;
  children?: WebElement[];
};

export type WebPages = {
  page: string;
  id: number;
  title: string;
  description: string;
  theme: string;
  pageContent: WebElement[];
};

export type WebsiteData = {
  elements: WebPages[];
  metadata?: {
    title?: string;
    description?: string;
    theme?: string;
  };
};
