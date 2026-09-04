"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
import { ArrowDown, ArrowUp, GripVertical, Trash2 } from "lucide-react";
import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { findElementById } from "../utils/findElementById";
import { FloatingTextToolbar } from "./controls/FloatingTextToolbar";
import { FONT_SIZES } from "@/features/preview/types/fontSize";

interface JsonRendererProps {
  elements: WebElement[];
  sharedComponents?: SharedComponents;
  device?: DeviceType;
  onUpdateElement?: (id: number, updates: Partial<WebElement>) => void;
  contactPhone?: string;
  floatingWhatsappEnabled?: boolean;
  onReorderSections?: (reorderedSections: WebElement[]) => void;
  onDeleteSection?: (sectionId: number) => void;
  onUpdateSharedElement?: (
    componentKey: ComponentKey,
    elementId: number,
    updates: Partial<WebElement>,
  ) => void;
  onFontSizeChange?: (
    id: number,
    componentKey: ComponentKey | undefined,
    newFontSize: string,
    currentClassName?: string,
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
    transform: ReturnType<typeof useSortable>["transform"];
    transition: ReturnType<typeof useSortable>["transition"];
  }) => React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
    transform,
    transition,
  } = useSortable({
    id: element.id,
  });

  return (
    <div ref={setNodeRef} className="group relative">
      {toolbar({ attributes, listeners, isDragging, transform, transition })}
      <div>{children}</div>
    </div>
  );
}

function SelectedTextToolbar({
  element,
  fontSize,
  onIncrease,
  onDecrease,
  onMouseEnter,
  onMouseLeave,
}: {
  element: HTMLElement;
  fontSize: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      const rect = element.getBoundingClientRect();
      const win = element.ownerDocument.defaultView;

      if (!win) {
        return;
      }

      setPosition({
        top: rect.top + win.scrollY + rect.height / 2,
        left: rect.right + win.scrollX + 6,
      });
    };

    updatePosition();

    const win = element.ownerDocument.defaultView;

    win?.addEventListener("scroll", updatePosition);
    win?.addEventListener("resize", updatePosition);

    return () => {
      win?.removeEventListener("scroll", updatePosition);
      win?.removeEventListener("resize", updatePosition);
    };
  }, [element]);

  if (!position) {
    return null;
  }

  return createPortal(
    <FloatingTextToolbar
      position={position}
      fontSize={fontSize}
      onIncrease={onIncrease}
      onDecrease={onDecrease}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />,
    element.ownerDocument.body,
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
  onDeleteSection,
  onFontSizeChange,
}: JsonRendererProps) {
  const { user } = useSession();
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const isEditingText = useRendererStore((state) => state.isEditingText);

  const activeImageId = useRendererStore((state) => state.activeImageId);

  const selectedElementId = useRendererStore(
    (state) => state.selectedElementId,
  );

  const selectedComponentKey = useRendererStore(
    (state) => state.selectedComponentKey,
  );

  const setIsEditingText = useRendererStore((state) => state.setIsEditingText);

  const setSelectedElementId = useRendererStore(
    (state) => state.setSelectedElementId,
  );

  const setSelectedComponentKey = useRendererStore(
    (state) => state.setSelectedComponentKey,
  );

  interface HoveredText {
    element: HTMLElement;
    id: number;
    componentKey?: ComponentKey;
    className?: string;
  }

  const [hoveredText, setHoveredText] = useState<HoveredText | null>(null);

  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTextMouseEnter = useCallback(
    (
      element: HTMLElement,
      id: number,
      componentKey?: ComponentKey,
      className?: string,
    ) => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }

      setHoveredText({
        element,
        id,
        componentKey,
        className,
      });
    },
    [],
  );

  const handleTextMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredText(null);
      hoverTimeoutRef.current = null;
    }, 300);
  }, []);

  const selectedElement =
    selectedElementId === null
      ? null
      : selectedComponentKey === "navbar"
        ? findElementById(sharedComponents?.navbar ?? [], selectedElementId)
        : selectedComponentKey === "footer"
          ? findElementById(sharedComponents?.footer ?? [], selectedElementId)
          : findElementById(elements, selectedElementId);

  const getCurrentFontSize = useCallback(
    (className: string | undefined) => {
      const classes = (className ?? "").split(/\s+/);

      const prefix =
        device === "desktop" ? "lg:" : device === "tablet" ? "sm:" : "";

      const matchingClass = classes.find((className) => {
        if (prefix) {
          return (
            className.startsWith(prefix) &&
            FONT_SIZES.some(
              (size) => size.value === className.slice(prefix.length),
            )
          );
        }

        return FONT_SIZES.some((size) => size.value === className);
      });

      if (!matchingClass) {
        return "text-base";
      }

      return prefix ? matchingClass.slice(prefix.length) : matchingClass;
    },
    [device],
  );

  const handleFontSizeIncrease = useCallback(() => {
    if (!hoveredText) {
      return;
    }

    const currentFontSize = getCurrentFontSize(hoveredText.className);

    const currentIndex = FONT_SIZES.findIndex(
      (size) => size.value === currentFontSize,
    );

    if (currentIndex === -1 || currentIndex >= FONT_SIZES.length - 1) {
      return;
    }

    const newFontSize = FONT_SIZES[currentIndex + 1].value;

    onFontSizeChange?.(
      hoveredText.id,
      hoveredText.componentKey,
      newFontSize,
      hoveredText.className,
    );
  }, [hoveredText, getCurrentFontSize, onFontSizeChange]);

  const handleFontSizeDecrease = useCallback(() => {
    if (!hoveredText) {
      return;
    }

    const currentFontSize = getCurrentFontSize(hoveredText.className);

    const currentIndex = FONT_SIZES.findIndex(
      (size) => size.value === currentFontSize,
    );

    if (currentIndex <= 0) {
      return;
    }

    const newFontSize = FONT_SIZES[currentIndex - 1].value;

    onFontSizeChange?.(
      hoveredText.id,
      hoveredText.componentKey,
      newFontSize,
      hoveredText.className,
    );
  }, [hoveredText, getCurrentFontSize, onFontSizeChange]);

  const { uploadingImageId, uploadImage } = usePreviewImageUpload({
    userId: user?.id,
  });

  const { handleTextSave, handleImageChange } = useRendererActions({
    device,
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

      let props = createElementProps({ element, device });

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
        setSelectedElementId,
        setSelectedComponentKey,
        setHoveredTextElement: handleTextMouseEnter,
        onTextMouseLeave: handleTextMouseLeave,
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
      handleTextMouseEnter,
      handleTextMouseLeave,
      handleTextSave,
      isPaused,
      setIsEditingText,
      setSelectedElementId,
      setSelectedComponentKey,
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
    onReorderSections?.(arrayMove(elements, oldIndex, newIndex));
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
          <div className="space-y-2">
            {elements.map((element, index) => (
              <SortablePreviewSection
                key={getElementKey(element, device)}
                element={element}
                device={device}
                toolbar={({
                  attributes,
                  listeners,
                  isDragging,
                  transform,
                  transition,
                }) =>
                  onReorderSections && (
                    <div
                      style={{
                        transform: isDragging
                          ? CSS.Translate.toString(transform)
                          : undefined,
                        transition,
                      }}
                      className={`absolute right-4 top-16 z-50 w-max whitespace-nowrap items-center gap-1 rounded-full border px-2 py-1 shadow-xl backdrop-blur-md ${
                        isDragging
                          ? "flex border-blue-500 bg-black/90 ring-2 ring-blue-500/20"
                          : "hidden border-white/20 bg-black/60 group-hover:flex"
                      }`}
                    >
                      <button
                        type="button"
                        {...attributes}
                        {...listeners}
                        className={`cursor-grab rounded-full p-1.5 transition active:cursor-grabbing ${
                          isDragging
                            ? "bg-blue-600 text-white"
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

                      <button
                        type="button"
                        onClick={() => onDeleteSection?.(element.id)}
                        className="rounded-full p-1.5 text-red-400 transition hover:bg-red-500/20"
                        title="Delete section"
                      >
                        <Trash2 className="h-4 w-4" />
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
      {hoveredText && !isEditingText && (
        <SelectedTextToolbar
          element={hoveredText.element}
          fontSize={getCurrentFontSize(hoveredText.className)}
          onIncrease={handleFontSizeIncrease}
          onDecrease={handleFontSizeDecrease}
          onMouseEnter={() => {
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = null;
            }
          }}
          onMouseLeave={handleTextMouseLeave}
        />
      )}
    </>
  );
}
