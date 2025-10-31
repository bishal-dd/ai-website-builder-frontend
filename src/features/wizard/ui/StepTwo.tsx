"use client";

import { Card } from "@/components/ui/card";
import { useWizardStore } from "@/features/wizard/store/wizardStore";
import { cn } from "@/lib/utils";
import { pageOptions, websitePagesMap } from "../constants";
import { Check } from "lucide-react";

export function StepTwo() {
  const { websiteType, selectedPages, togglePage } = useWizardStore();

  // test slack
  if (!websiteType) return null;

  const availablePages = websitePagesMap[websiteType] || [];
  const filteredOptions = pageOptions.filter((page) =>
    availablePages.includes(page.type),
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-balance">Select Your Pages</h2>
        <p className="text-muted-foreground text-pretty">
          Choose which pages you want to include in your website
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {filteredOptions.map((page) => {
          const Icon = page.icon;
          const isSelected = selectedPages.includes(page.type);

          return (
            <Card
              key={page.type}
              className={cn(
                "p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] relative",
                isSelected
                  ? "ring-2 ring-primary bg-primary/5"
                  : "hover:border-primary/50",
              )}
              onClick={() => togglePage(page.type)}
            >
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
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{page.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {page.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
