import { normalizeAttributes } from "@/features/preview/utils/rendererAttributes";
import { cssStringToObject } from "@/features/preview/utils/rendererStyles";
import type { WebElement } from "@/features/preview/types";
import { DeviceType, RendererElementProps } from "./rendererTypes";

interface CreateElementPropsParams {
  element: WebElement;
  device: DeviceType;
}

export function createElementProps({
  element,
  device,
}: CreateElementPropsParams): RendererElementProps {
  return {
    key: `${element.id}-${device}`,
    className: element.class,
    ...normalizeAttributes(element.attributes),
    style: {
      ...cssStringToObject(element.attributes?.style),
    },
  };
}
