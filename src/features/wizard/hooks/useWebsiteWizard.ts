import { useWizardStore } from "@/features/wizard/store/wizardStore";

export const useWebsiteWizard = (totalSteps: number) => {
  const {
    currentStep,
    setCurrentStep,
    websiteType,
    selectedPages,
    websiteName,
    designType,
    pageContents,
    email,
  } = useWizardStore();

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return websiteType !== null;
      case 2:
        return selectedPages.length > 0;
      case 3:
        return (
          websiteName.trim() !== "" &&
          (designType || "").trim() !== "" &&
          (email || "").trim() !== ""
        );
      case 4:
        return selectedPages.every((page) => {
          const pageData = pageContents.find((pc) => pc.page === page);
          if (!pageData) return false;

          // check if every section has either content or aiGenerated true
          return pageData.sections.every(
            (section) =>
              (section.content && section.content.trim() !== "") ||
              section.aiGenerated
          );
        });
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return {
    currentStep,
    canProceed,
    handleNext,
    handleBack,
  };
};
