"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react"
import { ProgressBar } from "./ui/progress-file"
import { useWebsiteWizard } from "./hooks/useWebsiteWizard"
import { StepFour } from "./ui/step-four"
import { StepOne } from "./ui/step-one"
import { StepThree } from "./ui/step-three"
import { StepTwo } from "./ui/step-two"


const TOTAL_STEPS = 4

export function WebsiteWizard() {
  const { currentStep, canProceed, isSubmitting, handleNext, handleBack, handleSubmit } = useWebsiteWizard(TOTAL_STEPS)

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepOne />
      case 2: return <StepTwo />
      case 3: return <StepThree />
      case 4: return <StepFour />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-balance mb-2">Create Your Website</h1>
          <p className="text-lg text-muted-foreground">Generate your perfect website in just a few steps</p>
        </div>

        <Card className="p-6 sm:p-8">
          <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
          <div className="min-h-[400px] mb-8">{renderStep()}</div>
          <div className="flex justify-between items-center pt-6 border-t">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1 || isSubmitting}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            {currentStep < TOTAL_STEPS ? (
              <Button onClick={handleNext} disabled={!canProceed()}>Next <ArrowRight className="w-4 h-4 ml-2" /></Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canProceed() || isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                Complete
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
