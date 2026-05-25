import type { WebElement } from "@/features/preview/types/webElement";

export function updateElementRecursive(
  elements: WebElement[],
  elementId: number,
  updates: Partial<WebElement>,
): WebElement[] {
  return elements.map((element) => {
    if (element.id === elementId) {
      return {
        ...element,
        ...updates,
      };
    }

    if (element.children) {
      return {
        ...element,
        children: updateElementRecursive(element.children, elementId, updates),
      };
    }

    return element;
  });
}
