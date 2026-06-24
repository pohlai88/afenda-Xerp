"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Button } from "../../button";
import {
  STEPPER_VERTICAL_BACK_LABEL,
  STEPPER_VERTICAL_NEXT_LABEL,
  STEPPER_VERTICAL_STEPS,
} from "./stepper-fixtures";
import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "./stepper";

export interface StorybookStepperVerticalDemoProps {
  readonly steps?: readonly (typeof STEPPER_VERTICAL_STEPS)[number][];
}

/**
 * Storybook-only vertical stepper — normalized from shadcn-studio stepper-09.
 *
 * Phase 3 normalization:
 *   - Zero className on Button (governed intent/emphasis props)
 *   - Layout + dashed content panel in stepper-preview.css
 *   - ERP-themed step copy + Lucide icons (no emoji)
 */
export function StorybookStepperVerticalDemo({
  steps: stepDefinitions = STEPPER_VERTICAL_STEPS,
}: StorybookStepperVerticalDemoProps): ReactNode {
  const steps = useMemo(
    () =>
      stepDefinitions.map(({ Icon, ...step }) => ({
        ...step,
        icon: <Icon aria-hidden="true" />,
      })),
    [stepDefinitions]
  );

  const [current, setCurrent] = useState(steps[0]?.id ?? "context");

  const currentIndex = steps.findIndex((step) => step.id === current);
  const goNext = () => {
    const nextStep = steps[Math.min(currentIndex + 1, steps.length - 1)];
    if (nextStep) {
      setCurrent(nextStep.id);
    }
  };
  const goBack = () => {
    const previousStep = steps[Math.max(currentIndex - 1, 0)];
    if (previousStep) {
      setCurrent(previousStep.id);
    }
  };

  const backButtonGoverned =
    currentIndex === 0
      ? {
          emphasis: "solid" as const,
          intent: "secondary" as const,
          size: "md" as const,
        }
      : {
          emphasis: "solid" as const,
          intent: "primary" as const,
          size: "md" as const,
        };
  const nextButtonGoverned =
    currentIndex === steps.length - 1
      ? {
          emphasis: "solid" as const,
          intent: "secondary" as const,
          size: "md" as const,
        }
      : {
          emphasis: "solid" as const,
          intent: "primary" as const,
          size: "md" as const,
        };

  return (
    <div className="afenda-storybook-stepper">
      <Stepper
        onValueChange={setCurrent}
        orientation="vertical"
        steps={steps}
        value={current}
      >
        <StepperNav>
          {steps.map((step, index) => (
            <StepperItem key={step.id} stepId={step.id}>
              <StepperTrigger>
                <StepperIndicator>{index + 1}</StepperIndicator>
                <div className="afenda-storybook-stepper__trigger-copy">
                  <StepperTitle>{step.title}</StepperTitle>
                  <StepperDescription>{step.description}</StepperDescription>
                </div>
              </StepperTrigger>
              {index < steps.length - 1 ? <StepperSeparator /> : null}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel>
          {steps.map((step) => (
            <StepperContent key={step.id} value={step.id}>
              <div className="afenda-storybook-stepper__content-panel">
                <div className="afenda-storybook-stepper__content-intro">
                  <h3 className="afenda-storybook-stepper__content-heading">
                    {step.title}
                  </h3>
                  <p className="afenda-storybook-stepper__content-description">
                    {step.description}
                  </p>
                </div>

                <div className="afenda-storybook-stepper__content-body">
                  <div
                    aria-live="polite"
                    className="afenda-storybook-stepper__placeholder"
                  >
                    <span>{step.title} content</span>
                  </div>

                  <div className="afenda-storybook-stepper__actions">
                    <Button
                      {...backButtonGoverned}
                      disabled={currentIndex === 0}
                      onClick={goBack}
                      type="button"
                    >
                      <span className="afenda-storybook-stepper__btn-inner">
                        <ArrowLeftIcon aria-hidden="true" />
                        {STEPPER_VERTICAL_BACK_LABEL}
                      </span>
                    </Button>

                    <Button
                      {...nextButtonGoverned}
                      disabled={currentIndex === steps.length - 1}
                      onClick={goNext}
                      type="button"
                    >
                      <span className="afenda-storybook-stepper__btn-inner">
                        {STEPPER_VERTICAL_NEXT_LABEL}
                        <ArrowRightIcon aria-hidden="true" />
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </div>
  );
}
