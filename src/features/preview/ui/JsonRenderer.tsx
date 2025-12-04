// src/features/preview/ui/JsonRenderer.tsx

"use client";

import type React from "react";

import type { WebElement, SharedComponents } from "@/features/preview/types"; // <-- Import SharedComponents
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
  sharedComponents?: SharedComponents; // <-- New Prop
  onUpdateElement?: (id: number, updates: Partial<WebElement>) => void;
  // ** NEW PROP **
  onUpdateSharedElement?: (
    componentKey: "navbar" | "footer",
    elementId: number,
    updates: Partial<WebElement>,
  ) => void;
  onNavigate?: (path: string) => void;
}

export function JsonRenderer({
  elements,
  sharedComponents, // <-- Destructure new prop
  onUpdateElement,
  onUpdateSharedElement, // <-- Destructure new prop
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

  // ** MODIFIED FUNCTION: Accepts an optional componentKey **
  const handleTextSave = (id: number, componentKey?: "navbar" | "footer") => {
    if (editValue === "") return;

    // Determine which handler to use
    if (componentKey && onUpdateSharedElement) {
      onUpdateSharedElement(componentKey, id, { content: editValue });
    } else if (onUpdateElement) {
      onUpdateElement(id, { content: editValue });
    }

    setEditingId(null);
    setEditValue("");
  };

  // ** MODIFIED FUNCTION: Calls handleTextSave with componentKey **
  const handleTextKeyDown = (
    e: React.KeyboardEvent,
    id: number,
    componentKey?: "navbar" | "footer",
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTextSave(id, componentKey);
    } else if (e.key === "Escape") {
      setEditingId(null);
      setEditValue("");
    }
  };

  // NOTE: Image change logic remains the same, but should be adapted
  // to also accept a componentKey if you want to edit shared component images.
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // ... (Image upload API logic)

      onUpdateElement?.(id, { content: "" });
      // TODO: You would need to check componentKey here and call onUpdateSharedElement
      // if it was a shared component image. For now, it only updates page elements.
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

  // ** MODIFIED FUNCTION: Accepts optional componentKey **
  const renderElement = (
    element: WebElement,
    componentKey?: "navbar" | "footer",
  ): ReactElement => {
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
        onBlur: () => handleTextSave(id, componentKey), // <-- Pass componentKey
        onKeyDown: (e: React.KeyboardEvent) =>
          handleTextKeyDown(e, id, componentKey), // <-- Pass componentKey
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

    // Check if the element is editable (i.e., a text element and we have an update handler)
    const isEditable =
      isTextElement && (onUpdateElement || onUpdateSharedElement);

    if (isEditable) {
      props.onClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        // Enter edit mode for any editable text
        handleTextClick(element);

        // If it's a link in a non-editing context, navigate.
        if (isLinkElement && !isEditing && onNavigate) {
          handleLinkClick(e, attributes?.href ?? "#");
        }
      };

      props.className = `${className || ""} cursor-text hover:outline hover:outline-2 hover:outline-primary/50 transition-all`;
    }

    // Image rendering logic (for editing image attributes)
    if (isImageElement && (onUpdateElement || onUpdateSharedElement)) {
      return (
        <div
          key={id}
          className="relative inline-block group"
          onMouseEnter={() => setHoveredImageId(id)}
          onMouseLeave={() => setHoveredImageId(null)}
        >
          {createElement(tag, {
            ...props,
            src: content || attributes?.src, // Using content/src for image source
            alt: attributes?.alt || "Image",
          })}
          {hoveredImageId === id && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity w-xl">
              <Button
                variant="secondary"
                size="sm"
                className="gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                Change Image
                <input
                  ref={fileInputRef}
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

    // Default children rendering (recursive call with componentKey)
    const childElements = children
      ? children.map((child) => renderElement(child, componentKey)) // <-- Pass componentKey down
      : content
        ? [content]
        : [];

    return createElement(tag, props, ...childElements);
  };

  return (
    <div className="w-full h-full">
      {/* 1. Render Navbar */}
      {sharedComponents?.navbar.map(
        (element) => renderElement(element, "navbar"), // <-- Render as 'navbar' component
      )}

      {/* 2. Render Page Content */}
      {elements.map((element) => renderElement(element))}

      {/* 3. Render Footer */}
      {sharedComponents?.footer.map(
        (element) => renderElement(element, "footer"), // <-- Render as 'footer' component
      )}
    </div>
  );
}
