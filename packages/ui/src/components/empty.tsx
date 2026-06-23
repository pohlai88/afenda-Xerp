import type {
  GovernedEmptyMediaVariant,
  GovernedEmptyProps,
  SlotRole,
} from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import * as React from "react";

const EMPTY_RECIPE_NAME = "surface" as const;

const EMPTY_SLOT_ROLES = {
  root: "root",
  header: "header",
  icon: "icon",
  title: "label",
  description: "body",
  content: "content",
} as const satisfies Record<
  "root" | "header" | "icon" | "title" | "description" | "content",
  SlotRole
>;

export interface EmptyProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className">,
    GovernedEmptyProps {
  readonly className?: string;
}

const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  ({ className, role = "status", state, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Empty",
      recipeName: EMPTY_RECIPE_NAME,
      slot: EMPTY_SLOT_ROLES.root,
      state,
      className,
    });

    return (
      <div ref={ref} {...applyGovernedPresentation({ ...props, role }, governed)} />
    );
  }
);

Empty.displayName = "Empty";

interface EmptySlotProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

function createEmptySlot(
  displayName: string,
  slotKey: Exclude<keyof typeof EMPTY_SLOT_ROLES, "root" | "icon">
) {
  const slot = EMPTY_SLOT_ROLES[slotKey];

  const EmptySlot = React.forwardRef<HTMLDivElement, EmptySlotProps>(
    ({ className, ...props }, ref) => {
      const governed = resolvePrimitiveGovernance({
        componentName: "Empty",
        recipeName: EMPTY_RECIPE_NAME,
        slot,
        className,
      });

      return <div ref={ref} {...applyGovernedPresentation(props, governed)} />;
    }
  );

  EmptySlot.displayName = displayName;

  return EmptySlot;
}

export interface EmptyMediaProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
  readonly variant?: GovernedEmptyMediaVariant;
}

const EmptyMedia = React.forwardRef<HTMLDivElement, EmptyMediaProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Empty",
      recipeName: EMPTY_RECIPE_NAME,
      slot: EMPTY_SLOT_ROLES.icon,
      emptyMediaVariant: variant,
      className,
    });

    return (
      <div
        ref={ref}
        {...applyGovernedPresentation(props, governed, {
          "data-variant": variant,
        })}
      />
    );
  }
);

EmptyMedia.displayName = "EmptyMedia";

interface EmptyDescriptionProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "className"> {
  readonly className?: string;
}

const EmptyDescription = React.forwardRef<
  HTMLParagraphElement,
  EmptyDescriptionProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Empty",
    recipeName: EMPTY_RECIPE_NAME,
    slot: EMPTY_SLOT_ROLES.description,
    className,
  });

  return <p ref={ref} {...applyGovernedPresentation(props, governed)} />;
});

EmptyDescription.displayName = "EmptyDescription";

const EmptyHeader = createEmptySlot("EmptyHeader", "header");
const EmptyTitle = createEmptySlot("EmptyTitle", "title");
const EmptyContent = createEmptySlot("EmptyContent", "content");

export type EmptyHeaderProps = EmptySlotProps;
export type EmptyTitleProps = EmptySlotProps;
export type EmptyContentProps = EmptySlotProps;

export {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
};
