"use client";

import type React from "react";
import type { WebElement, SharedComponents } from "@/features/preview/types";
import { createElement, type ReactElement, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/shared/session";
import { Camera } from "lucide-react";

interface JsonRendererProps {
  elements: WebElement[];
  sharedComponents?: SharedComponents;
  device?: "desktop" | "tablet" | "mobile"; // Prop from PreviewPanel
  onUpdateElement?: (id: number, updates: Partial<WebElement>) => void;
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

export function JsonRenderer({
  elements,
  sharedComponents,
  device = "desktop",
  onUpdateElement,
  onUpdateSharedElement,
}: JsonRendererProps) {
  const { user } = useSession();
  const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);
  const [activeImageId, setActiveImageId] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      style: cssStringToObject(attributes?.style),
      href: attributes?.href,
      src: attributes?.src,
    };

    
    
    
    
    
    // --- INLINE EDITING LOGIC ---
    const isTextElement = content && !children && tag !== "img";
    const isEditable =
      isTextElement && (onUpdateElement || onUpdateSharedElement);

    if (isEditable) {
      props.contentEditable = true;
      props.suppressContentEditableWarning = true;
      props.style = {
        ...(props.style || {}),
        cursor: "text",
        transition: "all 0.15s ease",
      };

      props.onFocus = (e) => {
        e.currentTarget.style.outline = "2px solid #facc15"; // yellow
        e.currentTarget.style.backgroundColor = "rgba(250, 204, 21, 0.15)";
      };

      props.onBlur = (e) => {
        e.currentTarget.style.outline = "none";
        e.currentTarget.style.backgroundColor = "transparent";
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

    // --- IMAGE LOGIC ---
    // Inside renderElement, replace the img logic:

    if (tag === "img") {
      const imageSrc = content?.startsWith("http") ? content : attributes?.src;
      const isLogo = element.attributes?.["data-role"] === "logo";
      const fixedStyle = cssStringToObject(attributes?.style);

      const isActive =
        device === "desktop" ? hoveredImageId === id : activeImageId === id;

      return (
        <div
          key={id}
          className="relative inline-flex"
          style={{
            zIndex: isActive ? 50 : "auto",
            height: isLogo ? "100%" : "auto",
            pointerEvents: "auto",
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
              maxWidth: "100%",
              maxHeight: "100%",
              width: isLogo ? "auto" : "100%",
              height: isLogo ? "100%" : "auto",
              objectFit: "contain",
              display: "block",
              pointerEvents: "auto",
            },
          })}

          {isActive && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                backgroundColor: "rgba(0,0,0,0.35)",
                zIndex: 9999,
              }}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-medium text-black shadow-lg"
                style={{
                  minWidth: isLogo ? 80 : 100,
                  minHeight: 40,
                  transform: isLogo ? "scale(0.85)" : "none",
                }}
              >
                Change
              </button>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => handleImageChange(e, id, componentKey)}
              />
            </div>
          )}
        </div>
      );
    }

    const childElements = children
      ? children.map((child) => renderElement(child, componentKey))
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
    </>
  );
}
