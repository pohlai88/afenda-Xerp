"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import type * as React from "react";

import { Button } from "@/components/ui/button";
import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/utils/utils";

import {
  DIALOG_SLOTS,
  dialogCloseButtonClassName,
  dialogContentClassName,
  dialogDescriptionClassName,
  dialogFooterClassName,
  dialogHeaderClassName,
  dialogOverlayClassName,
  dialogTitleClassName,
  dialogViewportClassName,
} from "./dialog.contract.js";

type DialogProps = WithoutGovernedDataSlot<DialogPrimitive.Root.Props>;
type DialogTriggerProps =
  WithoutGovernedDataSlot<DialogPrimitive.Trigger.Props>;
type DialogPortalProps = WithoutGovernedDataSlot<DialogPrimitive.Portal.Props>;
type DialogCloseProps = WithoutGovernedDataSlot<DialogPrimitive.Close.Props>;
type DialogOverlayProps =
  WithoutGovernedDataSlot<DialogPrimitive.Backdrop.Props>;
type DialogViewportProps = WithoutGovernedDataSlot<React.ComponentProps<"div">>;
type DialogContentProps =
  WithoutGovernedDataSlot<DialogPrimitive.Popup.Props> & {
    showCloseButton?: boolean;
  };
type DialogHeaderProps = WithoutGovernedDataSlot<React.ComponentProps<"div">>;
type DialogFooterProps = WithoutGovernedDataSlot<
  React.ComponentProps<"div">
> & {
  showCloseButton?: boolean;
};
type DialogTitleProps = WithoutGovernedDataSlot<DialogPrimitive.Title.Props>;
type DialogDescriptionProps =
  WithoutGovernedDataSlot<DialogPrimitive.Description.Props>;

function Dialog({ ...props }: DialogProps) {
  return <DialogPrimitive.Root {...props} data-slot={DIALOG_SLOTS.root} />;
}

function DialogTrigger({ ...props }: DialogTriggerProps) {
  return (
    <DialogPrimitive.Trigger {...props} data-slot={DIALOG_SLOTS.trigger} />
  );
}

function DialogPortal({ ...props }: DialogPortalProps) {
  return <DialogPrimitive.Portal {...props} data-slot={DIALOG_SLOTS.portal} />;
}

function DialogClose({ ...props }: DialogCloseProps) {
  return <DialogPrimitive.Close {...props} data-slot={DIALOG_SLOTS.close} />;
}

function DialogOverlay({ className, ...props }: DialogOverlayProps) {
  return (
    <DialogPrimitive.Backdrop
      {...props}
      className={cn(dialogOverlayClassName, className)}
      data-slot={DIALOG_SLOTS.overlay}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <div
        className={dialogViewportClassName}
        data-slot={DIALOG_SLOTS.viewport}
      >
        <DialogPrimitive.Popup
          {...props}
          className={cn(dialogContentClassName, className)}
          data-slot={DIALOG_SLOTS.content}
        >
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close
              data-slot={DIALOG_SLOTS.close}
              render={
                <Button
                  className={dialogCloseButtonClassName}
                  size="icon-sm"
                  variant="ghost"
                />
              }
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Popup>
      </div>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return (
    <div
      {...props}
      className={cn(dialogHeaderClassName, className)}
      data-slot={DIALOG_SLOTS.header}
    />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: DialogFooterProps) {
  return (
    <div
      {...props}
      className={cn(dialogFooterClassName, className)}
      data-slot={DIALOG_SLOTS.footer}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      {...props}
      className={cn(dialogTitleClassName, className)}
      data-slot={DIALOG_SLOTS.title}
    />
  );
}

function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      {...props}
      className={cn(dialogDescriptionClassName, className)}
      data-slot={DIALOG_SLOTS.description}
    />
  );
}

export type { DialogSlot } from "./dialog.contract.js";
export type {
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogOverlayProps,
  DialogPortalProps,
  DialogProps,
  DialogTitleProps,
  DialogTriggerProps,
  DialogViewportProps,
};
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
