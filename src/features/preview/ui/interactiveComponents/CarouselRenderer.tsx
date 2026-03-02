"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { WebElement } from "@/features/preview/types";
import { cn } from "@/lib/utils";

interface CarouselRendererProps {
  slides: WebElement[];
  autoplay?: boolean;
  interval?: number;
  className?: string;
  device?: "desktop" | "tablet" | "mobile";
  isPaused?: boolean;
  renderElement?: (el: WebElement) => React.ReactElement;
}

export function CarouselRenderer({
  slides,
  autoplay = false,
  interval = 3000,
  isPaused = false,
  className,
  renderElement,
}: CarouselRendererProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const total = slides.length;

  const showSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const startInterval = () => {
    if (!autoplay || total <= 1) return;
    timerRef.current = window.setInterval(nextSlide, interval);
  };

  const resetInterval = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    startInterval();
  };

  useEffect(() => {
    // 1. Clear any existing timer
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // 2. Only start timer if autoplay is ON and we are NOT paused
    if (autoplay && total > 1 && !isPaused) {
      timerRef.current = window.setInterval(nextSlide, interval);
    }

    // 3. Cleanup on unmount or when dependencies change
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [autoplay, interval, total, isPaused, nextSlide]);

  if (!slides?.length) return null;

  return (
    <section className={cn(className)}>
      <div className="relative h-[80vh] overflow-hidden">
        {/* Slides */}
        {slides.map((slide, i) => {
          const isActive = i === currentIndex;

          const updatedSlide: WebElement = {
            ...slide,
            class: cn(
              "absolute inset-0 transition-opacity duration-500",
              isActive
                ? "opacity-100 z-10"
                : "opacity-0 z-0 pointer-events-none",
            ),
          };

          return renderElement?.(updatedSlide);
        })}
        {/* Prev */}
        {total > 1 && (
          <button
            onClick={() => {
              prevSlide();
              resetInterval();
            }}
            className="hidden md:flex absolute z-50 left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm"
          >
            ‹
          </button>
        )}

        {/* Next */}
        {total > 1 && (
          <button
            onClick={() => {
              nextSlide();
              resetInterval();
            }}
            className="hidden md:flex absolute z-50 right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm"
          >
            ›
          </button>
        )}

        {/* Dots */}
        {total > 1 && (
          <div className="absolute z-50 bottom-8 left-1/2 -translate-x-1/2 flex space-x-4">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  showSlide(i);
                  resetInterval();
                }}
                className={cn(
                  "w-3 h-3 rounded-full bg-white",
                  i === currentIndex ? "opacity-100" : "opacity-60",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
