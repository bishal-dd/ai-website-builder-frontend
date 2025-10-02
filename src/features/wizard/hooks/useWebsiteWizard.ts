import { useWizardStore } from "@/features/wizard/store/wizardStore"
import { useState } from "react"

export const useWebsiteWizard = (totalSteps: number) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    currentStep,
    setCurrentStep,
    websiteType,
    selectedPages,
    websiteName,
    tagline,
    ownerName,
    ownerEmail,
    pageContents,
    resetWizard,
  } = useWizardStore()

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return websiteType !== null
      case 2:
        return selectedPages.length > 0
      case 3:
        return websiteName.trim() && tagline.trim() && ownerName.trim() && ownerEmail.trim()
      case 4:
        return selectedPages.every((page) => {
          const content = pageContents.find((pc) => pc.page === page)
          return content && content.headline.trim() && content.description.trim()
        })
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(useWizardStore.getState()),
      })
      if (!response.ok) throw new Error("Failed to submit")
      resetWizard()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    currentStep,
    canProceed,
    isSubmitting,
    handleNext,
    handleBack,
    handleSubmit,
  }
}
