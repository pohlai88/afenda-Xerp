"use client";

import type * as React from "react";
import type { HTMLAttributes } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import * as Stepperize from "@stepperize/react";
import type { Step, Stepper as StepperInstance } from "@stepperize/react";

import { cn } from "#/lib/utils";

type StepperOrientation = "horizontal" | "vertical";
type StepState = "active" | "completed" | "inactive" | "loading";
type StepIndicators = {
  active?: React.ReactNode;
  completed?: React.ReactNode;
  inactive?: React.ReactNode;
  loading?: React.ReactNode;
};

type StepDefinition = {
  id: string;
  title?: string;
  description?: string;
  icon?: React.ReactElement;
};

interface StepperContextValue {
  configOrientation: StepperOrientation;
  focusFirst: () => void;
  focusLast: () => void;
  focusNext: (currentIdx: number) => void;
  focusPrev: (currentIdx: number) => void;
  indicators: StepIndicators;
  orientation: StepperOrientation;
  registerTrigger: (node: HTMLButtonElement | null, remove?: boolean) => void;
  responsive?: boolean;
  stepper: StepperInstance<readonly Step[]>;
  steps: StepDefinition[];
  triggerNodes: HTMLButtonElement[];
}

interface StepItemContextValue {
  index: number;
  isDisabled: boolean;
  isLoading: boolean;
  state: StepState;
  step: StepDefinition;
}

const StepperContext = createContext<StepperContextValue | undefined>(
  undefined
);

const StepItemContext = createContext<StepItemContextValue | undefined>(
  undefined
);

function useStepper() {
  const ctx = useContext(StepperContext);

  if (!ctx) {
    throw new Error("useStepper must be used within a Stepper");
  }

  return ctx;
}

function useStepItem() {
  const ctx = useContext(StepItemContext);

  if (!ctx) {
    throw new Error("useStepItem must be used within a StepperItem");
  }

  return ctx;
}

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  indicators?: StepIndicators;
  onValueChange?: (value: string) => void;
  orientation?: StepperOrientation;
  responsive?: boolean;
  steps: StepDefinition[];
  value?: string;
}

function Stepper({
  steps,
  defaultValue,
  orientation = "horizontal",
  responsive = false,
  className,
  children,
  indicators = {},
  value,
  onValueChange,
  ...props
}: StepperProps) {
  const stepperSteps = useMemo(
    () =>
      steps.map((step) => ({
        id: step.id,
        title: step.title,
        description: step.description,
      })),
    [steps]
  );

  const stepperDefinition = useMemo(
    () =>
      Stepperize.defineStepper(
        stepperSteps as unknown as [{ id: string }, ...{ id: string }[]]
      ),
    [stepperSteps]
  );

  const resolvedDefaultStep = defaultValue ?? steps[0]?.id;

  const stepper = stepperDefinition.useStepper({
    ...(resolvedDefaultStep === undefined
      ? {}
      : { defaultStep: resolvedDefaultStep }),
    ...(value === undefined ? {} : { step: value }),
    onStepChange: (stepId) => {
      onValueChange?.(stepId);
    },
  });

  const [triggerNodes, setTriggerNodes] = useState<HTMLButtonElement[]>([]);

  const [isMdUp, setIsMdUp] = useState<boolean>(() =>
    typeof window === "undefined"
      ? true
      : window.matchMedia("(min-width: 768px)").matches
  );

  useEffect(() => {
    if (!responsive) {
      return;
    }

    const mql = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMdUp("matches" in e ? e.matches : mql.matches);

    if ("addEventListener" in mql) {
      mql.addEventListener("change", handler);
    } else {
      // @ts-expect-error - legacy
      mql.addListener(handler);
    }

    return () => {
      if ("removeEventListener" in mql) {
        mql.removeEventListener("change", handler);
      } else {
        // @ts-expect-error - legacy
        mql.removeListener(handler);
      }
    };
  }, [responsive]);

  const registerTrigger = useCallback(
    (node: HTMLButtonElement | null, remove = false) => {
      setTriggerNodes((prev) => {
        if (!node) {
          return prev;
        }

        if (remove) {
          return prev.filter((n) => n !== node);
        }

        return prev.includes(node) ? prev : [...prev, node];
      });
    },
    []
  );

  const focusNext = useCallback(
    (currentIdx: number) =>
      triggerNodes[(currentIdx + 1) % triggerNodes.length]?.focus(),
    [triggerNodes]
  );

  const focusPrev = useCallback(
    (currentIdx: number) =>
      triggerNodes[
        (currentIdx - 1 + triggerNodes.length) % triggerNodes.length
      ]?.focus(),
    [triggerNodes]
  );

  const focusFirst = useCallback(
    () => triggerNodes[0]?.focus(),
    [triggerNodes]
  );

  const focusLast = useCallback(
    () => triggerNodes.at(-1)?.focus(),
    [triggerNodes]
  );

  const effectiveOrientation: StepperOrientation = useMemo(() => {
    if (responsive && orientation === "horizontal") {
      return isMdUp ? "horizontal" : "vertical";
    }

    return orientation;
  }, [responsive, orientation, isMdUp]);

  const contextValue = useMemo<StepperContextValue>(
    () => ({
      stepper,
      steps,
      orientation: effectiveOrientation,
      configOrientation: orientation,
      responsive,
      registerTrigger,
      focusNext,
      focusPrev,
      focusFirst,
      focusLast,
      triggerNodes,
      indicators,
    }),
    [
      stepper,
      steps,
      effectiveOrientation,
      orientation,
      responsive,
      registerTrigger,
      focusNext,
      focusPrev,
      focusFirst,
      focusLast,
      triggerNodes,
      indicators,
    ]
  );

  useEffect(() => {
    if (typeof value === "string" && value !== stepper.id) {
      void stepper.goTo(value as Step["id"]);
    }
  }, [value, stepper]);

  return (
    <StepperContext.Provider value={contextValue}>
      <div
        aria-orientation={effectiveOrientation}
        className={cn("w-full", className)}
        data-orientation={effectiveOrientation}
        data-slot="stepper"
        role="tablist"
        {...props}
      >
        {children}
      </div>
    </StepperContext.Provider>
  );
}

interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  completed?: boolean;
  disabled?: boolean;
  loading?: boolean;
  stepId: string;
}

function StepperItem({
  stepId,
  completed = false,
  disabled = false,
  loading = false,
  className,
  children,
  ...props
}: StepperItemProps) {
  const { stepper, steps } = useStepper();
  const stepIndex = stepper.steps.findIndex(
    (candidate: { id: string }) => candidate.id === stepId
  );
  const currentIndex = stepper.index;
  const step = steps.find((s) => s.id === stepId)!;

  const state: StepState =
    completed || stepIndex < currentIndex
      ? "completed"
      : currentIndex === stepIndex
        ? "active"
        : "inactive";

  const isLoading = loading && currentIndex === stepIndex;

  return (
    <StepItemContext.Provider
      value={{ step, index: stepIndex, state, isDisabled: disabled, isLoading }}
    >
      <div
        className={cn(
          "group/step flex not-last:flex-1 items-center justify-center group-data-[orientation=horizontal]/stepper-nav:flex-row group-data-[orientation=vertical]/stepper-nav:flex-col",
          className
        )}
        data-slot="stepper-item"
        data-state={state}
        {...(isLoading ? { "data-loading": true } : {})}
        {...props}
      >
        {children}
      </div>
    </StepItemContext.Provider>
  );
}

interface StepperTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

function StepperTrigger({
  asChild = false,
  className,
  children,
  tabIndex,
  ...props
}: StepperTriggerProps) {
  const { state, isLoading } = useStepItem();
  const {
    stepper,
    registerTrigger,
    triggerNodes,
    focusNext,
    focusPrev,
    focusFirst,
    focusLast,
  } = useStepper();

  const { step, isDisabled } = useStepItem();
  const isSelected = stepper.id === step.id;
  const id = `stepper-tab-${step.id}`;
  const panelId = `stepper-panel-${step.id}`;

  const btnRef = useRef<HTMLButtonElement | null>(null);

  const triggerRef = useCallback(
    (node: HTMLButtonElement | null) => {
      if (node) {
        btnRef.current = node;
        registerTrigger(node);
      } else if (btnRef.current) {
        registerTrigger(btnRef.current, true);
        btnRef.current = null;
      }
    },
    [registerTrigger]
  );

  const myIdx = useMemo(
    () =>
      triggerNodes.findIndex((n: HTMLButtonElement) => n === btnRef.current),
    [triggerNodes]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        if (myIdx !== -1) {
          focusNext(myIdx);
        }
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        if (myIdx !== -1) {
          focusPrev(myIdx);
        }
        break;
      case "Home":
        e.preventDefault();
        focusFirst();
        break;
      case "End":
        e.preventDefault();
        focusLast();
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        void stepper.goTo(step.id);
        break;
      default:
        break;
    }
  };

  if (asChild) {
    return (
      <span
        className={className}
        data-slot="stepper-trigger"
        data-state={state}
      >
        {children}
      </span>
    );
  }

  return (
    <button
      aria-controls={panelId}
      aria-selected={isSelected}
      className={cn(
        "inline-flex cursor-pointer items-center outline-none disabled:pointer-events-none disabled:opacity-60",
        "gap-2.5 rounded-full",
        className
      )}
      data-loading={isLoading}
      data-slot="stepper-trigger"
      data-state={state}
      disabled={isDisabled}
      id={id}
      onClick={() => {
        void stepper.goTo(step.id);
      }}
      onKeyDown={handleKeyDown}
      ref={triggerRef}
      role="tab"
      tabIndex={typeof tabIndex === "number" ? tabIndex : isSelected ? 0 : -1}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

interface StepperIndicatorProps extends React.ComponentProps<"div"> {
  variant?: "default" | "outline";
}

function StepperIndicator({
  children,
  className,
  variant = "default",
}: StepperIndicatorProps) {
  const { state, isLoading, step } = useStepItem();
  const { indicators } = useStepper();

  const base =
    "relative flex size-8 shrink-0 items-center justify-center overflow-hidden transition-all duration-300 rounded-md text-sm font-medium tabular-nums";

  const defaultClasses = cn(
    "border-background bg-muted ring-offset-background data-[state=active]:bg-primary data-[state=completed]:bg-primary data-[state=active]:text-primary-foreground data-[state=completed]:text-primary-foreground group-data-[state=active]/step:ring-2 group-data-[state=active]/step:ring-primary/30 group-data-[state=active]/step:ring-offset-3",
    base
  );

  const outlineClasses = cn(
    "border border-primary/20 bg-transparent text-muted-foreground data-[state=active]:border-primary data-[state=completed]:border-foreground data-[state=active]:text-foreground data-[state=completed]:text-foreground",
    base
  );

  const classes = variant === "outline" ? outlineClasses : defaultClasses;

  return (
    <div
      className={cn(classes, className)}
      data-slot="stepper-indicator"
      data-state={state}
    >
      <div className="absolute">
        {(isLoading ? indicators?.loading : indicators?.[state]) ??
          (step?.icon ? (
            <span className="*:[svg]:size-4">{step.icon}</span>
          ) : (
            children
          ))}
      </div>
    </div>
  );
}

function StepperSeparator({ className }: React.ComponentProps<"div">) {
  const { state } = useStepItem();

  return (
    <div
      className={cn(
        "m-2 rounded-sm bg-muted transition-colors duration-500 group-data-[orientation=horizontal]/stepper-nav:h-0.5 group-data-[orientation=vertical]/stepper-nav:h-12 group-data-[orientation=vertical]/stepper-nav:w-0.5 group-data-[orientation=horizontal]/stepper-nav:flex-1 group-data-[state=completed]/step:bg-primary",
        className
      )}
      data-slot="stepper-separator"
      data-state={state}
    />
  );
}

function StepperTitle({ children, className }: React.ComponentProps<"h3">) {
  const { state } = useStepItem();

  return (
    <h3
      className={cn("font-medium text-sm", className)}
      data-slot="stepper-title"
      data-state={state}
    >
      {children}
    </h3>
  );
}

function StepperDescription({
  children,
  className,
}: React.ComponentProps<"div">) {
  const { state } = useStepItem();

  return (
    <div
      className={cn("font-medium text-muted-foreground text-xs", className)}
      data-slot="stepper-description"
      data-state={state}
    >
      {children}
    </div>
  );
}

function StepperNav({ children, className }: React.ComponentProps<"nav">) {
  const { stepper, orientation, configOrientation, responsive } = useStepper();

  const responsiveNavClasses =
    responsive && configOrientation === "horizontal"
      ? "flex-col md:flex-row md:w-full"
      : "";

  return (
    <nav
      className={cn(
        "group/stepper-nav inline-flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
        responsiveNavClasses,
        className
      )}
      data-orientation={orientation}
      data-slot="stepper-nav"
      data-state={stepper.id}
    >
      {children}
    </nav>
  );
}

function StepperPanel({ children, className }: React.ComponentProps<"div">) {
  const { stepper } = useStepper();

  return (
    <div
      className={cn("w-full", className)}
      data-slot="stepper-panel"
      data-state={stepper.id}
    >
      {children}
    </div>
  );
}

interface StepperContentProps extends React.ComponentProps<"div"> {
  forceMount?: boolean;
  value: string;
}

function StepperContent({
  value,
  forceMount,
  children,
  className,
}: StepperContentProps) {
  const { stepper } = useStepper();
  const isActive = value === stepper.id;

  if (!(forceMount || isActive)) {
    return null;
  }

  return (
    <div
      aria-labelledby={`stepper-tab-${value}`}
      className={cn("w-full", className, !isActive && forceMount && "hidden")}
      data-slot="stepper-content"
      data-state={stepper.id}
      hidden={!isActive && forceMount}
      id={`stepper-panel-${value}`}
      role="tabpanel"
    >
      {children}
    </div>
  );
}

export {
  useStepper,
  useStepItem,
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperSeparator,
  StepperTitle,
  StepperDescription,
  StepperPanel,
  StepperContent,
  StepperNav,
  type StepperProps,
  type StepperItemProps,
  type StepperTriggerProps,
  type StepperContentProps,
};
