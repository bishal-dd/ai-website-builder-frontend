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
        <h2 className="text-3xl font-bold">Add Page Content</h2>
        <p className="text-muted-foreground">
          No pages selected. Please go back and select at least one page.
        </p>
      </div>
    );
  }

  const currentPageContent = getCurrentPageContent();
  const isHomePage = activeTab === "home";

  // Get errors specific to the current active page
  const currentPageErrors = stepErrors?.[activeTab] || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Add Page Content</h2>
        <p className="text-muted-foreground">
          Fill in content for each section on your pages
        </p>
      </div>

      {/* Tabs - Using Red Border instead of Dot */}
      <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
        {selectedPages.map((page) => {
          const hasError = stepErrors?.[page] && stepErrors[page].length > 0;
          const isActive = activeTab === page;

          return (
            <button
              key={page}
              onClick={() => setActiveTab(page)}
              className={cn(
                "relative py-2.5 px-4 rounded-md capitalize font-medium transition-all border-2",
                // Base Active vs Inactive styles
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-muted text-muted-foreground border-transparent hover:bg-secondary",

                // Error State Styles
                hasError &&
                  (isActive
                    ? "bg-primary text-primary-foreground border-red-500 shadow-md"
                    : "bg-red-50 text-red-700 border-red-500 hover:bg-red-100"),
              )}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Sections List */}
      <div className="space-y-6 max-w-3xl mx-auto">
        {currentPageContent.sections.map((section) => {
          // Identify if THIS specific section has an error
          // This works if your validation logic passes the section ID or Type in the array
          const hasSectionError = currentPageErrors.some(
            (err) =>
              err.toLowerCase().includes(section.type.toLowerCase()) ||
              err === section.id,
          );

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
              // Pass the error message down - SectionEditor will render it below the Textarea
              error={
                hasSectionError
                  ? "This section requires content or AI generation"
                  : null
              }
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
