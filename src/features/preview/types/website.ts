import { SharedComponents } from "./webElement";
export type WebsiteInput = {
  title: string;
  description?: string;
  design_type?: string;
  primary_color?: string;
  secondary_color?: string;
  shared_components?: SharedComponents;
  color?: string;
  type?: string;
  floating_whatsapp_enabled?: boolean;
  is_congrats_modal_shown?: boolean;
  font_family?: string;
};

export type WebsiteUpdate = Partial<WebsiteInput>;
