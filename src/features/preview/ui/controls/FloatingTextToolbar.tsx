"use client";

import { FontSizeControl } from "./FontSizeControl";

interface FloatingTextToolbarProps {
  fontSize: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  position: {
    top: number;
    left: number;
  };
}

export function FloatingTextToolbar({
  fontSize,
  onIncrease,
  onDecrease,
  onMouseEnter,
  onMouseLeave,
  position,
}: FloatingTextToolbarProps) {
  return (
    <div
      className="
    absolute z-[9999]
    -translate-x-1/2
    -translate-y-full
    rounded-lg
    border border-gray-200
    bg-white
    text-gray-900
    shadow-[0_6px_24px_rgba(0,0,0,0.2)]
  "
      style={{
        top: position.top,
        left: position.left,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <FontSizeControl
        value={fontSize}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
      />
    </div>
  );
}
