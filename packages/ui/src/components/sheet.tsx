"use client";

import type {
  GovernedSheetProps,
  GovernedSurfaceProps,
  SlotRole,
} from "@afenda/ui/governance";
import { createGovernedDivSlot } from "@afenda/ui/governance/create-governed-slot";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { XIcon } from "lucide-react";
import { Dialog as SheetPrimitive } from "radix-ui";
import * as React from "react";
import { Button } from "./button";

const SHEET_RECIPE_NAME = "surface" as const;

const SHEET_SLOT_ROLES = {
  header: "header",
  footer: "footer",
  title: "label",
  description: "state",
} as const satisfies Record<string, SlotRole>;

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

Sheet.displayName = "Sheet";

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

SheetTrigger.displayName = "SheetTrigger";

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

SheetClose.displayName = "SheetClose";

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

SheetPortal.displayName = "SheetPortal";

export interface SheetOverlayProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>,
    "className"
  > {
  readonly className?: string;
}

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  SheetOverlayProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Sheet",
    recipeName: SHEET_RECIPE_NAME,
    slot: "body",
    className,
  });

  return (
    <SheetPrimitive.Overlay
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

SheetOverlay.displayName = "SheetOverlay";

export interface SheetContentProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
      "className"
    >,
    GovernedSurfaceProps,
    GovernedSheetProps {
  readonly className?: string;
  readonly showCloseButton?: boolean;
  readonly side?: "top" | "right" | "bottom" | "left";
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(
  (
    {
      className,
      children,
      side = "right",
      showCloseButton = true,
      density = "standard",
      radius = "md",
      shadow = "overlay",
      state,
      ...props
    },
    ref
  ) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Sheet",
      recipeName: SHEET_RECIPE_NAME,
      variant: { density, radius, shadow },
      state,
      slot: "root",
      className,
    });

    const closeButton = resolvePrimitiveGovernance({
      componentName: "Sheet",
      recipeName: SHEET_RECIPE_NAME,
      slotKey: "close-button",
    });

    const closeLabel = resolvePrimitiveGovernance({
      componentName: "Sheet",
      recipeName: SHEET_RECIPE_NAME,
      slotKey: "close-label",
    });

    return (
      <SheetPortal>
        <SheetOverlay />
        <SheetPrimitive.Content
          ref={ref}
          {...applyGovernedPresentation(props, governed, { "data-side": side })}
        >
          {children}
          {showCloseButton ? (
            <div {...applyGovernedPresentation({}, closeButton)}>
              <SheetPrimitive.Close asChild>
                <Button
                  emphasis="ghost"
                  intent="quiet"
                  presentation="icon"
                  size="sm"
                >
                  <XIcon aria-hidden="true" />
                  <span {...applyGovernedPresentation({}, closeLabel)}>
                    Close
                  </span>
                </Button>
              </SheetPrimitive.Close>
            </div>
          ) : null}
        </SheetPrimitive.Content>
      </SheetPortal>
    );
  }
);

SheetContent.displayName = "SheetContent";

const SheetHeader = createGovernedDivSlot("SheetHeader", {
  componentName: "Sheet",
  recipeName: SHEET_RECIPE_NAME,
  slot: SHEET_SLOT_ROLES.header,
});

const SheetFooter = createGovernedDivSlot("SheetFooter", {
  componentName: "Sheet",
  recipeName: SHEET_RECIPE_NAME,
  slot: SHEET_SLOT_ROLES.footer,
});

export interface SheetTitleProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>,
    "className"
  > {
  readonly className?: string;
}

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  SheetTitleProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Sheet",
    recipeName: SHEET_RECIPE_NAME,
    slot: SHEET_SLOT_ROLES.title,
    className,
  });

  return (
    <SheetPrimitive.Title
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

SheetTitle.displayName = "SheetTitle";

export interface SheetDescriptionProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>,
    "className"
  > {
  readonly className?: string;
}

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  SheetDescriptionProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Sheet",
    recipeName: SHEET_RECIPE_NAME,
    slot: SHEET_SLOT_ROLES.description,
    className,
  });

  return (
    <SheetPrimitive.Description
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

SheetDescription.displayName = "SheetDescription";

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
