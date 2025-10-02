"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useWizardStore, type PageType } from "@/features/wizard/store/wizardStore"
import { ScrollArea } from "@/components/ui/scroll-area"

export function StepFour() {
  const { selectedPages, pageContents, updatePageContent } = useWizardStore()

  const getPageContent = (page: PageType) => {
    return (
      pageContents.find((pc) => pc.page === page) || {
        page,
        headline: "",
        description: "",
        imageUrl: "",
      }
    )
  }

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

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-balance">Add Page Content</h2>
        <p className="text-muted-foreground text-pretty">Customize the content for each selected page</p>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-6 max-w-3xl mx-auto">
          {selectedPages.map((page) => {
            const content = getPageContent(page)

            return (
              <Card key={page} className="p-6">
                <h3 className="text-xl font-semibold mb-4 capitalize">{page} Page</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${page}-headline`}>Headline *</Label>
                    <Input
                      id={`${page}-headline`}
                      placeholder={`Enter ${page} page headline`}
                      value={content.headline}
                      onChange={(e) => updatePageContent(page, { headline: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${page}-description`}>Description *</Label>
                    <Textarea
                      id={`${page}-description`}
                      placeholder={`Enter ${page} page description`}
                      value={content.description}
                      onChange={(e) => updatePageContent(page, { description: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${page}-image`}>Image URL (optional)</Label>
                    <Input
                      id={`${page}-image`}
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={content.imageUrl || ""}
                      onChange={(e) => updatePageContent(page, { imageUrl: e.target.value })}
                    />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
