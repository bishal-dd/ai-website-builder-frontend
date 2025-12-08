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
import { useSession } from "@/shared/session";

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

// Helper function to convert a CSS style string to a React style object
// This ensures that the fixed dimensions are always strongly applied.
const cssStringToObject = (
  cssString: string | undefined,
): React.CSSProperties => {
  if (!cssString) return {};

  // Use an index signature internally
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
  sharedComponents, // <-- Destructure new prop
  onUpdateElement,
  onUpdateSharedElement, // <-- Destructure new prop
  onNavigate,
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

  // ** FULL IMPLEMENTATION FOR IMAGE UPLOAD **
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number,
    componentKey?: "navbar" | "footer",
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Determine the correct update function based on componentKey
    const updater = componentKey
      ? (content: string) =>
          onUpdateSharedElement?.(componentKey, id, { content })
      : (content: string) => onUpdateElement?.(id, { content });

    try {
      // 1. Generate unique filename and key
      const fileExtension = file.name.split(".").pop() || "png";
      // Use crypto.randomUUID for a strong, unique identifier
      const uniqueId = crypto.randomUUID();
      const fileKey = `${uniqueId}.${fileExtension}`;

      // 2. Get Presigned URL from the backend
      const presignUrlResponse = await fetch("http://localhost:4000/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          fileName: fileKey,
          fileType: file.type,
        }),
      });

      if (!presignUrlResponse.ok) {
        throw new Error("Failed to get presigned URL.");
      }

      const { url: presignedUrl } = await presignUrlResponse.json();

      // 3. Upload file to S3/CloudFront via the presigned URL (PUT request)
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
      }

      // 4. Construct final CloudFront URL
      const cloudfrontDomain = "d28hne0rpm84ao.cloudfront.net";
      const cloudfrontUrl = `https://${cloudfrontDomain}/${user?.id}/previews/images/${fileKey}`;

      // 5. Update the element's content/src using the determined updater
      updater(cloudfrontUrl);
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      // 6. Clear the file input value
      event.target.value = "";
    }
  };
  // ** END FULL IMPLEMENTATION **

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
      // ** FIX APPLIED HERE **
      // 1. Convert the fixed style string into a React style object
      const fixedDimensionsStyle = cssStringToObject(attributes?.style);

      return (
        <div
          key={id}
          className="relative inline-block group"
          onMouseEnter={() => setHoveredImageId(id)}
          onMouseLeave={() => setHoveredImageId(null)}
        >
          {createElement(tag, {
            ...props,
            // Use content (new URL) or attributes.src (initial/fallback) for image source
            src: content || attributes?.src,
            alt: attributes?.alt || "Image",
            // 2. Pass the style object directly. This ensures the fixed dimensions
            //    are strongly applied via inline styles, overriding potential class conflicts,
            //    and ensuring object-cover works correctly.
            style: {
              ...fixedDimensionsStyle,
              objectFit: "cover", // Explicitly guarantee coverage within fixed bounds
            },
          })}
          {hoveredImageId === id && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity w-xl rounded-md">
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
                  // ** Pass componentKey here to know which element collection to update **
                  onChange={(e) => handleImageChange(e, id, componentKey)}
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
