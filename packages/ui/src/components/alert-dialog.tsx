"use client";

import type {
  GovernedAlertDialogProps,
  GovernedButtonProps,
  SlotRole,
} from "@afenda/ui/governance";
import { createGovernedDivSlot } from "@afenda/ui/governance/create-governed-slot";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import * as React from "react";
import { Button } from "./button";

const ALERT_DIALOG_RECIPE_NAME = "surface" as const;

const ALERT_DIALOG_SLOT_ROLES = {
  header: "header",
  footer: "footer",
  title: "label",
  description: "state",
} as const satisfies Record<string, SlotRole>;

function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  );
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  );
}

interface AlertDialogOverlayProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>,
    "className"
  > {
  readonly className?: string;
}

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  AlertDialogOverlayProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "AlertDialog",
    recipeName: ALERT_DIALOG_RECIPE_NAME,
    slot: "body",
    className,
  });

  return (
    <AlertDialogPrimitive.Overlay
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

AlertDialogOverlay.displayName = "AlertDialogOverlay";

export interface AlertDialogContentProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>,
      "className"
    >,
    GovernedAlertDialogProps {
  readonly className?: string;
}

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogContentProps
>(({ className, size = "default", state, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "AlertDialog",
    recipeName: ALERT_DIALOG_RECIPE_NAME,
    state,
    slot: "root",
    className,
  });

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        {...applyGovernedPresentation(props, governed, { "data-size": size })}
      />
    </AlertDialogPortal>
  );
});

AlertDialogContent.displayName = "AlertDialogContent";

const AlertDialogHeader = createGovernedDivSlot("AlertDialogHeader", {
  componentName: "AlertDialog",
  recipeName: ALERT_DIALOG_RECIPE_NAME,
  slot: ALERT_DIALOG_SLOT_ROLES.header,
});

const AlertDialogFooter = createGovernedDivSlot("AlertDialogFooter", {
  componentName: "AlertDialog",
  recipeName: ALERT_DIALOG_RECIPE_NAME,
  slot: ALERT_DIALOG_SLOT_ROLES.footer,
});

interface AlertDialogMediaProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

const AlertDialogMedia = React.forwardRef<
  HTMLDivElement,
  AlertDialogMediaProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "AlertDialog",
    recipeName: ALERT_DIALOG_RECIPE_NAME,
    slotKey: "media",
    className,
  });

  return <div ref={ref} {...applyGovernedPresentation(props, governed)} />;
});

AlertDialogMedia.displayName = "AlertDialogMedia";

interface AlertDialogTitleProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>,
    "className"
  > {
  readonly className?: string;
}

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  AlertDialogTitleProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "AlertDialog",
    recipeName: ALERT_DIALOG_RECIPE_NAME,
    slot: ALERT_DIALOG_SLOT_ROLES.title,
    className,
  });

  return (
    <AlertDialogPrimitive.Title
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

AlertDialogTitle.displayName = "AlertDialogTitle";

interface AlertDialogDescriptionProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>,
    "className"
  > {
  readonly className?: string;
}

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  AlertDialogDescriptionProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "AlertDialog",
    recipeName: ALERT_DIALOG_RECIPE_NAME,
    slot: ALERT_DIALOG_SLOT_ROLES.description,
    className,
  });

  return (
    <AlertDialogPrimitive.Description
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

AlertDialogDescription.displayName = "AlertDialogDescription";

type AlertDialogActionProps = Omit<
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>,
  "className"
> &
  Pick<GovernedButtonProps, "intent" | "emphasis" | "size">;

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  AlertDialogActionProps
>(
  (
    { intent = "primary", emphasis = "solid", size = "md", ...props },
    ref
  ) => (
    <Button asChild emphasis={emphasis} intent={intent} size={size}>
      <AlertDialogPrimitive.Action
        ref={ref}
        {...props}
        data-slot="alert-dialog-action"
      />
    </Button>
  )
);

AlertDialogAction.displayName = "AlertDialogAction";

type AlertDialogCancelProps = Omit<
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>,
  "className"
> &
  Pick<GovernedButtonProps, "intent" | "emphasis" | "size">;

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  AlertDialogCancelProps
>(
  (
    { intent = "primary", emphasis = "outline", size = "md", ...props },
    ref
  ) => (
    <Button asChild emphasis={emphasis} intent={intent} size={size}>
      <AlertDialogPrimitive.Cancel
        ref={ref}
        {...props}
        data-slot="alert-dialog-cancel"
      />
    </Button>
  )
);

AlertDialogCancel.displayName = "AlertDialogCancel";

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
