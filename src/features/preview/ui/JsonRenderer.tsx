"use client";

import type React from "react";

import type { WebElement } from "../types/webElement";
import { createElement, useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

interface JsonRendererProps {
  elements: WebElement[];
  onUpdateElement?: (id: number, updates: Partial<WebElement>) => void;
}

export function JsonRenderer({ elements, onUpdateElement }: JsonRendererProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);
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

  const renderElement = (element: WebElement): React.ReactNode => {
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
        onKeyDown: (
          e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => handleTextKeyDown(e, id),
        className: `${className || ""} outline-2 outline-primary outline-dashed bg-primary/10`,
        ...(isMultiline && { rows: 3 }),
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props: any = {
      key: id,
      className: className || undefined,
      ...(type && { type }),
    };

    if (isTextElement && onUpdateElement) {
      props.onClick = (e: React.MouseEvent<HTMLDivElement>) => {
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
            src: attributes?.src,
            alt: attributes?.alt,
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
