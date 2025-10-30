export type WebElement = {
  id: number;
  tag: keyof HTMLElementTagNameMap;
  class?: string;
  content?: string;
  type?: string;
  children?: WebElement[];
};

export type WebsiteData = {
  elements: WebElement[];
  metadata?: {
    title?: string;
    description?: string;
    theme?: string;
  };
};
