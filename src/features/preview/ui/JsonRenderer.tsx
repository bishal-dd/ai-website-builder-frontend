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
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface JsonRendererProps {
  elements: WebElement[];
  sharedComponents?: SharedComponents;
  device?: DeviceType;
  onUpdateElement?: (id: number, updates: Partial<WebElement>) => void;
  contactPhone?: string;
  floatingWhatsappEnabled?: boolean;
  onReorderSections?: (reorderedSections: WebElement[]) => void;
  onUpdateSharedElement?: (
    componentKey: ComponentKey,
    elementId: number,
    updates: Partial<WebElement>,
  ) => void;
}

function SortablePreviewSection({
  element,
  children,
  toolbar,
}: {
  element: WebElement;
  device: DeviceType;
  children: React.ReactNode;
  toolbar: (dragHandleProps: {
    attributes: ReturnType<typeof useSortable>["attributes"];
    listeners: ReturnType<typeof useSortable>["listeners"];
    isDragging: boolean;
  }) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: element.id,
  });

  return (
    <div ref={setNodeRef} className="group relative">
      {toolbar({ attributes, listeners, isDragging })}
      {children}
    </div>
  );
}

export function JsonRenderer({
  elements,
  sharedComponents,
  device = "desktop",
  onUpdateElement,
  contactPhone,
  floatingWhatsappEnabled,
  onUpdateSharedElement,
  onReorderSections,
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

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= elements.length) return;

    const updatedSections = [...elements];

    [updatedSections[index], updatedSections[newIndex]] = [
      updatedSections[newIndex],
      updatedSections[index],
    ];

    onReorderSections?.(updatedSections);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = elements.findIndex((section) => section.id === active.id);
    const newIndex = elements.findIndex((section) => section.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedSections = arrayMove(elements, oldIndex, newIndex);

    onReorderSections?.(reorderedSections);
  };

  return (
    <>
      {sharedComponents?.navbar.map((element) =>
        renderElement(element, "navbar"),
      )}

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={elements.map((element) => element.id)}
          strategy={verticalListSortingStrategy}
        >
          <div>
            {elements.map((element, index) => (
              <SortablePreviewSection
                key={getElementKey(element, device)}
                element={element}
                device={device}
                toolbar={({ attributes, listeners, isDragging }) =>
                  onReorderSections && (
                    <div className="absolute right-4 top-16 z-50 hidden items-center gap-1 rounded-full border border-white/20 bg-black/60 px-2 py-1 shadow-lg backdrop-blur-md group-hover:flex">
                      <button
                        type="button"
                        {...attributes}
                        {...listeners}
                        className={`rounded-full p-1.5 transition ${
                          isDragging
                            ? "bg-white text-black"
                            : "text-white hover:bg-white/20"
                        }`}
                        title="Drag section"
                      >
                        <GripVertical className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveSection(index, "up")}
                        className="rounded-full p-1.5 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30"
                        title="Move section up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        disabled={index === elements.length - 1}
                        onClick={() => handleMoveSection(index, "down")}
                        className="rounded-full p-1.5 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30"
                        title="Move section down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </div>
                  )
                }
              >
                {renderElement(element)}
              </SortablePreviewSection>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {sharedComponents?.footer.map((element) =>
        renderElement(element, "footer"),
      )}

      {floatingWhatsappEnabled && (
        <FloatingWhatsApp phone={contactPhone ?? ""} />
      )}
    </>
  );
}
