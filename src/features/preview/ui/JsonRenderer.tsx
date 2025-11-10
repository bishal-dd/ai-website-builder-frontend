"use client";

import type React from "react";

import type { WebElement } from "@/features/preview/types";
import {
  createElement,
  type ReactElement,
  useState,
  useRef,
  useEffect,
} from "react";
import { Button } from "@/components/ui/button";

interface JsonRendererProps {
  elements: WebElement[];
  onUpdateElement?: (id: number, updates: Partial<WebElement>) => void;
  onNavigate?: (path: string) => void;
}

export function JsonRenderer({
  elements,
  onUpdateElement,
  onNavigate,
}: JsonRendererProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<{
    [key: number]: boolean;
  }>({});
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const handleTextClick = (element: WebElement) => {
    if (element.content && !element.children) {
      setEditingId(element.id);
      setEditValue(element.content);
    }
  };

  const handleTextSave = (id: number) => {
    if (onUpdateElement && editValue !== "") {
      onUpdateElement(id, { content: editValue });
    }
    setEditingId(null);
    setEditValue("");
  };

  const handleTextKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTextSave(id);
    } else if (e.key === "Escape") {
      setEditingId(null);
      setEditValue("");
    }
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await fetch("/api/upload-presigned-url", {
        method: "POST",
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const { url, cloudfrontUrl } = await response.json();

      await fetch(url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      onUpdateElement?.(id, { content: cloudfrontUrl });
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      event.target.value = "";
    }
  };

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(href);
    }
  };

  const renderElement = (element: WebElement): ReactElement => {
    const {
      id,
      tag,
      class: className,
      content,
      type,
      children,
      attributes,
    } = element;

    const isEditing = editingId === id;
    const isTextElement = content && !children && tag !== "img";
    const isImageElement = tag === "img";
    const isLinkElement = tag === "a";
    const isHamburgerButton = tag === "button" && content === "☰";
    const isMobileMenu = className?.includes("md:hidden hidden flex-col");

    if (isEditing && isTextElement) {
      const isMultiline = content && content.length > 50;
      const InputComponent = isMultiline ? "textarea" : "input";

      return createElement(InputComponent, {
        key: id,
        ref: inputRef,
        value: editValue,
        onChange: (
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => setEditValue(e.target.value),
        onBlur: () => handleTextSave(id),
        onKeyDown: (e: React.KeyboardEvent) => handleTextKeyDown(e, id),
        className: `${className || ""} outline-2 outline-primary outline-dashed bg-primary/10`,
        ...(isMultiline && { rows: 3 }),
      });
    }

    const props: Record<string, unknown> = {
      key: id,
      className: className || undefined,
      ...(type && { type }),
      ...(attributes?.href && { href: attributes?.href }),
    };

    if (isHamburgerButton) {
      props.onClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setMobileMenuOpen((prev) => ({
          ...prev,
          [id]: !prev[id],
        }));
      };
    }

    if (isMobileMenu) {
      const isOpen = mobileMenuOpen[id - 1];
      props.className = isOpen
        ? className?.replace("hidden", "flex")
        : className;
    }

    if (isTextElement) {
      props.onClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        // If the element is a link, don't navigate while editing
        if (isLinkElement && onUpdateElement) {
          handleTextClick(element);
          return;
        }

        // Enter edit mode for any editable text
        if (onUpdateElement) {
          handleTextClick(element);
          return;
        }

        // Navigate only when not editing
        if (isLinkElement && onNavigate && !onUpdateElement) {
          handleLinkClick(e, attributes?.href ?? "#");
        }
      };

      props.className = `${className || ""} cursor-text hover:outline hover:outline-2 hover:outline-primary/50 transition-all`;
    }

    if (isImageElement && onUpdateElement) {
      return (
        <div
          key={id}
          className="relative inline-block group"
          onMouseEnter={() => setHoveredImageId(id)}
          onMouseLeave={() => setHoveredImageId(null)}
        >
          {createElement(tag, {
            ...props,
            src: attributes?.src,
            alt: attributes?.alt || "Image",
          })}
          {hoveredImageId === id && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity w-xl">
              <Button variant="secondary" size="sm" className="gap-2">
                Change Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, id)}
                />
              </Button>
            </div>
          )}
        </div>
      );
    }

    const childElements = children
      ? children.map((child) => renderElement(child))
      : content
        ? [content]
        : [];

    return createElement(tag, props, ...childElements);
  };

  return (
    <div className="w-full h-full">
      {elements.map((element) => renderElement(element))}
    </div>
  );
}
