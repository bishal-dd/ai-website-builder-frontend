import { CarouselRenderer } from "@/features/preview/ui/interactiveComponents/CarouselRenderer";
import { findCarouselSlides } from "@/features/preview/utils/rendererElements";

import type { ComponentKey, RenderElementFn } from "../shared/rendererTypes";
import type { WebElement } from "@/features/preview/types";

interface CarouselElementRendererProps {
  element: WebElement;
  componentKey?: ComponentKey;
  isPaused: boolean;
  renderElement: RenderElementFn;
}

export function CarouselElementRenderer({
  element,
  componentKey,
  isPaused,
  renderElement,
}: CarouselElementRendererProps) {
  const { id, class: className, children, attributes } = element;

  const autoplay = String(attributes?.["data-autoplay"]) === "true";
  const intervalAttr = attributes?.["data-interval"];
  const interval = intervalAttr ? Number(intervalAttr) : undefined;
  const slides = findCarouselSlides(children);

  return (
    <CarouselRenderer
      key={id}
      className={className}
      slides={slides}
      autoplay={autoplay}
      interval={interval}
      isPaused={isPaused}
      renderElement={(child) => renderElement(child, componentKey)}
    />
  );
}
