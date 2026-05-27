"use client";

import { useCallback, useRef } from "react";

import type { SharedComponents, WebElement } from "@/features/preview/types";
import { usePreviewImageUpload } from "@/features/preview/hooks/usePreviewImageUpload";
import { useRendererActions } from "@/features/preview/hooks/useRendererActions";
import { useRendererStore } from "@/features/preview/stores/useRendererStore";
import { useSession } from "@/shared/session";

import { FloatingWhatsApp } from "@/features/preview/ui/interactiveComponents/FloatingWhatsApp";
import { CarouselElementRenderer } from "@/features/preview/ui/renderer/carousel/CarouselElementRenderer";
import { CarouselSlideRenderer } from "@/features/preview/ui/renderer/carousel/CarouselSlideRenderer";
import { DefaultElementRenderer } from "@/features/preview/ui/renderer/DefaultElementRenderer";
import { applyEditableTextProps } from "@/features/preview/ui/renderer/shared/editableTextProps";
import { createElementProps } from "@/features/preview/ui/renderer/shared/createElementProps";
import {
  getElementKey,
  getElementKind,
} from "@/features/preview/ui/renderer/shared/rendererElementUtils";
import type {
  ComponentKey,
  DeviceType,
} from "@/features/preview/ui/renderer/shared/rendererTypes";
import { ImageElementRenderer } from "@/features/preview/ui/renderer/image/ImageElementRenderer";
import { HeroSectionRenderer } from "@/features/preview/ui/renderer/sections/HeroSectionRenderer";
import { OverlaySectionRenderer } from "@/features/preview/ui/renderer/sections/OverlaySectionRenderer";

interface JsonRendererProps {
  elements: WebElement[];
  sharedComponents?: SharedComponents;
  device?: DeviceType;
  onUpdateElement?: (id: number, updates: Partial<WebElement>) => void;
  contactPhone?: string;
  floatingWhatsappEnabled?: boolean;
  onUpdateSharedElement?: (
    componentKey: ComponentKey,
    elementId: number,
    updates: Partial<WebElement>,
  ) => void;
}

export function JsonRenderer({
  elements,
  sharedComponents,
  device = "desktop",
  onUpdateElement,
  contactPhone,
  floatingWhatsappEnabled,
  onUpdateSharedElement,
}: JsonRendererProps) {
  const { user } = useSession();

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const isEditingText = useRendererStore((state) => state.isEditingText);
  const activeImageId = useRendererStore((state) => state.activeImageId);
  const setIsEditingText = useRendererStore((state) => state.setIsEditingText);

  const { uploadingImageId, uploadImage } = usePreviewImageUpload({
    userId: user?.id,
  });

  const { handleTextSave, handleImageChange } = useRendererActions({
    onUpdateElement,
    onUpdateSharedElement,
    uploadImage,
  });

  const isPaused =
    isEditingText || uploadingImageId !== null || activeImageId !== null;

  const canEdit = Boolean(onUpdateElement || onUpdateSharedElement);

  const renderElement = useCallback(
    (element: WebElement, componentKey?: ComponentKey): React.ReactElement => {
      const elementKey = getElementKey(element, device);
      const elementKind = getElementKind(element);

      let props = createElementProps({
        element,
        device,
      });

      if (element.tag === "a") {
        props.href = undefined;
        props.onClick = undefined;
      }

      props = applyEditableTextProps({
        props,
        element,
        componentKey,
        canEdit,
        onTextSave: handleTextSave,
        setIsEditingText,
      });

      switch (elementKind) {
        case "carousel":
          return (
            <CarouselElementRenderer
              key={elementKey}
              element={element}
              componentKey={componentKey}
              isPaused={isPaused}
              renderElement={renderElement}
            />
          );

        case "carousel-slide":
          return (
            <CarouselSlideRenderer
              key={elementKey}
              element={element}
              componentKey={componentKey}
              renderElement={renderElement}
              fileInputRefs={fileInputRefs}
              uploadingImageId={uploadingImageId}
              onImageChange={handleImageChange}
            />
          );

        case "overlay-section":
          return (
            <OverlaySectionRenderer
              key={elementKey}
              element={element}
              componentKey={componentKey}
              renderElement={renderElement}
              fileInputRefs={fileInputRefs}
              uploadingImageId={uploadingImageId}
              onImageChange={handleImageChange}
            />
          );

        case "hero-section":
          return (
            <HeroSectionRenderer
              key={elementKey}
              element={element}
              componentKey={componentKey}
              renderElement={renderElement}
              fileInputRefs={fileInputRefs}
              uploadingImageId={uploadingImageId}
              onImageChange={handleImageChange}
            />
          );

        case "image":
          return (
            <ImageElementRenderer
              key={elementKey}
              element={element}
              props={props}
              device={device}
              componentKey={componentKey}
              fileInputRefs={fileInputRefs}
              uploadingImageId={uploadingImageId}
              onImageChange={handleImageChange}
            />
          );

        default:
          return (
            <DefaultElementRenderer
              key={elementKey}
              element={element}
              props={props}
              componentKey={componentKey}
              renderElement={renderElement}
            />
          );
      }
    },
    [
      canEdit,
      device,
      handleImageChange,
      handleTextSave,
      isPaused,
      setIsEditingText,
      uploadingImageId,
    ],
  );

  return (
    <>
      {sharedComponents?.navbar.map((element) =>
        renderElement(element, "navbar"),
      )}

      <div>{elements.map((element) => renderElement(element))}</div>

      {sharedComponents?.footer.map((element) =>
        renderElement(element, "footer"),
      )}

      {floatingWhatsappEnabled && (
        <FloatingWhatsApp phone={contactPhone ?? ""} />
      )}
    </>
  );
}
