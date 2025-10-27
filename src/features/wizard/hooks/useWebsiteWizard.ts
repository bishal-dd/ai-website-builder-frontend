import { useWizardStore } from "@/features/wizard/store/wizardStore"

export const useWebsiteWizard = (totalSteps: number) => {
  const {
    currentStep,
    setCurrentStep,
    websiteType,
    selectedPages,
    websiteName,
    tagline,
    designType,
    pageContents,
  } = useWizardStore()

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return websiteType !== null
      case 2:
        return selectedPages.length > 0
      case 3:
        return (
          websiteName.trim() !== "" &&
          (designType || "").trim() !== ""
        )
      case 4:
        return selectedPages.every((page) => {
          const content = pageContents.find((pc) => pc.page === page)
          return content && content.sections.length > 0
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

  return {
    currentStep,
    canProceed,
    handleNext,
    handleBack,
  }
}
