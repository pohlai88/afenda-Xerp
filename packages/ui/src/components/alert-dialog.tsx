"use client";

import * as React from "react";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";

import { Button } from "#/components/button";
import { cn } from "#/lib/utils";
import type { GovernedButtonProps, SlotRole } from "@/governance";
import { createGovernedDivSlot } from "#/governance/create-governed-slot";
import { applyGovernedPresentation } from "#/governance/governed-render";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

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

interface AlertDialogContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>,
    "className"
  > {
  readonly className?: string;
  readonly size?: "default" | "sm";
}

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogContentProps
>(({ className, size = "default", ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "AlertDialog",
    recipeName: ALERT_DIALOG_RECIPE_NAME,
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

const AlertDialogMedia = React.forwardRef<HTMLDivElement, AlertDialogMediaProps>(
  ({ className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "AlertDialog",
      recipeName: ALERT_DIALOG_RECIPE_NAME,
      slotKey: "media",
      className,
    });

    return (
      <div ref={ref} {...applyGovernedPresentation(props, governed)} />
    );
  }
);

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

type AlertDialogActionProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Action
> &
  Pick<GovernedButtonProps, "intent" | "emphasis" | "size"> & {
    readonly className?: string;
  };

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  AlertDialogActionProps
>(
  (
    {
      className,
      intent = "primary",
      emphasis = "solid",
      size = "md",
      ...props
    },
    ref
  ) => (
    <Button intent={intent} emphasis={emphasis} size={size} asChild>
      <AlertDialogPrimitive.Action
        ref={ref}
        data-slot="alert-dialog-action"
        className={cn(className)}
        {...props}
      />
    </Button>
  )
);

AlertDialogAction.displayName = "AlertDialogAction";

type AlertDialogCancelProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Cancel
> &
  Pick<GovernedButtonProps, "intent" | "emphasis" | "size"> & {
    readonly className?: string;
  };

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  AlertDialogCancelProps
>(
  (
    {
      className,
      intent = "primary",
      emphasis = "outline",
      size = "md",
      ...props
    },
    ref
  ) => (
    <Button intent={intent} emphasis={emphasis} size={size} asChild>
      <AlertDialogPrimitive.Cancel
        ref={ref}
        data-slot="alert-dialog-cancel"
        className={cn(className)}
        {...props}
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
