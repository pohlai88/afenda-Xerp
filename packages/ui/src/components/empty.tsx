import * as React from "react";

import type { GovernedEmptyMediaVariant } from "@/governance";
import { applyGovernedPresentation } from "#/governance/governed-render";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

const EMPTY_RECIPE_NAME = "surface" as const;

export interface EmptyProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  ({ className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Empty",
      recipeName: EMPTY_RECIPE_NAME,
      slot: "root",
      className,
    });

    return (
      <div ref={ref} {...applyGovernedPresentation(props, governed)} />
    );
  }
);

Empty.displayName = "Empty";

interface EmptyHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

const EmptyHeader = React.forwardRef<HTMLDivElement, EmptyHeaderProps>(
  ({ className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Empty",
      recipeName: EMPTY_RECIPE_NAME,
      slot: "header",
      className,
    });

    return (
      <div ref={ref} {...applyGovernedPresentation(props, governed)} />
    );
  }
);

EmptyHeader.displayName = "EmptyHeader";

export interface EmptyMediaProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly variant?: GovernedEmptyMediaVariant;
  readonly className?: string;
}

const EmptyMedia = React.forwardRef<HTMLDivElement, EmptyMediaProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Empty",
      recipeName: EMPTY_RECIPE_NAME,
      slot: "icon",
      emptyMediaVariant: variant,
      className,
    });

    return (
      <div
        ref={ref}
        {...applyGovernedPresentation(props, governed, { "data-variant": variant })}
      />
    );
  }
);

EmptyMedia.displayName = "EmptyMedia";

interface EmptyTitleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

const EmptyTitle = React.forwardRef<HTMLDivElement, EmptyTitleProps>(
  ({ className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Empty",
      recipeName: EMPTY_RECIPE_NAME,
      slot: "label",
      className,
    });

    return (
      <div ref={ref} {...applyGovernedPresentation(props, governed)} />
    );
  }
);

EmptyTitle.displayName = "EmptyTitle";

interface EmptyDescriptionProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "className"> {
  readonly className?: string;
}

const EmptyDescription = React.forwardRef<HTMLParagraphElement, EmptyDescriptionProps>(
  ({ className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Empty",
      recipeName: EMPTY_RECIPE_NAME,
      slot: "body",
      className,
    });

    return (
      <p ref={ref} {...applyGovernedPresentation(props, governed)} />
    );
  }
);

EmptyDescription.displayName = "EmptyDescription";

interface EmptyContentProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

const EmptyContent = React.forwardRef<HTMLDivElement, EmptyContentProps>(
  ({ className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Empty",
      recipeName: EMPTY_RECIPE_NAME,
      slot: "content",
      className,
    });

    return (
      <div ref={ref} {...applyGovernedPresentation(props, governed)} />
    );
  }
);

EmptyContent.displayName = "EmptyContent";

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
};
