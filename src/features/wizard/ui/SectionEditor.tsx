"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, FileText } from "lucide-react"
import { Section, SectionType, sectionTypes } from "../types/section"
import { PageType } from "../types"

interface SectionEditorProps {
  section: Section
  page: PageType
  onUpdate: (sectionId: string, updates: Partial<Section>) => void
  onDelete: (sectionId: string) => void
  onAddItem: (sectionId: string, section: Section) => void
  onUpdateItem: (sectionId: string, section: Section, index: number, value: string) => void
  onDeleteItem: (sectionId: string, section: Section, index: number) => void
}

export function SectionEditor({
  section,
  page,
  onUpdate,
  onDelete,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}: SectionEditorProps) {
  const sectionTypeInfo = sectionTypes.find((st) => st.value === section.type)
  const Icon = sectionTypeInfo?.icon || FileText
  const canDelete = page === "home"

  return (
    <Card key={section.id} className="p-6">
      <div className="flex items-start justify-between mb-4">
        {/* Section Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold capitalize">
              {sectionTypeInfo?.label}
            </h3>
          </div>
          {sectionTypeInfo?.description && (
            <p className="text-sm text-muted-foreground">{sectionTypeInfo.description}</p>
          )}
        </div>

        {canDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(section.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor={`${section.id}-content`}>Content *</Label>
          <Textarea
            id={`${section.id}-content`}
            placeholder={
              section.placeholder ||
              "Start writing your section content here..."
            }
            value={section.content}
            onChange={(e) => onUpdate(section.id, { content: e.target.value })}
            rows={3}
          />
        </div>

        {/* Image URL (optional) */}
        {(section.type === "hero" ||
          section.type === "cta" ||
          section.type === "gallery") && (
          <div className="space-y-2">
            <Label htmlFor={`${section.id}-image`}>Image URL (optional)</Label>
            <Input
              id={`${section.id}-image`}
              type="url"
              placeholder="https://example.com/image.jpg"
              value={section.imageUrl || ""}
              onChange={(e) => onUpdate(section.id, { imageUrl: e.target.value })}
            />
          </div>
        )}

        {/* Items */}
        {section.items && (
          <div className="space-y-2">
            <Label>
              {section.type === "features" && "Features List"}
              {section.type === "testimonials" && "Testimonials"}
              {section.type === "gallery" && "Image URLs"}
              {section.type === "faq" && "Questions & Answers"}
            </Label>
            <div className="space-y-2">
              {section.items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Item ${index + 1}`}
                    value={item}
                    onChange={(e) =>
                      onUpdateItem(section.id, section, index, e.target.value)
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteItem(section.id, section, index)}
                    className="shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddItem(section.id, section)}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
