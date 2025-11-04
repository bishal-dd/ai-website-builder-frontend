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
import { ImageIcon } from "lucide-react";

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

  const handleImageChange = (id: number) => {
    const newImageUrl = prompt("Enter new image URL:");
    if (newImageUrl && onUpdateElement) {
      onUpdateElement(id, { content: newImageUrl });
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

    if (isLinkElement && onNavigate) {
      props.onClick = (e: React.MouseEvent) => {
        handleLinkClick(e, attributes?.href ?? "#");
      };
    }

    if (isTextElement && onUpdateElement) {
      props.onClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleTextClick(element);
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
            src: content,
            alt: content || "Image",
          })}
          {hoveredImageId === id && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageChange(id);
                }}
                variant="secondary"
                size="sm"
                className="gap-2"
              >
                <ImageIcon className="h-4 w-4" />
                Change Image
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
