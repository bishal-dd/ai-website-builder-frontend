import { useWizardStore } from "@/features/wizard/store/wizardStore";

export type WizardStepErrors = {
  websiteType?: string[];
  pages?: string[];
  websiteName?: string[];
  websiteDescription?: string[];
  contact?: string[];
  pageErrors?: Record<string, string[]>;
};

export const useWebsiteWizard = (totalSteps: number) => {
  const {
    currentStep,
    setCurrentStep,
    websiteType,
    selectedPages,
    websiteName,
    pageContents,
    contactEmail,
    contactPhone,
    description,
  } = useWizardStore();

  /** Validate current step and return structured errors */
  const validateStep = (): WizardStepErrors => {
    const errors: WizardStepErrors = {};

    switch (currentStep) {
      case 1:
        if (!websiteType) errors.websiteType = ["Please select a website type"];
        break;

      case 2:
        if (selectedPages.length === 0)
          errors.pages = ["Select at least one page"];
        break;

      case 3:
        if (!websiteName?.trim())
          errors.websiteName = ["Website name is required"];

        if (!description?.trim()) {
          errors.websiteDescription = ["Website description is required"];
        }

        if (!contactEmail?.trim() && !contactPhone?.trim()) {
          errors.contact = ["Provide at least an email or a phone number"];
        }
        break;

      case 4:
        const pageErrors: Record<string, string[]> = {};

        selectedPages.forEach((page) => {
          const pageData = pageContents.find((pc) => pc.page === page);

          // If the page has no sections at all
          if (!pageData || pageData.sections.length === 0) {
            pageErrors[page] = ["All sections are empty"];
            return;
          }

          // Find which sections are empty (excluding AI-generated)
          const emptySections = pageData.sections
            .filter(
              (section) =>
                !section.aiGenerated &&
                (!section.content || !section.content.trim()),
            )
            .map((section) => section.type);
          if (emptySections.length > 0) pageErrors[page] = emptySections;
        });

        if (Object.keys(pageErrors).length > 0) errors.pageErrors = pageErrors;
        break;
    }

    return errors;
  };

  /** Go to next step */
  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  /** Go to previous step */
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return {
    currentStep,
    validateStep,
    handleNext,
    handleBack,
  };
};
