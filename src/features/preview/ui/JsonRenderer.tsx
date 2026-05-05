"use client";

import type React from "react";
import type { WebElement, SharedComponents } from "@/features/preview/types";
import { createElement, type ReactElement, useState, useRef } from "react";
import { useSession } from "@/shared/session";
import { CarouselRenderer } from "./interactiveComponents/CarouselRenderer";
import { cn } from "@/lib/utils";
import { FloatingWhatsApp } from "./interactiveComponents/FloatingWhatsApp";

interface JsonRendererProps {
  elements: WebElement[];
  sharedComponents?: SharedComponents;
  device?: "desktop" | "tablet" | "mobile"; // Prop from PreviewPanel
  onUpdateElement?: (id: number, updates: Partial<WebElement>) => void;
  contactPhone?: string;
  floatingWhatsappEnabled?: boolean;
  onUpdateSharedElement?: (
    componentKey: "navbar" | "footer",
    elementId: number,
    updates: Partial<WebElement>,
  ) => void;
}

const cssStringToObject = (
  cssString: string | undefined,
): React.CSSProperties => {
  if (!cssString) return {};
  const style: Record<string, string | number> = {};
  cssString.split(";").forEach((rule) => {
    const trimmed = rule.trim();
    if (!trimmed) return;
    const colonIndex = trimmed.indexOf(":");
    if (colonIndex === -1) return;
    const keyRaw = trimmed.slice(0, colonIndex).trim();
    const value = trimmed.slice(colonIndex + 1).trim();
    if (!keyRaw || !value) return;
    const key = keyRaw.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
    style[key] = value;
  });
  return style as React.CSSProperties;
};

const hasExplicitSize = (className?: string) =>
  !!className?.match(/\b(w|h)-(\d+|\[.+?\])\b/);

const normalizeAttributes = (
  attrs?: Record<string, unknown>,
): Record<string, unknown> => {
  if (!attrs) return {};

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(attrs)) {
    if (key === "style") continue;

    // 1️⃣ Preserve data-* EXACTLY
    if (key.startsWith("data-")) {
      result[key] = value;
      continue;
    }

    // 2️⃣ Preserve aria-* EXACTLY
    if (key.startsWith("aria-")) {
      result[key] = value;
      continue;
    }

    // 3️⃣ Event handlers must be FUNCTIONS
    if (key.toLowerCase().startsWith("on")) {
      // Ignore string-based handlers (HTML-style)
      if (typeof value === "function") {
        const reactEvent = "on" + key.slice(2, 3).toUpperCase() + key.slice(3);
        result[reactEvent] = value;
      }
      continue;
    }

    // 4️⃣ Convert kebab-case → camelCase (SVG & HTML attrs)
    const camelKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

    const allowedAttributes = new Set([
      "src",
      "alt",
      "href",
      "target",
      "rel",
      "className",
      "id",
      "title",
      "width",
      "height",
      "viewBox",
      "fill",
      "stroke",
      "xmlns",
      "strokeWidth",
      "strokeLinecap",
      "strokeLinejoin",
      "d",
      "r",
      "cx",
      "cy",
    ]);

    if (
      camelKey.startsWith("data-") ||
      camelKey.startsWith("aria-") ||
      allowedAttributes.has(camelKey)
    ) {
      result[camelKey] = value;
    }
  }

  return result;
};

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
  const [uploadingImageId, setUploadingImageId] = useState<number | null>(null);
  const [isEditingText, setIsEditingText] = useState(false); // New State

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const isPaused =
    isEditingText || uploadingImageId !== null || activeImageId !== null;
  const handleTextSave = (
    id: number,
    componentKey: "navbar" | "footer" | undefined,
    newContent: string,
  ) => {
    if (newContent.trim() === "") return;

    if (componentKey && onUpdateSharedElement) {
      onUpdateSharedElement(componentKey, id, { content: newContent });
    } else if (onUpdateElement) {
      onUpdateElement(id, { content: newContent });
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
    try {
      setUploadingImageId(id); // 👈 start loader
      const fileKey = `${crypto.randomUUID()}.${file.name.split(".").pop() || "png"}`;
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      if (!backendUrl) {
        throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
      }

      const presignUrlResponse = await fetch(`${backendUrl}/presign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          fileName: fileKey,
          fileType: file.type,
        }),
      });
      const { url: presignedUrl } = await presignUrlResponse.json();
      await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const cloudfront = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;

      if (!cloudfront) {
        throw new Error("NEXT_PUBLIC_CLOUDFRONT_URL is not defined");
      }

      updater(`${cloudfront}/${user?.id}/previews/images/${fileKey}`);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploadingImageId(null); // 👈 stop loader
    }
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
      className: className,
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

      // 1️⃣ Find the wrapper (relative h-[80vh])
      const wrapper = children?.find((child) => child.tag === "div");

      // 2️⃣ Extract ONLY slide nodes
      const slides =
        wrapper?.children?.filter(
          (child) => child.attributes?.["data-role"] === "carousel-slide",
        ) ?? [];

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

    // --- INLINE EDITING LOGIC ---
    const isLink = tag === "a";
    if (isLink) {
      props.href = undefined;
      props.onClick = undefined;
    }

    // A text element is either a tag with direct content OR a span/p/label etc.
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

      props.onFocus = (e) => {
        setIsEditingText(true);
        e.currentTarget.style.outline = "2px solid #facc15"; // yellow
      };

      props.onBlur = (e) => {
        setIsEditingText(false);
        e.currentTarget.style.outline = "none";
        handleTextSave(id, componentKey, e.currentTarget.innerText);
      };

      props.onMouseEnter = (e) => {
        e.currentTarget.style.outline = "2px dashed rgba(250,204,21,0.7)";
      };

      props.onMouseLeave = (e) => {
        if (document.activeElement !== e.currentTarget) {
          e.currentTarget.style.outline = "none";
        }
      };
      props.onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          e.currentTarget.blur();
        }
      };
    }

    const isCarouselSlide =
      element.attributes?.["data-role"] === "carousel-slide";

    if (isCarouselSlide) {
      return (
        <div key={id} className={cn("w-full h-full", className)}>
          {/* Slide Content */}
          {children?.map((child) => renderElement(child, componentKey))}

          {/* Small Edit Button - Always Visible */}
          <button
            onClick={(e) => {
              e.stopPropagation();

              const bgImage = children?.find(
                (c) =>
                  c.tag === "img" &&
                  c.attributes?.["data-role"] === "carousel-bg",
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
            ref={(el) => {
              fileInputRefs.current[String(id)] = el;
            }}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const bgImage = children?.find(
                (c) =>
                  c.tag === "img" &&
                  c.attributes?.["data-role"] === "carousel-bg",
              );

              if (bgImage) {
                handleImageChange(e, bgImage.id, componentKey);
                setActiveImageId(null);
              }
            }}
          />
        </div>
      );
    }

    const isHeroSection =
      element.attributes?.["data-component"] === "hero-section";

    if (isHeroSection) {
      const bgImage = children?.find(
        (c) => c.tag === "img" && c.attributes?.["data-role"] === "carousel-bg",
      );

      const isUploading = bgImage && uploadingImageId === bgImage.id;

      return (
        <section key={id} className={cn("relative", className)}>
          {" "}
          {/* Background */}
          {bgImage && renderElement(bgImage, componentKey)}
          {/* Upload overlay (ONLY when uploading) */}
          {isUploading && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 text-white">
              <div className="flex flex-col items-center gap-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="text-sm">Uploading...</span>
              </div>
            </div>
          )}
          {/* Overlay content */}
          <div className="relative z-10 h-full flex items-center justify-center text-center">
            {children
              ?.filter((c) => c !== bgImage)
              .map((child) => renderElement(child, componentKey))}
          </div>
          {/* Edit button */}
          <button
            data-tour="hero-background"
            onClick={(e) => {
              e.stopPropagation();
              if (!isUploading) {
                fileInputRefs.current[`hero-${id}`]?.click();
              }
            }}
            className="absolute top-2 right-2 z-50 bg-yellow-400 text-black px-3 py-1.5 rounded-md shadow-md text-xs font-semibold"
          >
            {isUploading ? "Uploading..." : "Change Background"}
          </button>
          {/* Hidden input */}
          <input
            ref={(el) => {
              fileInputRefs.current[`hero-${id}`] = el;
            }}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={isUploading}
            onChange={(e) => {
              if (bgImage) {
                handleImageChange(e, bgImage.id, componentKey);
              }
            }}
          />
        </section>
      );
    }

    // --- IMAGE LOGIC ---
    // Inside renderElement, replace the img logic:
    const hasSize = hasExplicitSize(className);

    if (tag === "img") {
      const imageSrc = content?.startsWith("http") ? content : attributes?.src;
      const fixedStyle = cssStringToObject(attributes?.style);
      const isCarouselBg = element.attributes?.["data-role"] === "carousel-bg";
      // ✅ STEP 1: Resolve role (explicit OR fallback)
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

      // ✅ STEP 2: Derive flags from role
      const isLogo = role === "logo";
      const isIcon = role === "social-icon";
      const isCover = role === "cover";
      const isContain = role === "contain";

      const isActive =
        device === "desktop" ? hoveredImageId === id : activeImageId === id;

      if (isCarouselBg) {
        return (
          <img
            key={id}
            src={imageSrc}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 0 }}
          />
        );
      }

      return (
        <div
          key={id}
          data-tour={isLogo ? "site-logo" : undefined}
          className={cn(
            "relative  leading-none",
            isIcon ? "inline-block" : "block",
            isIcon ? null : "w-full",
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
          {/* ✅ Normal images → always visible */}
          {!isLogo && !isIcon && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!uploadingImageId) {
                  fileInputRefs.current[String(id)]?.click();
                }
              }}
              className="absolute top-2 right-2 z-50 bg-yellow-400 text-black px-3 py-1.5 rounded-md shadow-md text-xs font-semibold"
            >
              {uploadingImageId === id ? "Uploading..." : "Change"}
            </button>
          )}

          {/* ✅ Logo & Icons → hover behavior */}
          {(isLogo || isIcon) && isActive && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                backgroundColor: "rgba(0,0,0,0.35)",
                zIndex: 9999,
              }}
              onClick={(e) => {
                e.stopPropagation();
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
            ref={(el) => {
              fileInputRefs.current[String(id)] = el;
            }}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploadingImageId === id}
            onChange={(e) => handleImageChange(e, id, componentKey)}
          />
        </div>
      );
    }

    if (tag === "svg") {
      props.style = {
        ...props.style,
        flexShrink: 0, // Prevent icons from squishing in flex containers
        display: "block",
      };
    }

    const childElements = children
      ? children.flatMap((child, index) => {
          const el = renderElement(child, componentKey);

          // add space between inline text/span siblings
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
      {sharedComponents?.navbar.map((el) => renderElement(el, "navbar"))}
      <div>{elements.map((el) => renderElement(el))}</div>
      {sharedComponents?.footer.map((el) => renderElement(el, "footer"))}
      {floatingWhatsappEnabled && (
        <FloatingWhatsApp phone={contactPhone ?? ""} />
      )}
    </>
  );
}
