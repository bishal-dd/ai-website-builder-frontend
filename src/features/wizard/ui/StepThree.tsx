"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useWizardStore } from "@/features/wizard/store/wizardStore";
import { DESIGN_TYPES } from "../constants";
import { useGeo } from "@/features/preview/domain/hooks/useGeoContext";
import { useEffect } from "react";

export function StepThree() {
  const { country } = useGeo();
  const {
    websiteName,
    tagline,
    designType,
    primaryColor,
    secondaryColor,
    contactEmail,
    contactPhone,
    setWebsiteInfo,
  } = useWizardStore();

  useEffect(() => {
    if (country) setWebsiteInfo({ country });
  }, [country, setWebsiteInfo]);

  const handleChange = (field: string, value: string) => {
    setWebsiteInfo({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-balance">Website Information</h2>
        <p className="text-muted-foreground text-pretty">
          Tell us about your website and brand
        </p>
      </div>

      <Card className="p-6 max-w-2xl mx-auto">
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Website name */}
            <div className="space-y-2">
              <Label htmlFor="websiteName">Website Name *</Label>
              <Input
                id="websiteName"
                placeholder="My Awesome Site"
                value={websiteName}
                onChange={(e) => handleChange("websiteName", e.target.value)}
              />
            </div>

            {/* Tagline */}
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                placeholder="Building the future"
                value={tagline}
                onChange={(e) => handleChange("tagline", e.target.value)}
              />
            </div>

            {/* Contact Email */}
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="you@example.com"
                value={contactEmail}
                onChange={(e) => handleChange("contactEmail", e.target.value)}
              />
            </div>

            {/* Contact Phone */}
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone</Label>
              <Input
                id="contactPhone"
                type="tel"
                placeholder="+975 17 123 456"
                value={contactPhone}
                onChange={(e) => handleChange("contactPhone", e.target.value)}
              />
            </div>

            {/* Design type */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="designType">Design Type *</Label>
              <Select
                value={designType}
                onValueChange={(value) => handleChange("designType", value)}
              >
                <SelectTrigger id="designType">
                  <SelectValue placeholder="Select design type" />
                </SelectTrigger>
                <SelectContent>
                  {DESIGN_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 rounded-lg border bg-muted/30 p-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
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
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={secondaryColor}
                  onChange={(e) =>
                    handleChange("secondaryColor", e.target.value)
                  }
                  className="w-16 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) =>
                    handleChange("secondaryColor", e.target.value)
                  }
                  placeholder="#6366f1"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
