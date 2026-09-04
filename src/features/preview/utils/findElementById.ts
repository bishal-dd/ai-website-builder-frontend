import type { WebElement } from "@/features/preview/types";

export function findElementById(
  elements: WebElement[],
  id: number,
): WebElement | null {
  for (const element of elements) {
    if (element.id === id) {
      return element;
    }

    if (element.children?.length) {
      const found = findElementById(element.children, id);

      if (found) {
        return found;
      }
    }
  }

  return null;
}
