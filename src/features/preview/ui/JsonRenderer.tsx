"use client";

import type React from "react";
import type { WebElement, SharedComponents } from "@/features/preview/types";
import { createElement, type ReactElement, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/shared/session";
import { cn } from "@/lib/utils";

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

const processClasses = (
  className: string | undefined,
  device: "desktop" | "tablet" | "mobile",
) => {
  if (!className) return "";

  const classes = className.split(" ");

  if (device === "desktop") {
    // 1. Find all classes that start with 'md:'
    // 2. Remove the 'md:' prefix
    // 3. Append them to the class list so they override mobile styles
    const desktopOverrides = classes
      .filter((c) => c.startsWith("md:"))
      .map((c) => c.replace("md:", ""));

    return cn(className, desktopOverrides);
  }

  return className;
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState<{
    [key: number]: boolean;
  }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSimulatedMobile = device === "mobile";

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

    const isHamburgerButton =
      tag === "button" &&
      (content === "☰" || attributes?.["aria-label"] === "Toggle navigation");
    const isMobileMenuContainer =
      attributes?.id === "nav-menu" || className?.includes("md:flex");

    const props: React.AllHTMLAttributes<HTMLElement> & { key: React.Key } = {
      key: id,
      className: processClasses(className, device),
      style: cssStringToObject(attributes?.style),
      href: attributes?.href,
      src: attributes?.src,
    };

    // --- OVERRIDE RESPONSIVENESS BASED ON TAB SELECTION ---
    if (isHamburgerButton) {
      props.className = cn(
        className?.replace("md:hidden", "").replace("hidden", ""),
        isSimulatedMobile ? "block" : "hidden",
      );
      props.onClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setMobileMenuOpen((prev) => ({ ...prev, [105]: !prev[105] })); // Toggle menu ID 105
      };
    }

    if (isMobileMenuContainer) {
      const isOpen = mobileMenuOpen[id];
      if (isSimulatedMobile) {
        props.className = isOpen
          ? "flex flex-col w-full absolute left-0 top-full bg-white border-b shadow-lg p-4 z-50"
          : "hidden";
      } else {
        props.className = "flex flex-row items-center gap-8 w-auto";
        if (props.style) {
          delete props.style.width;
          delete props.style.position;
        }
      }
    }

    // --- INLINE EDITING LOGIC ---
    const isTextElement = content && !children && tag !== "img";
    const isEditable =
      isTextElement && (onUpdateElement || onUpdateSharedElement);

    if (isEditable) {
      props.contentEditable = true;
      props.suppressContentEditableWarning = true;
      props.className = cn(
        props.className,
        "cursor-text hover:outline hover:outline-2 hover:outline-primary/50 focus:outline focus:outline-primary focus:bg-primary/5 outline-offset-2 transition-all",
      );
      props.onBlur = (e: React.FocusEvent<HTMLElement>) => {
        handleTextSave(id, componentKey, e.currentTarget.innerText);
      };
      props.onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          e.currentTarget.blur();
        }
      };
    }

    // --- IMAGE LOGIC ---
    if (tag === "img") {
      const imageSrc = content?.startsWith("http") ? content : attributes?.src;

      const fixedStyle = cssStringToObject(attributes?.style);
      return (
        <div
          key={id}
          className="relative group inline-block"
          onMouseEnter={() => setHoveredImageId(id)}
          onMouseLeave={() => setHoveredImageId(null)}
        >
          {createElement("img", {
            ...props,
            src: imageSrc,
            style: { ...fixedStyle, objectFit: "cover" },
          })}
          {hoveredImageId === id && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded">
              <Button size="sm" onClick={() => fileInputRef.current?.click()}>
                Change{" "}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, id, componentKey)}
                />
              </Button>
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
    <div className="w-full h-full flex flex-col relative bg-white">
      {sharedComponents?.navbar.map((el) => renderElement(el, "navbar"))}
      <div className="flex-1">{elements.map((el) => renderElement(el))}</div>
      {sharedComponents?.footer.map((el) => renderElement(el, "footer"))}
    </div>
  );
}
