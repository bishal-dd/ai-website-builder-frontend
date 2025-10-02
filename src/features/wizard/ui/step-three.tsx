"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWizardStore } from "@/features/wizard/store/wizardStore"
export function StepThree() {
  const { websiteName, tagline, ownerName, ownerEmail, primaryColor, secondaryColor, setWebsiteInfo } = useWizardStore()

  const handleChange = (field: string, value: string) => {
    setWebsiteInfo({
      websiteName,
      tagline,
      ownerName,
      ownerEmail,
      primaryColor,
      secondaryColor,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-balance">Website Information</h2>
        <p className="text-muted-foreground text-pretty">Tell us about your website and brand</p>
      </div>

      <Card className="p-6 max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="websiteName">Website Name *</Label>
              <Input
                id="websiteName"
                placeholder="My Awesome Site"
                value={websiteName}
                onChange={(e) => handleChange("websiteName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline *</Label>
              <Input
                id="tagline"
                placeholder="Building the future"
                value={tagline}
                onChange={(e) => handleChange("tagline", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="ownerName">Your Name *</Label>
              <Input
                id="ownerName"
                placeholder="John Doe"
                value={ownerName}
                onChange={(e) => handleChange("ownerName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerEmail">Your Email *</Label>
              <Input
                id="ownerEmail"
                type="email"
                placeholder="john@example.com"
                value={ownerEmail}
                onChange={(e) => handleChange("ownerEmail", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color *</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                  className="w-16 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                  placeholder="#8b5cf6"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Secondary Color *</Label>
              <div className="flex gap-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => handleChange("secondaryColor", e.target.value)}
                  className="w-16 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => handleChange("secondaryColor", e.target.value)}
                  placeholder="#6366f1"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
