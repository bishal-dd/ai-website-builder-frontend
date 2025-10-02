"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProgressBarProps } from "../types"
import { STEPS } from "../constants";


export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300",
                  currentStep > step.number
                    ? "bg-primary text-primary-foreground"
                    : currentStep === step.number
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
              </div>
              <span
                className={cn(
                  "text-xs font-medium text-center transition-colors hidden sm:block",
                  currentStep >= step.number ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 sm:mx-4">
                <div
                  className={cn(
                    "h-full transition-all duration-300",
                    currentStep > step.number ? "bg-primary" : "bg-border",
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
