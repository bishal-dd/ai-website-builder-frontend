"use client";

import { Card } from "@/components/ui/card";
import { useWizardStore } from "@/features/wizard/store/wizardStore";
import { cn } from "@/lib/utils";
import { pageOptions, websitePagesMap } from "../constants";
import { Check } from "lucide-react";

type StepTwoProps = {
  stepErrors: Record<string, string[]>;
};

export function StepTwo({ stepErrors }: StepTwoProps) {
  const { websiteType, selectedPages, togglePage } = useWizardStore();
  const hasError = Boolean(stepErrors.selectedPages?.length);

  if (!websiteType) return null;

  const availablePages = websitePagesMap[websiteType] ?? [];
  const filteredOptions = pageOptions.filter((page) =>
    availablePages.includes(page.type)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-balance">Select Your Pages</h2>
        <p className="text-muted-foreground text-pretty">
          Choose which pages you want to include in your website
        </p>
      </div>

      {/* Page Cards */}
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto",
          hasError && "animate-shake"
        )}
      >
        {filteredOptions.map(({ type, label, description, icon: Icon }) => {
          const isSelected = selectedPages.includes(type);

          return (
            <Card
              key={type}
              role="button"
              tabIndex={0}
              onClick={() => togglePage(type)}
              className={cn(
                "p-5 cursor-pointer relative transition-all duration-200",
                "hover:shadow-lg hover:scale-[1.02]",
                isSelected
                  ? "ring-2 ring-primary bg-primary/5"
                  : "hover:border-primary/50",
                hasError && !isSelected && "border-red-500/40"
              )}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
              )}

              <div className="flex flex-col items-center text-center gap-3">
                <div
                  className={cn(
                    "w-11 h-11 rounded-lg flex items-center justify-center transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="font-semibold">{label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Error Messages */}
      {hasError && (
        <div className="text-sm text-red-500 text-center space-y-1">
          {stepErrors.selectedPages?.map((msg, idx) => (
            <p key={idx}>{msg}</p>
          ))}
        </div>
      )}
    </div>
  );
}
