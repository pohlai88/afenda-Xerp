"use client";

import type {
  GovernedDialogProps,
  GovernedSurfaceProps,
  SlotRole,
} from "@afenda/ui/governance";
import { createGovernedDivSlot } from "@afenda/ui/governance/create-governed-slot";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { XIcon } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import * as React from "react";
import { Button } from "./button";

const DIALOG_RECIPE_NAME = "surface" as const;

const DIALOG_SLOT_ROLES = {
  header: "header",
  footer: "footer",
  title: "label",
  description: "state",
} as const satisfies Record<string, SlotRole>;

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

Dialog.displayName = "Dialog";

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

DialogTrigger.displayName = "DialogTrigger";

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

DialogPortal.displayName = "DialogPortal";

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

DialogClose.displayName = "DialogClose";

interface DialogOverlayProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>,
    "className"
  > {
  readonly className?: string;
}

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Dialog",
    recipeName: DIALOG_RECIPE_NAME,
    slot: "body",
    className,
  });

  return (
    <DialogPrimitive.Overlay
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

DialogOverlay.displayName = "DialogOverlay";

export interface DialogContentProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
      "className"
    >,
    GovernedSurfaceProps,
    GovernedDialogProps {
  readonly className?: string;
  readonly showCloseButton?: boolean;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      className,
      children,
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
      componentName: "Dialog",
      recipeName: DIALOG_RECIPE_NAME,
      variant: { density, radius, shadow },
      state,
      slot: "root",
      className,
    });

    const closeButton = resolvePrimitiveGovernance({
      componentName: "Dialog",
      recipeName: DIALOG_RECIPE_NAME,
      slotKey: "close-button",
    });

    const closeLabel = resolvePrimitiveGovernance({
      componentName: "Dialog",
      recipeName: DIALOG_RECIPE_NAME,
      slotKey: "close-label",
    });

    return (
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          ref={ref}
          {...applyGovernedPresentation(props, governed)}
        >
          {children}
          {showCloseButton ? (
            <div {...applyGovernedPresentation({}, closeButton)}>
              <DialogPrimitive.Close asChild>
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
              </DialogPrimitive.Close>
            </div>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPortal>
    );
  }
);

DialogContent.displayName = "DialogContent";

const DialogHeader = createGovernedDivSlot("DialogHeader", {
  componentName: "Dialog",
  recipeName: DIALOG_RECIPE_NAME,
  slot: DIALOG_SLOT_ROLES.header,
});

interface DialogFooterProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
  readonly showCloseButton?: boolean;
}

const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, showCloseButton = false, children, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Dialog",
      recipeName: DIALOG_RECIPE_NAME,
      slot: DIALOG_SLOT_ROLES.footer,
      className,
    });

    return (
      <div ref={ref} {...applyGovernedPresentation(props, governed)}>
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close asChild>
            <Button emphasis="outline" intent="primary" size="md">
              Close
            </Button>
          </DialogPrimitive.Close>
        ) : null}
      </div>
    );
  }
);

DialogFooter.displayName = "DialogFooter";

interface DialogTitleProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>,
    "className"
  > {
  readonly className?: string;
}

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Dialog",
    recipeName: DIALOG_RECIPE_NAME,
    slot: DIALOG_SLOT_ROLES.title,
    className,
  });

  return (
    <DialogPrimitive.Title
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

DialogTitle.displayName = "DialogTitle";

interface DialogDescriptionProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>,
    "className"
  > {
  readonly className?: string;
}

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Dialog",
    recipeName: DIALOG_RECIPE_NAME,
    slot: DIALOG_SLOT_ROLES.description,
    className,
  });

  return (
    <DialogPrimitive.Description
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
