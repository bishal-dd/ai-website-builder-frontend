import type React from "react";
import type { ReactElement } from "react";

import type { WebElement } from "@/features/preview/types";

export type DeviceType = "desktop" | "tablet" | "mobile";

export type ComponentKey = "navbar" | "footer";

export type FileInputRefs = React.MutableRefObject<
  Record<string, HTMLInputElement | null>
>;

export type RenderElementFn = (
  element: WebElement,
  componentKey?: ComponentKey,
) => ReactElement;

export type RendererElementProps = React.AllHTMLAttributes<HTMLElement> & {
  key: React.Key;
};

export type ImageChangeHandler = (
  event: React.ChangeEvent<HTMLInputElement>,
  id: number,
  componentKey?: ComponentKey,
) => void;

export type TextSaveHandler = (
  id: number,
  componentKey: ComponentKey | undefined,
  newContent: string,
) => void;

export interface BaseRendererProps {
  element: WebElement;
  componentKey?: ComponentKey;
  renderElement: RenderElementFn;
  fileInputRefs: FileInputRefs;
  uploadingImageId: number | null;
  onImageChange: ImageChangeHandler;
}
