import { createElement } from "react";

import type { WebElement } from "@/features/preview/types";

import type {
  ComponentKey,
  RendererElementProps,
  RenderElementFn,
} from "./shared/rendererTypes";

interface DefaultElementRendererProps {
  element: WebElement;
  props: RendererElementProps;
  componentKey?: ComponentKey;
  renderElement: RenderElementFn;
}

export function DefaultElementRenderer({
  element,
  props,
  componentKey,
  renderElement,
}: DefaultElementRendererProps) {
  const { tag, content, children } = element;

  if (tag === "svg") {
    props.style = {
      ...props.style,
      flexShrink: 0,
      display: "block",
    };
  }

  const childElements = children
    ? children.flatMap((child, index) => {
        const childElement = renderElement(child, componentKey);

        if (index < children.length - 1) {
          return [childElement, " "];
        }

        return [childElement];
      })
    : content
      ? [content]
      : [];

  return createElement(tag, props, ...childElements);
}
