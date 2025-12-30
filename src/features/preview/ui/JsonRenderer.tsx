"use client";

import type React from "react";
import type { WebElement, SharedComponents } from "@/features/preview/types";
import {
  createElement,
  type ReactElement,
  useState,
  useRef,
  useEffect,
} from "react";
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

export function JsonRenderer({
  elements,
  sharedComponents,
  device = "desktop",
  onUpdateElement,
  onUpdateSharedElement,
}: JsonRendererProps) {
  const { user } = useSession();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<{
    [key: number]: boolean;
  }>({});
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSimulatedMobile = device === "mobile" || device === "tablet";

  useEffect(() => {
    if (editingId !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const handleTextSave = (id: number, componentKey?: "navbar" | "footer") => {
    if (editValue === "") return;
    if (componentKey && onUpdateSharedElement) {
      onUpdateSharedElement(componentKey, id, { content: editValue });
    } else if (onUpdateElement) {
      onUpdateElement(id, { content: editValue });
    }
    setEditingId(null);
    setEditValue("");
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
      const presignUrlResponse = await fetch("http://localhost:4000/presign", {
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
      updater(
        `https://d28hne0rpm84ao.cloudfront.net/${user?.id}/previews/images/${fileKey}`,
      );
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

    const props: {
      key: React.Key;
      className?: string;
      style?: React.CSSProperties;
      href?: string;
      onClick?: React.MouseEventHandler<HTMLElement>;
    } = {
      key: id,
      className: className || undefined,
      style: cssStringToObject(attributes?.style),
      ...(attributes?.href && { href: attributes.href }),
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

    // --- EDITING LOGIC ---
    const isEditing = editingId === id;
    const isTextElement = content && !children && tag !== "img";
    const isEditable =
      isTextElement && (onUpdateElement || onUpdateSharedElement);

    if (isEditing && isTextElement) {
      return createElement("input", {
        key: id,
        ref: inputRef,
        value: editValue,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          setEditValue(e.target.value),
        onBlur: () => handleTextSave(id, componentKey),
        onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
          e.key === "Enter" && handleTextSave(id, componentKey),
        className: cn(className, "outline-dashed bg-primary/10"),
      });
    }

    if (isEditable) {
      props.onClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingId(id);
        setEditValue(content || "");
      };
      props.className = cn(
        props.className,
        "cursor-text hover:outline hover:outline-1 hover:outline-primary/30",
      );
    }

    // --- IMAGE LOGIC ---
    if (tag === "img") {
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
            src: content || attributes?.src,
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
