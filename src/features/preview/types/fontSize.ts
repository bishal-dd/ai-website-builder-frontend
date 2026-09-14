export const FONT_SIZES = [
  { value: "text-xs", label: "12px" },
  { value: "text-sm", label: "14px" },
  { value: "text-base", label: "16px" },
  { value: "text-lg", label: "18px" },
  { value: "text-xl", label: "20px" },
  { value: "text-2xl", label: "24px" },
  { value: "text-3xl", label: "30px" },
  { value: "text-4xl", label: "36px" },
  { value: "text-5xl", label: "48px" },
  { value: "text-6xl", label: "60px" },
  { value: "text-7xl", label: "72px" },
  { value: "text-8xl", label: "96px" },
  { value: "text-9xl", label: "128px" },
] as const;

export type FontSize = (typeof FONT_SIZES)[number]["value"];
