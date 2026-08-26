import { createElement } from "react";

import { useRendererStore } from "@/features/preview/stores/useRendererStore";
import { cssStringToObject } from "@/features/preview/utils/rendererStyles";
import type { WebElement } from "@/features/preview/types";
import { cn } from "@/lib/utils";

import type {
  ComponentKey,
  DeviceType,
  FileInputRefs,
  ImageChangeHandler,
  RendererElementProps,
} from "../shared/rendererTypes";
import { BackgroundImageRenderer } from "./BackgroundImageRenderer";
import {
  isAvatarImage,
  isBackgroundImageElement,
  resolveImageRole,
  resolveImageSrc,
} from "./imageUtils";

type ImageUploadStatus = "optimizing" | "uploading";

interface ImageElementRendererProps {
  element: WebElement;
  props: RendererElementProps;
  device: DeviceType;
  componentKey?: ComponentKey;
  fileInputRefs: FileInputRefs;
  uploadingImageId: number | null;
  uploadStatus: ImageUploadStatus | null;
  onImageChange: ImageChangeHandler;
}

export function ImageElementRenderer({
  element,
  props,
  device,
  componentKey,
  fileInputRefs,
  uploadingImageId,
  uploadStatus,
  onImageChange,
}: ImageElementRendererProps) {
  const { id, attributes } = element;

  const hoveredImageId = useRendererStore((state) => state.hoveredImageId);
  const activeImageId = useRendererStore((state) => state.activeImageId);
  const setHoveredImageId = useRendererStore(
    (state) => state.setHoveredImageId,
  );
  const setActiveImageId = useRendererStore((state) => state.setActiveImageId);

  const imageSrc = resolveImageSrc(element);
  const fixedStyle = cssStringToObject(attributes?.style);

  const role = resolveImageRole(element);
  const isLogo = role === "logo";
  const isIcon = role === "social-icon";
  const isAvatar = isAvatarImage(element);

  const isActive =
    device === "desktop" ? hoveredImageId === id : activeImageId === id;

  if (isBackgroundImageElement(element)) {
    return (
      <BackgroundImageRenderer
        id={id}
        imageSrc={imageSrc}
        device={device}
        componentKey={componentKey}
        fileInputRefs={fileInputRefs}
        uploadingImageId={uploadingImageId}
        onImageChange={onImageChange}
      />
    );
  }

  return (
    <div
      key={id}
      data-tour={isLogo ? "site-logo" : undefined}
      className={cn(
        "relative leading-none",
        isIcon ? "inline-block" : "block",
        isIcon || isAvatar ? null : "w-full",
        isLogo ? "h-full" : "h-auto",
      )}
      style={{
        zIndex: isActive ? 50 : undefined,
      }}
      onMouseEnter={() => device === "desktop" && setHoveredImageId(id)}
      onMouseLeave={() => device === "desktop" && setHoveredImageId(null)}
      onClick={() => device !== "desktop" && setActiveImageId(id)}
    >
      {createElement("img", {
        ...props,
        src: imageSrc,
        style: {
          ...fixedStyle,
          ...(isIcon
            ? {}
            : {
                ...fixedStyle,
                pointerEvents: "auto",
              }),
          display: "block",
        },
      })}

      {uploadingImageId === id && (
        <div className="absolute inset-0 z-100 flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-2 text-sm font-medium text-black">
            <span>Optimizing your image...</span>
            <span>Uploading your image...</span>
          </div>
        </div>
      )}

      {!isLogo && !isIcon && uploadingImageId !== id && (
        <button
          onClick={(event) => {
            event.stopPropagation();
            fileInputRefs.current[String(id)]?.click();
          }}
          className="absolute top-2 right-2 z-50 rounded-md bg-yellow-400 px-3 py-1.5 text-xs font-semibold text-black shadow-md"
        >
          Change
        </button>
      )}

      {(isLogo || isIcon) && isActive && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.35)",
            zIndex: 9999,
          }}
          onClick={(event) => {
            event.stopPropagation();

            if (!uploadingImageId) {
              fileInputRefs.current[String(id)]?.click();
            }
          }}
        >
          {uploadingImageId === id ? (
            <div className="flex flex-col items-center gap-2 text-white">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span className="text-sm">Uploading...</span>
            </div>
          ) : (
            <button className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-medium text-black shadow-lg">
              Change
            </button>
          )}
        </div>
      )}

      <input
        ref={(input) => {
          fileInputRefs.current[String(id)] = input;
        }}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={uploadingImageId === id}
        onChange={(event) => onImageChange(event, id, componentKey)}
      />
    </div>
  );
}
