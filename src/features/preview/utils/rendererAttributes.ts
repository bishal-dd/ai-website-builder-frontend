export const normalizeAttributes = (
  attrs?: Record<string, unknown>,
): Record<string, unknown> => {
  if (!attrs) return {};

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(attrs)) {
    if (key === "style") continue;

    if (key.startsWith("data-")) {
      result[key] = value;
      continue;
    }

    if (key.startsWith("aria-")) {
      result[key] = value;
      continue;
    }

    if (key.toLowerCase().startsWith("on")) {
      if (typeof value === "function") {
        const reactEvent = `on${key.slice(2, 3).toUpperCase()}${key.slice(3)}`;
        result[reactEvent] = value;
      }

      continue;
    }

    const camelKey = key.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

    const allowedAttributes = new Set([
      "src",
      "alt",
      "href",
      "target",
      "rel",
      "className",
      "id",
      "title",
      "width",
      "height",
      "viewBox",
      "fill",
      "stroke",
      "xmlns",
      "strokeWidth",
      "strokeLinecap",
      "strokeLinejoin",
      "d",
      "r",
      "cx",
      "cy",
    ]);

    if (
      camelKey.startsWith("data-") ||
      camelKey.startsWith("aria-") ||
      allowedAttributes.has(camelKey)
    ) {
      result[camelKey] = value;
    }
  }

  return result;
};
