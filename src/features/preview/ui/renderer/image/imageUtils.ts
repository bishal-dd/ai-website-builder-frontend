import type { WebElement } from "@/features/preview/types";

export function resolveImageSrc(element: WebElement) {
  const { content, attributes } = element;

  if (typeof content === "string" && content.startsWith("http")) {
    return content;
  }

  return attributes?.src as string | undefined;
}

export function isBackgroundImageElement(element: WebElement) {
  const role = element.attributes?.["data-role"];

  return role === "carousel-bg" || role === "overlay-bg";
}

export function resolveImageRole(element: WebElement) {
  const explicitRole = element.attributes?.["data-role"];

  if (typeof explicitRole === "string") {
    return explicitRole;
  }

  const className = element.class;

  if (
    className?.includes("h-[") ||
    className?.includes("h-full") ||
    className?.includes("object-cover") ||
    className?.includes("absolute")
  ) {
    return "cover";
  }

  return "contain";
}

export function isAvatarImage(element: WebElement) {
  const className = element.class;

  return Boolean(
    className?.includes("rounded-full") && className?.match(/\bw-\d+/),
  );
}

export function findBackgroundImage(
  children: WebElement[] | undefined,
  role: "carousel-bg" | "overlay-bg",
) {
  return children?.find(
    (child) => child.tag === "img" && child.attributes?.["data-role"] === role,
  );
}
