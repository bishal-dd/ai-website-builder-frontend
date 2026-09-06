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
      className="absolute z-40 -translate-x-1/2 -translate-y-full"
      style={{
        top: position.top - 8,
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
