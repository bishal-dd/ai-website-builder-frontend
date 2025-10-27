"use client";

import { useState } from "react";
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

const TOTAL_STEPS = 4;

export function WebsiteWizard() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { currentStep, canProceed, handleNext, handleBack } =
    useWebsiteWizard(TOTAL_STEPS);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne />;
      case 2:
        return <StepTwo />;
      case 3:
        return <StepThree />;
      case 4:
        return <StepFour />;
      default:
        return null;
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const state = useWizardStore.getState();
      const result = await createWebsiteAPI(state);

      if (!result.success) {
        setErrorMessage(result.error || "Failed to create website");
        return;
      }

      console.log("✅ Website saved with ID:", result.websiteId);
    } catch (err: any) {
      console.error("❌ Error completing website:", err);
      setErrorMessage(err?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-balance mb-2">
            Create Your Website
          </h1>
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
              onClick={handleBack}
              disabled={currentStep === 1 || isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            {currentStep < TOTAL_STEPS ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed() || isLoading}
              >
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!canProceed() || isLoading}
              >
                {isLoading ? (
                  "Generating..."
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" /> Complete
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
