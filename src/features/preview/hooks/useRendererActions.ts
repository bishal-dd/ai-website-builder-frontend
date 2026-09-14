"use client";

import { useCallback } from "react";

import type { WebElement } from "@/features/preview/types";
import type {
  ComponentKey,
  DeviceType,
} from "@/features/preview/ui/renderer/shared/rendererTypes";
import { updateFontSizeClass } from "../utils/updateFontSizeClass";

interface UseRendererActionsParams {
  device: DeviceType;

  onUpdateElement?: (id: number, updates: Partial<WebElement>) => void;
  onUpdateSharedElement?: (
    componentKey: ComponentKey,
    elementId: number,
    updates: Partial<WebElement>,
  ) => void;
  uploadImage: (params: {
    file: File;
    elementId: number;
    onUploaded: (content: string) => void;
  }) => Promise<void>;
}

export function useRendererActions({
  device,
  onUpdateElement,
  onUpdateSharedElement,
  uploadImage,
}: UseRendererActionsParams) {
  const handleTextSave = useCallback(
    (
      id: number,
      componentKey: ComponentKey | undefined,
      newContent: string,
    ) => {
      if (newContent.trim() === "") {
        return;
      }

      if (componentKey && onUpdateSharedElement) {
        onUpdateSharedElement(componentKey, id, {
          content: newContent,
        });
        return;
      }

      onUpdateElement?.(id, {
        content: newContent,
      });
    },
    [onUpdateElement, onUpdateSharedElement],
  );

  const handleFontSizeChange = useCallback(
    (
      id: number,
      componentKey: ComponentKey | undefined,
      newFontSize: string,
      currentClassName: string | undefined,
    ) => {
      const updatedClassName = updateFontSizeClass(
        currentClassName,
        newFontSize,
        device,
      );

      if (componentKey && onUpdateSharedElement) {
        onUpdateSharedElement(componentKey, id, {
          class: updatedClassName,
        });

        return;
      }

      onUpdateElement?.(id, {
        class: updatedClassName,
      });
    },
    [device, onUpdateElement, onUpdateSharedElement],
  );
  const updateImageContent = useCallback(
    (id: number, componentKey?: ComponentKey) => {
      return (content: string) => {
        if (componentKey) {
          onUpdateSharedElement?.(componentKey, id, {
            content,
          });
          return;
        }

        onUpdateElement?.(id, {
          content,
        });
      };
    },
    [onUpdateElement, onUpdateSharedElement],
  );

  const handleImageChange = useCallback(
    async (
      event: React.ChangeEvent<HTMLInputElement>,
      id: number,
      componentKey?: ComponentKey,
    ) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      await uploadImage({
        file,
        elementId: id,
        onUploaded: updateImageContent(id, componentKey),
      });

      event.target.value = "";
    },
    [uploadImage, updateImageContent],
  );

  return {
    handleTextSave,
    handleFontSizeChange,
    handleImageChange,
  };
}
