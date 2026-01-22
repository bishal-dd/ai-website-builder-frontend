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

const TOTAL_STEPS = 4;

export default function WebsiteWizard() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null);
  const [stepErrors, setStepErrors] = useState<Record<string, string[]>>({});

  const { currentStep, handleNext, handleBack } = useWebsiteWizard(TOTAL_STEPS);
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
        state.selectedPages.forEach((page) => {
          const pageData = state.pageContents.find((p) => p.page === page);
          const invalidSectionIds: string[] = [];

          if (pageData) {
            pageData.sections.forEach((section) => {
              const hasContent =
                section.content && section.content.trim().length > 0;
              const hasItems = section.items && section.items.length > 0;
              if (!section.aiGenerated && !hasContent && !hasItems) {
                invalidSectionIds.push(section.id);
              }
            });
          }
          if (invalidSectionIds.length > 0) {
            errors[page] = invalidSectionIds;
          }
        });
        break;
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  }, [currentStep, state]);

  useEffect(() => {
    const hasExistingErrors = Object.keys(stepErrors).length > 0;
    if (hasExistingErrors) {
      validateStep();
    }
  }, [
    stepErrors,
    state.pageContents,
    state.websiteName,
    state.selectedPages,
    validateStep,
  ]);

  const handleNextStep = () => {
    if (validateStep()) {
      setStepErrors({});
      handleNext();
    }
  };

  const handleBackStep = () => {
    setStepErrors({});
    handleBack();
  };

  const handleComplete = async () => {
    if (!validateStep()) return;

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
        return <StepFour stepErrors={stepErrors} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Create Your Website</h1>
          <p className="text-lg text-muted-foreground">
            Generate your perfect website in just a few steps
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

          <div className="min-h-[400px] mb-8">{renderStep()}</div>

          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

          <div className="flex justify-between items-center pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBackStep}
              disabled={currentStep === 1 || isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep < TOTAL_STEPS ? (
              <Button onClick={handleNextStep} disabled={isLoading}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={isLoading}>
                {isLoading ? (
                  "Submitting..."
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Complete
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
