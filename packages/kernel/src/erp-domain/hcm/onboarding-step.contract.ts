export const ONBOARDING_STEPS = [
  "offer",
  "paperwork",
  "provisioning",
  "orientation",
  "complete",
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export function isOnboardingStep(value: string): value is OnboardingStep {
  return (ONBOARDING_STEPS as readonly string[]).includes(value);
}
