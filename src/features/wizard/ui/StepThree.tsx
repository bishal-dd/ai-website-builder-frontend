"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { useWizardStore } from "@/features/wizard/store/wizardStore";
import { useGeo } from "@/features/preview/domain/hooks/useGeoContext";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  Check,
  ChevronsUpDown,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Palette,
  Share2,
} from "lucide-react";
import { getStates } from "@/lib/geo-api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type StepThreeProps = {
  stepErrors: Record<string, string[]>;
};

export function StepThree({ stepErrors }: StepThreeProps) {
  const { country } = useGeo();
  const {
    websiteName,
    primaryColor,
    contactEmail,
    contactPhone,
    description,
    socialLinks,
    setWebsiteInfo,
    state,
    street,
  } = useWizardStore();

  const [open, setOpen] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [statesList, setStatesList] = useState<
    { name: string; iso2: string }[]
  >([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);

  useEffect(() => {
    if (country) setWebsiteInfo({ country });
  }, [country, setWebsiteInfo]);

  useEffect(() => {
    const loadStates = async () => {
      if (!country) return;

      setIsLoadingStates(true);
      try {
        const data = await getStates(country);
        setStatesList(data);
      } catch (error) {
        console.error("Error loading states:", error);
      } finally {
        setIsLoadingStates(false);
      }
    };

    loadStates();
  }, [country]);

  const handleChange = (field: string, value: string) => {
    setWebsiteInfo({ [field]: value });
    if (field === "contactEmail" && emailError) setEmailError(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Website Details</h2>
        <p className="text-muted-foreground text-pretty">
          Provide the essential info to build out your brand presence.
        </p>
      </div>

      <Card className="p-8 shadow-sm">
        <div className="space-y-10">
          {/* Section 1: Identity */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">General Information</h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="websiteName">
                  Website Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="websiteName"
                  placeholder="Enter your website name"
                  value={websiteName}
                  onChange={(e) => handleChange("websiteName", e.target.value)}
                  className={cn(
                    Boolean(stepErrors.websiteName?.length) &&
                      "border-red-500 focus-visible:ring-red-500",
                  )}
                />
                {stepErrors.websiteName?.map((msg, idx) => (
                  <p key={idx} className="text-sm text-red-500">
                    {msg}
                  </p>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Website Description <span className="text-red-500">*</span>
                </Label>

                <Textarea
                  id="description"
                  placeholder="Describe your business and services..."
                  className={cn(
                    "min-h-[100px] resize-none",
                    Boolean(stepErrors.websiteDescription?.length) &&
                      "border-red-500 focus-visible:ring-red-500",
                  )}
                  value={description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />

                {stepErrors.description?.map((msg, idx) => (
                  <p key={idx} className="text-sm text-red-500">
                    {msg}
                  </p>
                ))}

                <p className="text-xs text-muted-foreground">
                  Detailed descriptions help our AI generate better sections.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Contact Details */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Mail className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Contact & Socials</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Field with Original Validation Logic */}
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email Address</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="you@example.com"
                  value={contactEmail}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                  className={cn(
                    (Boolean(stepErrors.contact?.length) || emailError) &&
                      "border-red-500 focus-visible:ring-red-500",
                  )}
                />
                {(Boolean(stepErrors.contact?.length) || emailError) && (
                  <div className="space-y-1">
                    {stepErrors.contact?.map((msg, idx) => (
                      <p key={idx} className="text-sm text-red-500">
                        {msg}
                      </p>
                    ))}
                    {emailError && (
                      <p className="text-sm text-red-500">{emailError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Phone Field with Original Validation Logic */}
              <div className="space-y-2">
                <Label htmlFor="contactPhone">WhatsApp Number</Label>
                <PhoneInput
                  id="contactPhone"
                  placeholder="Enter phone number"
                  defaultCountry="BT"
                  international
                  value={contactPhone}
                  onChange={(value) =>
                    handleChange("contactPhone", value || "")
                  }
                  className={cn(
                    Boolean(stepErrors.contact?.length) &&
                      "border-red-500 focus-visible:ring-red-500",
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="socialLinks" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Social Media Links (Optional)
              </Label>
              <Textarea
                id="socialLinks"
                placeholder="Paste links separated by commas"
                value={socialLinks}
                onChange={(e) => handleChange("socialLinks", e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple links with commas.
              </p>
            </div>
          </section>

          {/* Section 3: Branding */}
          <section className="p-6 rounded-xl bg-muted/40 border">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-center gap-3 shrink-0">
                <Palette className="w-5 h-5 text-primary" />
                <Label htmlFor="primaryColor" className="text-base">
                  Website Brand Color
                </Label>
              </div>
              <div className="flex items-center gap-3 w-full">
                <Input
                  id="primaryColor"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                  className="w-14 h-10 p-1 cursor-pointer bg-background"
                />
                <Input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                  placeholder="#8b5cf6"
                  className="max-w-[140px] font-mono"
                />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Business Location</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="state">State / Province</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      disabled={!country || isLoadingStates}
                      className={cn(
                        "w-full justify-between font-normal",
                        !state && "text-muted-foreground",
                      )}
                    >
                      {isLoadingStates ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading states...
                        </div>
                      ) : state ? (
                        statesList.find((s) => s.iso2 === state)?.name
                      ) : (
                        "Select state..."
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0"
                    align="start"
                  >
                    <Command>
                      <CommandInput placeholder="Search state..." />
                      <CommandList>
                        <CommandEmpty>No state found.</CommandEmpty>
                        <CommandGroup>
                          {statesList.map((s) => (
                            <CommandItem
                              key={s.iso2}
                              value={s.name}
                              onSelect={() => {
                                handleChange("state", s.iso2);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  state === s.iso2
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {s.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="street">Address</Label>
                <Input
                  id="street"
                  placeholder="123 Business Way"
                  value={street}
                  onChange={(e) => handleChange("street", e.target.value)}
                />
              </div>
            </div>
          </section>
        </div>
      </Card>
    </div>
  );
}
