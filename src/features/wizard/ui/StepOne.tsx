"use client";

import { Card } from "@/components/ui/card";
import { useWizardStore } from "@/features/wizard/store/wizardStore";
import { cn } from "@/lib/utils";
import { websiteTypes } from "../constants";

type StepOneProps = {
  stepErrors: Record<string, string[]>;
};

export function StepOne({ stepErrors }: StepOneProps) {
  const { websiteType, setWebsiteType } = useWizardStore();
  const hasError = Boolean(stepErrors.websiteType?.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-balance">
          Choose Your Website Type
        </h2>
        <p className="text-muted-foreground text-pretty">
          Select the type of website you want to create
        </p>
      </div>

      {/* Cards */}
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto",
          hasError && "animate-shake"
        )}
      >
        {websiteTypes.map(({ type, label, description, icon: Icon }) => {
          const isSelected = websiteType === type;

          return (
            <Card
              key={type}
              role="button"
              tabIndex={0}
              onClick={() => setWebsiteType(type)}
              className={cn(
                "p-6 cursor-pointer transition-all duration-200",
                "hover:shadow-lg hover:scale-[1.02]",
                isSelected
                  ? "ring-2 ring-primary bg-primary/5"
                  : "hover:border-primary/50",
                hasError && !isSelected && "border-red-500/40"
              )}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div
                  className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center",
                    "transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">{label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Error message */}
      {hasError && (
        <div className="text-sm text-red-500 text-center space-y-1">
          {stepErrors.websiteType?.map((msg, idx) => (
            <p key={idx}>{msg}</p>
          ))}
        </div>
      )}
    </div>
  );
}
