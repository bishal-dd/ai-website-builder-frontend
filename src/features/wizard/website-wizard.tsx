"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { ProgressBar } from "./ui/ProgressFile"
import { useWebsiteWizard } from "./hooks/useWebsiteWizard"
import { StepFour } from "./ui/StepFour"
import { StepOne } from "./ui/StepOne"
import { StepThree } from "./ui/StepThree"
import { StepTwo } from "./ui/StepTwo"
import { useWizardStore } from "./store/wizardStore"
import { buildFullWebsitePrompt } from "./prompts/promptBuilder"
import { generateAIContent } from "@/lib/api"

const TOTAL_STEPS = 4

export function WebsiteWizard() {
  const { currentStep, canProceed, handleNext, handleBack } = useWebsiteWizard(TOTAL_STEPS)

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne />
      case 2:
        return <StepTwo />
      case 3:
        return <StepThree />
      case 4:
        return <StepFour />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-balance mb-2">Create Your Website</h1>
          <p className="text-lg text-muted-foreground">
            Generate your perfect website in just a few steps
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

          <div className="min-h-[400px] mb-8">{renderStep()}</div>

          <div className="flex justify-between items-center pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            {currentStep < TOTAL_STEPS ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
              disabled={!canProceed()}
              onClick={async () => {
                try {
                const state = useWizardStore.getState()
                const fullPrompt = buildFullWebsitePrompt(state)

                console.log("=== Full Website AI Prompt ===");
                console.log(fullPrompt);

                const aiResponse = await generateAIContent(fullPrompt)

                console.log("=== AI Response ===");
                console.log(aiResponse);

                const res = await fetch("/api/save-file", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ content: aiResponse}),
                })
                const data = await res.json()
                if (data.error) throw new Error(data.error)

                window.open(data.url, "_blank")
                } catch (error) {
                  console.error("Error generating AI content:", error);
                }
              }}>
                <Check className="w-4 h-4 mr-2" />
                Complete
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
