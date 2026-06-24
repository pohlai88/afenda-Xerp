/**
 * shadcn/studio — stepper-09 (staging reference only)
 * Source: @ss-components/stepper-09 · new-york-v4
 *
 * Raw MCP output — DO NOT import from consumer packages.
 * Normalized implementation: packages/ui/src/components/_storybook/stepper/
 *
 * Patterns extracted:
 *   - Vertical StepperNav + StepperPanel content swap
 *   - Back/Next navigation with governed Button bridging
 *   - Dashed content panel with step placeholder
 */
"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  AwardIcon,
  BookOpenIcon,
  CodeIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../../button";
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
} from "../../_storybook/stepper/stepper";

const steps = [
  {
    id: "details",
    title: "Details",
    description: "Enter the required details for this step",
    icon: <BookOpenIcon />,
  },
  {
    id: "review",
    title: "Review",
    description: "Confirm your information and choices",
    icon: <CodeIcon />,
  },
  {
    id: "done",
    title: "Done",
    description: "All set. review completed",
    icon: <AwardIcon />,
  },
];

const StepperVerticalDemo = () => {
  const [current, setCurrent] = useState(steps[0].id);

  const currentIndex = steps.findIndex((s) => s.id === current);
  const goNext = () =>
    setCurrent(steps[Math.min(currentIndex + 1, steps.length - 1)].id);
  const goBack = () =>
    setCurrent(steps[Math.max(currentIndex - 1, 0)].id);

  return (
    <div className="flex items-center justify-center">
      <Stepper
        className="flex items-center justify-center gap-10 max-lg:flex-col max-lg:items-start"
        onValueChange={setCurrent}
        orientation="vertical"
        steps={steps}
        value={current}
      >
        <StepperNav className="w-60">
          {steps.map((step, index) => (
            <StepperItem
              className="relative items-start"
              key={step.id}
              stepId={step.id}
            >
              <StepperTrigger className="items-start gap-2.5 pb-15 last:pb-0">
                <StepperIndicator>{index + 1}</StepperIndicator>
                <div className="text-left">
                  <StepperTitle>{step.title}</StepperTitle>
                  <StepperDescription>{step.description}</StepperDescription>
                </div>
              </StepperTrigger>
              {index < steps.length - 1 ? (
                <StepperSeparator className="absolute inset-y-0 top-[calc(50%-22px)] left-2 group-data-[orientation=vertical]/stepper-nav:h-15" />
              ) : null}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel className="w-xs text-center text-sm sm:w-116">
          {steps.map((step) => (
            <StepperContent key={step.id} value={step.id}>
              <div className="bg-muted border-primary/15 flex flex-col items-center gap-4 rounded-lg border-2 border-dashed p-4 md:p-8">
                <div className="space-y-2">
                  <h3 className="text-muted-foreground text-lg font-medium">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>

                <div className="w-full">
                  <div className="text-muted-foreground flex h-36 items-center justify-center">
                    <span className="text-base">{step.title} content</span>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <Button
                      disabled={currentIndex === 0}
                      onClick={goBack}
                      variant={currentIndex === 0 ? "secondary" : "default"}
                    >
                      <ArrowLeftIcon className="size-4" />
                      Back
                    </Button>

                    <Button
                      disabled={currentIndex === steps.length - 1}
                      onClick={goNext}
                      variant={
                        currentIndex === steps.length - 1
                          ? "secondary"
                          : "default"
                      }
                    >
                      Next
                      <ArrowRightIcon className="size-4" />
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
};

export default StepperVerticalDemo;
