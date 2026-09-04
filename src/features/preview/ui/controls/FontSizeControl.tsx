"use client";

import { ArrowDown, ArrowUp, Type } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FontSizeControlProps {
  value: string;
  onIncrease: () => void;
  onDecrease: () => void;
}

const FONT_SIZES = [
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
];

export function FontSizeControl({
  value,
  onIncrease,
  onDecrease,
}: FontSizeControlProps) {
  const currentIndex = FONT_SIZES.findIndex((size) => size.value === value);

  const resolvedIndex =
    currentIndex === -1
      ? FONT_SIZES.findIndex((size) => size.value === "text-base")
      : currentIndex;

  const currentSize = FONT_SIZES[resolvedIndex];

  const isMin = resolvedIndex === 0;
  const isMax = resolvedIndex === FONT_SIZES.length - 1;

  return (
    <div
      className="
        flex h-9 items-center
        rounded-md
        border border-gray-200
        bg-white
        px-1
        text-gray-900
        shadow-lg
      "
    >
      <div className="flex items-center gap-1.5 px-2">
        <Type className="h-3.5 w-3.5 shrink-0 text-gray-500" strokeWidth={2} />

        <span className="min-w-9.5 text-center text-xs font-medium text-gray-700">
          {currentSize.label}
        </span>
      </div>

      <div className="mx-1 h-5 w-px bg-gray-200" />

      <div className="flex items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="
            h-7 w-7
            text-gray-700
            hover:bg-gray-100
            hover:text-gray-900
            disabled:cursor-not-allowed
            disabled:opacity-30
          "
          disabled={isMin}
          onClick={onDecrease}
          title="Decrease font size"
        >
          <ArrowDown className="h-3.5 w-3.5" strokeWidth={2} />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="
            h-7 w-7
            text-gray-700
            hover:bg-gray-100
            hover:text-gray-900
            disabled:cursor-not-allowed
            disabled:opacity-30
          "
          disabled={isMax}
          onClick={onIncrease}
          title="Increase font size"
        >
          <ArrowUp className="h-3.5 w-3.5" strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}
