import type { WebElement } from "@/features/preview/types";

import type { DeviceType } from "@/features/preview/ui/renderer/shared/rendererTypes";

export type RendererKind =
  | "carousel"
  | "carousel-slide"
  | "overlay-section"
  | "hero-section"
  | "image"
  | "default";

export function getElementKey(element: WebElement, device: DeviceType) {
  return `${element.id}-${device}`;
}

export function getElementKind(element: WebElement): RendererKind {
  const componentType = element.attributes?.["data-component"];
  const elementRole = element.attributes?.["data-role"];

  if (componentType === "carousel") {
    return "carousel";
  }

  if (elementRole === "carousel-slide") {
    return "carousel-slide";
  }

  if (componentType === "overlay-section") {
    return "overlay-section";
  }

  if (componentType === "hero-section") {
    return "hero-section";
  }

  if (element.tag === "img") {
    return "image";
  }

  return "default";
}
