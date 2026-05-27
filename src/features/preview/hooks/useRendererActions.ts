"use client";

import { useCallback } from "react";

import type { WebElement } from "@/features/preview/types";
import type { ComponentKey } from "@/features/preview/ui/renderer/shared/rendererTypes";

interface UseRendererActionsParams {
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
    handleImageChange,
  };
}
