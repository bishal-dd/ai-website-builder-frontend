const FONT_SIZE_CLASSES = new Set([
  "text-xs",
  "text-sm",
  "text-base",
  "text-lg",
  "text-xl",
  "text-2xl",
  "text-3xl",
  "text-4xl",
  "text-5xl",
  "text-6xl",
  "text-7xl",
  "text-8xl",
  "text-9xl",
]);

const DEVICE_PREFIX: Record<"desktop" | "tablet" | "mobile", string> = {
  mobile: "",
  tablet: "sm:",
  desktop: "lg:",
};

export function updateFontSizeClass(
  className: string | undefined,
  newFontSize: string,
  device: "desktop" | "tablet" | "mobile",
): string {
  const classes = className?.trim().split(/\s+/).filter(Boolean) ?? [];

  const prefix = DEVICE_PREFIX[device];

  const filteredClasses = classes.filter((className) => {
    if (prefix === "") {
      return !FONT_SIZE_CLASSES.has(className);
    }

    return !(
      className.startsWith(prefix) &&
      FONT_SIZE_CLASSES.has(className.slice(prefix.length))
    );
  });

  return [...filteredClasses, `${prefix}${newFontSize}`].join(" ");
}
