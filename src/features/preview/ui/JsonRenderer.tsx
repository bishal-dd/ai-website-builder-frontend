"use client";

import type React from "react";
import { createElement, type ReactElement, useRef, useState } from "react";

import type { SharedComponents, WebElement } from "@/features/preview/types";
import { usePreviewImageUpload } from "@/features/preview/hooks/usePreviewImageUpload";
import { normalizeAttributes } from "@/features/preview/utils/rendererAttributes";
import { findCarouselSlides } from "@/features/preview/utils/rendererElements";
import {
  cssStringToObject,
  hasExplicitSize,
} from "@/features/preview/utils/rendererStyles";
import { useSession } from "@/shared/session";
import { cn } from "@/lib/utils";

import { CarouselRenderer } from "./interactiveComponents/CarouselRenderer";
import { FloatingWhatsApp } from "./interactiveComponents/FloatingWhatsApp";

interface JsonRendererProps {
  elements: WebElement[];
  sharedComponents?: SharedComponents;
  device?: "desktop" | "tablet" | "mobile";
  onUpdateElement?: (id: number, updates: Partial<WebElement>) => void;
  contactPhone?: string;
  floatingWhatsappEnabled?: boolean;
  onUpdateSharedElement?: (
    componentKey: "navbar" | "footer",
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

  const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);
  const [activeImageId, setActiveImageId] = useState<number | null>(null);
  const [isEditingText, setIsEditingText] = useState(false);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const { uploadingImageId, uploadImage } = usePreviewImageUpload({
    userId: user?.id,
  });

  const isPaused =
    isEditingText || uploadingImageId !== null || activeImageId !== null;

  const handleTextSave = (
    id: number,
    componentKey: "navbar" | "footer" | undefined,
    newContent: string,
  ) => {
    if (newContent.trim() === "") return;

    if (componentKey && onUpdateSharedElement) {
      onUpdateSharedElement(componentKey, id, {
        content: newContent,
      });
      return;
    }

    if (onUpdateElement) {
      onUpdateElement(id, {
        content: newContent,
      });
    }
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number,
    componentKey?: "navbar" | "footer",
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const updater = componentKey
      ? (content: string) =>
          onUpdateSharedElement?.(componentKey, id, { content })
      : (content: string) => onUpdateElement?.(id, { content });

    await uploadImage({
      file,
      elementId: id,
      onUploaded: updater,
    });

    event.target.value = "";
  };

  const renderElement = (
    element: WebElement,
    componentKey?: "navbar" | "footer",
  ): ReactElement => {
    const {
      id,
      tag,
      class: className,
      content,
      children,
      attributes,
    } = element;

    const props: React.AllHTMLAttributes<HTMLElement> & { key: React.Key } = {
      key: `${id}-${device}`,
      className,
      ...normalizeAttributes(attributes),
      style: {
        ...cssStringToObject(attributes?.style),
      },
    };

    const componentType = element.attributes?.["data-component"];

    if (componentType === "carousel") {
      const autoplay = String(element.attributes?.["data-autoplay"]) === "true";
      const intervalAttr = element.attributes?.["data-interval"];
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
          renderElement={(el) => renderElement(el, componentKey)}
        />
      );
    }

    const isLink = tag === "a";

    if (isLink) {
      props.href = undefined;
      props.onClick = undefined;
    }

    const hasNoChildren = !children || children.length === 0;

    const isTextElement =
      typeof content === "string" && hasNoChildren && tag !== "img";

    const isEditable =
      isTextElement && (!!onUpdateElement || !!onUpdateSharedElement);

    if (isEditable) {
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
        handleTextSave(id, componentKey, event.currentTarget.innerText);
      };

      props.onMouseEnter = (event) => {
        event.currentTarget.style.outline = "2px dashed rgba(250,204,21,0.7)";
      };

      props.onMouseLeave = (event) => {
        if (document.activeElement !== event.currentTarget) {
          event.currentTarget.style.outline = "none";
        }
      };

      props.onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          event.currentTarget.blur();
        }
      };
    }

    const isCarouselSlide =
      element.attributes?.["data-role"] === "carousel-slide";

    if (isCarouselSlide) {
      return (
        <div key={id} className={cn("w-full h-full", className)}>
          {children?.map((child) => renderElement(child, componentKey))}

          <button
            onClick={(event) => {
              event.stopPropagation();

              const bgImage = children?.find(
                (child) =>
                  child.tag === "img" &&
                  child.attributes?.["data-role"] === "carousel-bg",
              );

              if (bgImage) {
                if (activeImageId !== bgImage.id) {
                  setActiveImageId(bgImage.id);
                }

                fileInputRefs.current[String(id)]?.click();
              }
            }}
            className="absolute top-4 right-4 z-50 bg-yellow-400 text-black px-4 py-2 rounded-md shadow-lg text-sm font-semibold"
          >
            Change
          </button>

          <input
            ref={(element) => {
              fileInputRefs.current[String(id)] = element;
            }}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const bgImage = children?.find(
                (child) =>
                  child.tag === "img" &&
                  child.attributes?.["data-role"] === "carousel-bg",
              );

              if (bgImage) {
                handleImageChange(event, bgImage.id, componentKey);
                setActiveImageId(null);
              }
            }}
          />
        </div>
      );
    }

    const isOverLaySection =
      element.attributes?.["data-component"] === "overlay-section";

    if (isOverLaySection) {
      const bgImage = children?.find(
        (child) =>
          child.tag === "img" &&
          child.attributes?.["data-role"] === "overlay-bg",
      );

      const isUploading = bgImage && uploadingImageId === bgImage.id;

      return (
        <section key={id} className={cn("relative", className)}>
          {bgImage && renderElement(bgImage, componentKey)}

          {isUploading && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 text-white">
              <div className="flex flex-col items-center gap-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="text-sm">Uploading...</span>
              </div>
            </div>
          )}

          <>
            {children
              ?.filter((child) => child !== bgImage)
              .map((child) => renderElement(child, componentKey))}
          </>

          {bgImage && (
            <>
              <button
                onClick={(event) => {
                  event.stopPropagation();

                  if (!isUploading) {
                    fileInputRefs.current[`overlay-${id}`]?.click();
                  }
                }}
                className="absolute top-2 right-2 z-50 bg-yellow-400 text-black px-3 py-1.5 rounded-md shadow-md text-xs font-semibold"
              >
                {isUploading ? "Uploading..." : "Change Background"}
              </button>

              <input
                ref={(element) => {
                  fileInputRefs.current[`overlay-${id}`] = element;
                }}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={Boolean(isUploading)}
                onChange={(event) => {
                  handleImageChange(event, bgImage.id, componentKey);
                }}
              />
            </>
          )}
        </section>
      );
    }

    const isHeroSection =
      element.attributes?.["data-component"] === "hero-section";

    if (isHeroSection) {
      const bgImage = children?.find(
        (child) =>
          child.tag === "img" &&
          child.attributes?.["data-role"] === "carousel-bg",
      );

      const isUploading = bgImage && uploadingImageId === bgImage.id;

      return (
        <section key={id} className={cn("relative", className)}>
          {bgImage && renderElement(bgImage, componentKey)}

          {isUploading && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 text-white">
              <div className="flex flex-col items-center gap-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="text-sm">Uploading...</span>
              </div>
            </div>
          )}

          <>
            {children
              ?.filter((child) => child !== bgImage)
              .map((child) => renderElement(child, componentKey))}
          </>

          <button
            data-tour="hero-background"
            onClick={(event) => {
              event.stopPropagation();

              if (!isUploading) {
                fileInputRefs.current[`hero-${id}`]?.click();
              }
            }}
            className="absolute top-2 right-2 z-50 bg-yellow-400 text-black px-3 py-1.5 rounded-md shadow-md text-xs font-semibold"
          >
            {isUploading ? "Uploading..." : "Change Background"}
          </button>

          <input
            ref={(element) => {
              fileInputRefs.current[`hero-${id}`] = element;
            }}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={Boolean(isUploading)}
            onChange={(event) => {
              if (bgImage) {
                handleImageChange(event, bgImage.id, componentKey);
              }
            }}
          />
        </section>
      );
    }

    if (tag === "img") {
      const imageSrc = content?.startsWith("http") ? content : attributes?.src;
      const fixedStyle = cssStringToObject(attributes?.style);

      const isBackgroundImage =
        element.attributes?.["data-role"] === "carousel-bg" ||
        element.attributes?.["data-role"] === "overlay-bg";

      let role = element.attributes?.["data-role"];

      if (!role) {
        if (
          className?.includes("h-[") ||
          className?.includes("h-full") ||
          className?.includes("object-cover") ||
          className?.includes("absolute")
        ) {
          role = "cover";
        } else {
          role = "contain";
        }
      }

      const isLogo = role === "logo";
      const isIcon = role === "social-icon";
      const isAvatar =
        className?.includes("rounded-full") && className?.match(/\bw-\d+/);

      hasExplicitSize(className);

      const isActive =
        device === "desktop" ? hoveredImageId === id : activeImageId === id;

      if (isBackgroundImage) {
        return (
          <div
            key={id}
            className="absolute inset-0"
            onMouseEnter={() => device === "desktop" && setHoveredImageId(id)}
            onMouseLeave={() => device === "desktop" && setHoveredImageId(null)}
          >
            <img
              src={imageSrc}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ zIndex: 0 }}
              alt=""
            />

            <button
              onClick={(event) => {
                event.stopPropagation();

                if (!uploadingImageId) {
                  fileInputRefs.current[String(id)]?.click();
                }
              }}
              className="absolute top-2 right-2 z-50 bg-yellow-400 text-black px-3 py-1.5 rounded-md shadow-md text-xs font-semibold"
            >
              {uploadingImageId === id ? "Uploading..." : "Change"}
            </button>

            <input
              ref={(element) => {
                fileInputRefs.current[String(id)] = element;
              }}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingImageId === id}
              onChange={(event) => handleImageChange(event, id, componentKey)}
            />
          </div>
        );
      }

      return (
        <div
          key={id}
          data-tour={isLogo ? "site-logo" : undefined}
          className={cn(
            "relative  leading-none",
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

          {!isLogo && !isIcon && (
            <button
              onClick={(event) => {
                event.stopPropagation();

                if (!uploadingImageId) {
                  fileInputRefs.current[String(id)]?.click();
                }
              }}
              className="absolute top-2 right-2 z-50 bg-yellow-400 text-black px-3 py-1.5 rounded-md shadow-md text-xs font-semibold"
            >
              {uploadingImageId === id ? "Uploading..." : "Change"}
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
            ref={(element) => {
              fileInputRefs.current[String(id)] = element;
            }}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploadingImageId === id}
            onChange={(event) => handleImageChange(event, id, componentKey)}
          />
        </div>
      );
    }

    if (tag === "svg") {
      props.style = {
        ...props.style,
        flexShrink: 0,
        display: "block",
      };
    }

    const childElements = children
      ? children.flatMap((child, index) => {
          const el = renderElement(child, componentKey);

          if (index < children.length - 1) {
            return [el, " "];
          }

          return [el];
        })
      : content
        ? [content]
        : [];

    return createElement(tag, props, ...childElements);
  };

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
