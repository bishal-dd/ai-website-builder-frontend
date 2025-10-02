export interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export const STEPS = [
  { number: 1, label: "Website Type" },
  { number: 2, label: "Select Pages" },
  { number: 3, label: "Information" },
  { number: 4, label: "Page Content" },
]