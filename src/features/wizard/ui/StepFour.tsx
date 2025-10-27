"use client"

import { useStepFourLogic } from "../hooks/useStepFourLogic"
import { SectionEditor } from "./SectionEditor"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SectionType, sectionTypes } from "../types/section"
import { useState } from "react"

export function StepFour() {
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
  } = useStepFourLogic()
  
  const [selectedSection, setSelectedSection] = useState("")

  if (selectedPages.length === 0) {
    return (
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-balance">Add Page Content</h2>
        <p className="text-muted-foreground text-pretty">
          No pages selected. Please go back and select at least one page.
        </p>
      </div>
    )
  }

  const currentPageContent = getCurrentPageContent()

  const isHomePage = activeTab === "home"

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2 max-w-2xl mx-auto">
        {selectedPages.map((page) => (
          <button
            key={page}
            className={`capitalize py-2 px-4 rounded ${
              activeTab === page ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            }`}
            onClick={() => setActiveTab(page)}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Section List */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {currentPageContent.sections.map((section) => (
          <SectionEditor
            key={section.id}
            section={section}
            page={currentPageContent.page}
            onUpdate={handleUpdateSection}
            onDelete={handleDeleteSection}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
        ))}

        {/* Add section button only for home page */}
        {isHomePage && (
          <Card className="p-4 border-dashed">
            <Select 
              value={selectedSection}
              onValueChange={(value: string) => {
                handleAddSection(value as SectionType)
                setSelectedSection("")
              }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Add another section" />
              </SelectTrigger>
              <SelectContent>
                {sectionTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{type.label}</span>
                          <span className="text-xs text-muted-foreground">{type.description}</span>
                        </div>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </Card>
        )}
      </div>
    </div>
  )
}
