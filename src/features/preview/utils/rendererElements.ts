import type { WebElement } from "@/features/preview/types";

export function findCarouselSlides(nodes?: WebElement[]): WebElement[] {
  if (!nodes) return [];

  return nodes.flatMap((node) => {
    if (node.attributes?.["data-role"] === "carousel-slide") {
      return [node];
    }

    return findCarouselSlides(node.children);
  });
}
