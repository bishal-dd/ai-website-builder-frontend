import { SharedComponents } from "@/features/preview/types";

export interface WebsiteTemplate {
  id: string;

  name: string;
  description?: string;

  thumbnail?: string;
  category?: string;

  design_type?: string;
  primary_color?: string;
  font_family: string;

  shared_components?: SharedComponents;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}
