"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionEditor } from "./SectionEditor";
import { useStepFourLogic } from "../hooks/useStepFourLogic";
import { SectionType, sectionTypes } from "../types/section";
import { cn } from "@/lib/utils";

type StepFourProps = {
  stepErrors?: Record<string, string[]>;
};

export function StepFour({ stepErrors }: StepFourProps) {
  const {
    selectedPages,
    activeTab,
    setActiveTab,
    getCurrentPageContent,
    handleAddSection,
    handleUpdateSection,
    handleDeleteSection,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
  } = useStepFourLogic();

  const [selectedSection, setSelectedSection] = useState("");

  if (selectedPages.length === 0) {
    return (
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-balance">Add Page Content</h2>
        <p className="text-muted-foreground text-pretty">
          No pages selected. Please go back and select at least one page.
        </p>
      </div>
    );
  }

  const currentPageContent = getCurrentPageContent();
  const isHomePage = activeTab === "home";

  // Errors for the current page
  const pageErrorMessages = stepErrors?.[activeTab] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-balance">Add Page Content</h2>
        <p className="text-muted-foreground text-pretty">
          Fill in content for each section on your pages
        </p>
      </div>

      {/* Tabs */}
      <div
        className={cn(
          "grid grid-cols-3 gap-2 max-w-2xl mx-auto",
          pageErrorMessages.length > 0 && "ring-1 ring-red-500 rounded-lg p-2"
        )}
      >
        {selectedPages.map((page) => (
          <button
            key={page}
            className={cn(
              "capitalize py-2 px-4 rounded transition-colors",
              activeTab === page
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground"
            )}
            onClick={() => setActiveTab(page)}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Page-level error messages */}
      {pageErrorMessages.length > 0 && (
        <div className="max-w-3xl mx-auto space-y-1">
          {pageErrorMessages.map((msg, idx) => (
            <p key={idx} className="text-sm text-red-500">
              ⚠ {msg}
            </p>
          ))}
        </div>
      )}

      {/* Sections */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {currentPageContent.sections.map((section) => {
          const sectionError =
            pageErrorMessages.find((err) =>
              err.toLowerCase().includes(section.type.toLowerCase())
            ) || null;

          return (
            <SectionEditor
              key={section.id}
              section={section}
              page={currentPageContent.page}
              onUpdate={handleUpdateSection}
              onDelete={handleDeleteSection}
              onAddItem={handleAddItem}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
              error={sectionError} // Pass error to SectionEditor
            />
          );
        })}

        {/* Add section button (Home only) */}
        {isHomePage && (
          <Card className="p-4 border-dashed">
            <Select
              value={selectedSection}
              onValueChange={(value: string) => {
                handleAddSection(value as SectionType);
                setSelectedSection("");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Add another section" />
              </SelectTrigger>
              <SelectContent>
                {sectionTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{type.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {type.description}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </Card>
        )}
      </div>
    </div>
  );
}
