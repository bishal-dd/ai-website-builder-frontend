import type React from "react";
import type { WebElement } from "@/features/preview/types";
import {
  ComponentKey,
  RendererElementProps,
  TextSaveHandler,
} from "./rendererTypes";

interface ApplyEditableTextPropsParams {
  props: RendererElementProps;
  element: WebElement;
  componentKey?: ComponentKey;
  canEdit: boolean;
  onTextSave: TextSaveHandler;
  setIsEditingText: (isEditing: boolean) => void;
  setSelectedElementId: (id: number | null) => void;
  setSelectedComponentKey: (componentKey: ComponentKey | null) => void;
  setHoveredTextElement: (element: HTMLElement) => void;
  onTextMouseLeave: () => void;
}

export function applyEditableTextProps({
  props,
  element,
  componentKey,
  canEdit,
  onTextSave,
  setIsEditingText,
  setSelectedElementId,
  setSelectedComponentKey,
  setHoveredTextElement,
  onTextMouseLeave,
}: ApplyEditableTextPropsParams): RendererElementProps {
  const { id, tag, content, children } = element;

  const hasNoChildren = !children || children.length === 0;

  const isTextElement =
    typeof content === "string" && hasNoChildren && tag !== "img";

  const isEditable = isTextElement && canEdit;

  if (!isEditable) {
    return props;
  }

  (
    props as unknown as React.HTMLAttributes<HTMLElement> &
      Record<string, unknown>
  )["data-editable-text-id"] = id;

  props.onClick = (event) => {
    event.stopPropagation();

    setSelectedElementId(id);
    setSelectedComponentKey(componentKey ?? null);
  };

  props.contentEditable = true;
  props.suppressContentEditableWarning = true;

  if (["h1", "h2", "p"].includes(tag)) {
    (
      props as unknown as React.HTMLAttributes<HTMLElement> &
        Record<string, unknown>
    )["data-tour"] = "editable-text";
  }

  props.style = {
    ...(props.style || {}),
    cursor: "text",
    transition: "all 0.15s ease",
  };

  props.onFocus = (event) => {
    setIsEditingText(true);
    event.currentTarget.style.outline = "2px solid #facc15";
  };

  props.onBlur = (event) => {
    setIsEditingText(false);
    event.currentTarget.style.outline = "none";

    onTextSave(id, componentKey, event.currentTarget.innerText);
  };

  props.onMouseEnter = (event) => {
    setHoveredTextElement(event.currentTarget);

    setSelectedElementId(id);
    setSelectedComponentKey(componentKey ?? null);

    if (document.activeElement !== event.currentTarget) {
      event.currentTarget.style.outline = "2px dashed rgba(250,204,21,0.7)";
    }
  };

  props.onMouseLeave = (event) => {
    if (document.activeElement !== event.currentTarget) {
      event.currentTarget.style.outline = "none";
    }

    onTextMouseLeave();
  };

  props.onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.blur();
    }
  };

  return props;
}
