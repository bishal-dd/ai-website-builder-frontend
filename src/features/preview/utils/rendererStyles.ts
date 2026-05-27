import type React from "react";

export const cssStringToObject = (
  cssString: string | undefined,
): React.CSSProperties => {
  if (!cssString) return {};

  const style: Record<string, string | number> = {};

  cssString.split(";").forEach((rule) => {
    const trimmed = rule.trim();

    if (!trimmed) return;

    const colonIndex = trimmed.indexOf(":");

    if (colonIndex === -1) return;

    const keyRaw = trimmed.slice(0, colonIndex).trim();
    const value = trimmed.slice(colonIndex + 1).trim();

    if (!keyRaw || !value) return;

    const key = keyRaw.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

    style[key] = value;
  });

  return style as React.CSSProperties;
};

export const hasExplicitSize = (className?: string) =>
  !!className?.match(/\b(w|h)-(\d+|\[.+?\])\b/);
