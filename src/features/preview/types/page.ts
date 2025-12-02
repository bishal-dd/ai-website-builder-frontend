export type PageUpdate = {
  website_id?: string | undefined;
  title?: string | undefined;
  description?: string | undefined;
  page_file_id?: string | undefined;
  content?: object;
};

export type SectionContent = {
  id: string;
  type: string;
  tag?: string;
  navId?: string;
  class?: string;
  content: SectionContent[] | string[];
};

export type PageContent = {
  page: string;
  sections: SectionContent[];
};
