"use client";

import {
  ArrowRight,
  Building2,
  Check,
  Globe2,
  House,
  PanelsTopLeft,
} from "lucide-react";
import { useState } from "react";

const steps = [
  {
    number: "01",
    label: "Website type",
  },
  {
    number: "02",
    label: "Pages",
  },
  {
    number: "03",
    label: "Information",
  },
];

const websiteTypes = [
  {
    label: "travel agency",
    displayLabel: "Travel Agency",
    icon: Globe2,
  },
  {
    label: "smallMediumBusiness",
    displayLabel: "Small Medium Business",
    icon: Building2,
  },
  {
    label: "real estate",
    displayLabel: "Real Estate",
    icon: House,
  },
  {
    label: "portfolio",
    displayLabel: "Portfolio",
    icon: PanelsTopLeft,
  },
];

const availablePages = ["home", "about", "services", "contact"];

const LOGIN_URL = `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`;

type CreationData = {
  websiteType: string;
  pages: string[];
  businessInfo: {
    name: string;
    description: string;
  };
};

export function CreationFlowPreview() {
  const [activeStep, setActiveStep] = useState(0);

  const [creationData, setCreationData] = useState<CreationData>({
    websiteType: "",
    pages: ["Home"],
    businessInfo: {
      name: "",
      description: "",
    },
  });

  const selectWebsiteType = (websiteType: string) => {
    setCreationData((current) => ({
      ...current,
      websiteType,
    }));
  };

  const togglePage = (page: string) => {
    setCreationData((current) => {
      const isSelected = current.pages.includes(page);

      if (isSelected) {
        if (current.pages.length === 1) {
          return current;
        }

        return {
          ...current,
          pages: current.pages.filter((currentPage) => currentPage !== page),
        };
      }

      return {
        ...current,
        pages: [...current.pages, page],
      };
    });
  };

  const updateBusinessInfo = (
    field: keyof CreationData["businessInfo"],
    value: string,
  ) => {
    setCreationData((current) => ({
      ...current,
      businessInfo: {
        ...current.businessInfo,
        [field]: value,
      },
    }));
  };

  const canContinueFromCurrentStep = () => {
    if (activeStep === 0) {
      return Boolean(creationData.websiteType);
    }

    if (activeStep === 1) {
      return creationData.pages.length > 0;
    }

    return (
      creationData.businessInfo.name.trim().length > 0 &&
      creationData.businessInfo.description.trim().length > 0
    );
  };

  const handleContinue = () => {
    if (!canContinueFromCurrentStep()) {
      return;
    }

    setActiveStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const handleGenerate = () => {
    if (!canContinueFromCurrentStep()) {
      return;
    }

    const wizardData = {
      websiteType: creationData.websiteType,
      selectedPages: creationData.pages,
      websiteName: creationData.businessInfo.name,
      description: creationData.businessInfo.description,
    };

    const loginUrl = new URL(LOGIN_URL);

    loginUrl.searchParams.set("intent", "create");
    loginUrl.searchParams.set("data", JSON.stringify(wizardData));

    console.log("WIZARD DATA:", JSON.stringify(wizardData));
    console.log("LOGIN URL:", loginUrl.toString());

    window.location.href = loginUrl.toString();
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-primary/5">
        <div className="flex h-12 items-center border-b bg-muted/30 px-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
          </div>

          <div className="mx-auto hidden rounded-md border bg-background px-4 py-1 text-xs text-muted-foreground sm:block">
            sencillai.com/wizard
          </div>

          <div className="w-14" />
        </div>

        <div className="grid min-h-110 md:grid-cols-[220px_1fr]">
          <div className="border-b bg-muted/20 p-6 md:border-b-0 md:border-r">
            <p className="mb-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Create your website
            </p>

            <div className="space-y-3">
              {steps.map((step, index) => {
                const isActive = activeStep === index;
                const isComplete = index < activeStep;

                return (
                  <button
                    key={step.number}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        isComplete
                          ? "bg-primary text-primary-foreground"
                          : isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isComplete ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        step.number
                      )}
                    </div>

                    <span className="text-sm font-medium">{step.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 rounded-lg border bg-background p-4">
              <p className="text-xs text-muted-foreground">
                No coding required
              </p>

              <p className="mt-1 text-sm font-medium">
                Sencill handles the rest.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-2xl">
              {activeStep === 0 && (
                <WebsiteTypePreview
                  selectedType={creationData.websiteType}
                  onSelect={selectWebsiteType}
                  onContinue={handleContinue}
                  canContinue={canContinueFromCurrentStep()}
                />
              )}

              {activeStep === 1 && (
                <PagesPreview
                  selectedPages={creationData.pages}
                  onToggle={togglePage}
                  onContinue={handleContinue}
                  canContinue={canContinueFromCurrentStep()}
                />
              )}

              {activeStep === 2 && (
                <InformationPreview
                  businessInfo={creationData.businessInfo}
                  onChange={updateBusinessInfo}
                  onGenerate={handleGenerate}
                  canGenerate={canContinueFromCurrentStep()}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type WebsiteTypePreviewProps = {
  selectedType: string;
  onSelect: (type: string) => void;
  onContinue: () => void;
  canContinue: boolean;
};

function WebsiteTypePreview({
  selectedType,
  onSelect,
  onContinue,
  canContinue,
}: WebsiteTypePreviewProps) {
  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Step 1</p>

        <h3 className="mt-2 text-2xl font-semibold tracking-tight">
          What type of website do you need?
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Start by choosing the type that best describes your website.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {websiteTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.label;

          return (
            <button
              key={type.label}
              type="button"
              onClick={() => onSelect(type.label)}
              className={`rounded-xl border p-4 text-left transition ${
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "hover:border-primary/30 hover:bg-muted/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-primary" />

                {isSelected && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </div>
              <p className="mt-4 text-sm font-medium capitalize">
                {type.displayLabel}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <PreviewButton onClick={onContinue} disabled={!canContinue} />
      </div>
    </div>
  );
}

type PagesPreviewProps = {
  selectedPages: string[];
  onToggle: (page: string) => void;
  onContinue: () => void;
  canContinue: boolean;
};

function PagesPreview({
  selectedPages,
  onToggle,
  onContinue,
  canContinue,
}: PagesPreviewProps) {
  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Step 2</p>

        <h3 className="mt-2 text-2xl font-semibold tracking-tight">
          Which pages do you need?
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Choose the pages your visitors will need.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {availablePages.map((page) => {
          const isSelected = selectedPages.includes(page);

          return (
            <button
              key={page}
              type="button"
              onClick={() => onToggle(page)}
              className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "hover:border-primary/30 hover:bg-muted/30"
              }`}
            >
              <span className="text-sm font-medium capitalize">{page}</span>
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                }`}
              >
                {isSelected && (
                  <Check className="h-3 w-3 text-primary-foreground" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <PreviewButton onClick={onContinue} disabled={!canContinue} />
      </div>
    </div>
  );
}

type InformationPreviewProps = {
  businessInfo: {
    name: string;
    description: string;
  };
  onChange: (field: "name" | "description", value: string) => void;
  onGenerate: () => void;
  canGenerate: boolean;
};

function InformationPreview({
  businessInfo,
  onChange,
  onGenerate,
  canGenerate,
}: InformationPreviewProps) {
  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Step 3</p>

        <h3 className="mt-2 text-2xl font-semibold tracking-tight">
          Tell us about your business.
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Give Sencill the information it needs to build your website.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="preview-business-name"
            className="mb-2 block text-xs font-medium"
          >
            Business name
          </label>

          <input
            id="preview-business-name"
            type="text"
            value={businessInfo.name}
            onChange={(event) => onChange("name", event.target.value)}
            placeholder="e.g. Mountain Cafe"
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div>
          <label
            htmlFor="preview-business-description"
            className="mb-2 block text-xs font-medium"
          >
            About your business
          </label>

          <textarea
            id="preview-business-description"
            value={businessInfo.description}
            onChange={(event) => onChange("description", event.target.value)}
            placeholder="Tell us about your business..."
            rows={4}
            className="w-full resize-none rounded-lg border bg-background px-3 py-3 text-sm leading-relaxed outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <PreviewButton
          label="Generate website"
          onClick={onGenerate}
          disabled={!canGenerate}
        />
      </div>
    </div>
  );
}

type PreviewButtonProps = {
  label?: string;
  onClick: () => void;
  disabled?: boolean;
};

function PreviewButton({
  label = "Continue",
  onClick,
  disabled = false,
}: PreviewButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}

      <ArrowRight className="h-4 w-4" />
    </button>
  );
}
