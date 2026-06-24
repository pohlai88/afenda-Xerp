import type { LucideIcon } from "lucide-react";
import {
  Building2Icon,
  CircleCheckIcon,
  ClipboardCheckIcon,
} from "lucide-react";

export interface StorybookStepperStepDefinition {
  readonly description: string;
  readonly Icon: LucideIcon;
  readonly id: string;
  readonly title: string;
}

export const STEPPER_VERTICAL_STEPS: readonly StorybookStepperStepDefinition[] =
  [
    {
      id: "context",
      title: "Operating context",
      description: "Select tenant, company, and legal entity scope.",
      Icon: Building2Icon,
    },
    {
      id: "review",
      title: "Review access",
      description: "Confirm roles and membership grants before applying.",
      Icon: ClipboardCheckIcon,
    },
    {
      id: "complete",
      title: "Complete",
      description: "Changes are queued in the outbox for processing.",
      Icon: CircleCheckIcon,
    },
  ] as const;

export const STEPPER_VERTICAL_BACK_LABEL = "Back";
export const STEPPER_VERTICAL_NEXT_LABEL = "Next";
