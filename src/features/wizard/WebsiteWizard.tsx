"use client";

import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { ProgressBar } from "./ui/ProgressFile";
import { useWebsiteWizard } from "./hooks/useWebsiteWizard";
import { StepOne } from "./ui/StepOne";
import { StepTwo } from "./ui/StepTwo";
import { StepThree } from "./ui/StepThree";
import { StepFour } from "./ui/StepFour";
import { useWizardStore } from "./store/wizardStore";
import { createWebsiteAPI } from "@/features/wizard/api/createWebsite";
import { WebsiteGenerator } from "./ui/WebsiteGenerator";
import { scrollToFirstError } from "./utils/scrollToFirstError";

const TOTAL_STEPS = 4;

export default function WebsiteWizard() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null);
  const [stepErrors, setStepErrors] = useState<Record<string, string[]>>({});

  const [hasAttemptedComplete, setHasAttemptedComplete] = useState(false);

  const { currentStep, handleNext, handleBack } = useWebsiteWizard(TOTAL_STEPS);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const state = useWizardStore();

  const resetWizard = useWizardStore((state) => state.resetWizard);

  const validateStep = useCallback((): boolean => {
    const errors: Record<string, string[]> = {};

    switch (currentStep) {
      case 1:
        if (!state.websiteType) {
          errors.websiteType = ["Please select a website type."];
        }
        break;

      case 2:
        if (state.selectedPages.length === 0) {
          errors.selectedPages = ["Please select at least one page."];
        }
        break;

      case 3:
        if (!state.websiteName.trim()) {
          errors.websiteName = ["Website name is required."];
        }

        if (!state.description.trim()) {
          errors.description = ["Website description is required."];
        }

        if (!state.contactEmail?.trim() && !state.contactPhone?.trim()) {
          errors.contact = [
            "Please provide at least an email or phone number.",
          ];
        }

        if (
          state.contactEmail &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.contactEmail)
        ) {
          errors.contact = [
            ...(errors.contact || []),
            "Please enter a valid email address.",
          ];
        }
        break;

      case 4:
        // Removed content/item validation since AI generates all content.
        // Step 4 is now effectively always valid as long as the state exists.
        break;
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  }, [currentStep, state]);

  // Cleaned up effect: only validate if relevant.
  // Step 4 content validation is removed, so this effect is mostly defensive now.
  useEffect(() => {
    if (!hasAttemptedComplete) return;
    validateStep();
  }, [hasAttemptedComplete, currentStep, validateStep]);

  const handleNextStep = () => {
    const isValid = validateStep();

    if (!isValid) {
      scrollToFirstError(stepErrors);
      return;
    }

    setStepErrors({});
    handleNext();
  };

  const handleBackStep = () => {
    setHasAttemptedComplete(false);
    setStepErrors({});
    handleBack();
  };

  const handleComplete = async () => {
    setHasAttemptedComplete(true);

    const isValid = validateStep();
    if (!isValid) {
      scrollToFirstError(stepErrors);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await createWebsiteAPI(state);

      if (!result.success) {
        setErrorMessage(result.error || "Failed to create website");
        return;
      }

      if (result.jobId) {
        setLoadingJobId(result.jobId);
      }

      resetWizard();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne stepErrors={stepErrors} />;
      case 2:
        return <StepTwo stepErrors={stepErrors} />;
      case 3:
        return <StepThree stepErrors={stepErrors} />;
      case 4:
        return <StepFour />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">
            Create Your Website
          </h1>
          <p className="text-lg text-muted-foreground">
            Generate your perfect website in just a few steps
          </p>
        </div>

        <Card className="p-6 sm:p-8 border-none shadow-xl bg-card/50 backdrop-blur-sm">
          <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

          <div className="min-h-[400px] mb-8">{renderStep()}</div>

          {errorMessage && (
            <div className="p-3 mb-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
              {errorMessage}
            </div>
          )}

          <div className="flex justify-between items-center pt-6 border-t">
            <Button
              variant="ghost"
              onClick={handleBackStep}
              disabled={currentStep === 1 || isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep < TOTAL_STEPS ? (
              <Button
                onClick={handleNextStep}
                disabled={isLoading}
                className="px-8 transition-all active:scale-95"
              >
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={isLoading}
                className="px-8 bg-primary hover:bg-primary/90 transition-all active:scale-95"
              >
                {isLoading ? (
                  "Generating Site..."
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Complete Setup
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>

      {loadingJobId && <WebsiteGenerator jobId={loadingJobId} />}
    </div>
  );
}
