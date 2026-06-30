"use client";

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import type * as React from "react";

import { Button } from "@/components/ui/button";
import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/lib/utils";

import {
  ALERT_DIALOG_SLOTS,
  alertDialogActionClassName,
  alertDialogCancelClassName,
  alertDialogContentClassName,
  alertDialogDescriptionClassName,
  alertDialogFooterClassName,
  alertDialogHeaderClassName,
  alertDialogMediaClassName,
  alertDialogOverlayClassName,
  alertDialogTitleClassName,
  alertDialogViewportClassName,
} from "./alert-dialog.contract.js";

type AlertDialogProps =
  WithoutGovernedDataSlot<AlertDialogPrimitive.Root.Props>;
type AlertDialogTriggerProps =
  WithoutGovernedDataSlot<AlertDialogPrimitive.Trigger.Props>;
type AlertDialogOverlayProps =
  WithoutGovernedDataSlot<AlertDialogPrimitive.Backdrop.Props>;
type AlertDialogContentProps =
  WithoutGovernedDataSlot<AlertDialogPrimitive.Popup.Props> & {
    size?: "default" | "sm";
  };
type AlertDialogHeaderProps = WithoutGovernedDataSlot<
  React.ComponentProps<"div">
>;
type AlertDialogFooterProps = WithoutGovernedDataSlot<
  React.ComponentProps<"div">
>;
type AlertDialogMediaProps = WithoutGovernedDataSlot<
  React.ComponentProps<"div">
>;
type AlertDialogTitleProps = WithoutGovernedDataSlot<
  React.ComponentProps<typeof AlertDialogPrimitive.Title>
>;
type AlertDialogDescriptionProps = WithoutGovernedDataSlot<
  React.ComponentProps<typeof AlertDialogPrimitive.Description>
>;
type AlertDialogActionProps = WithoutGovernedDataSlot<
  React.ComponentProps<typeof Button>
>;
type AlertDialogCancelProps = WithoutGovernedDataSlot<
  AlertDialogPrimitive.Close.Props &
    Pick<React.ComponentProps<typeof Button>, "variant" | "size">
>;

function AlertDialog({ ...props }: AlertDialogProps) {
  return (
    <AlertDialogPrimitive.Root {...props} data-slot={ALERT_DIALOG_SLOTS.root} />
  );
}

function AlertDialogTrigger({ ...props }: AlertDialogTriggerProps) {
  return (
    <AlertDialogPrimitive.Trigger
      {...props}
      data-slot={ALERT_DIALOG_SLOTS.trigger}
    />
  );
}

function AlertDialogPortal({ ...props }: AlertDialogPrimitive.Portal.Props) {
  return (
    <AlertDialogPrimitive.Portal
      {...props}
      data-slot={ALERT_DIALOG_SLOTS.portal}
    />
  );
}

function AlertDialogOverlay({ className, ...props }: AlertDialogOverlayProps) {
  return (
    <AlertDialogPrimitive.Backdrop
      {...props}
      className={cn(alertDialogOverlayClassName, className)}
      data-slot={ALERT_DIALOG_SLOTS.overlay}
    />
  );
}

function AlertDialogContent({
  className,
  size = "default",
  children,
  ...props
}: AlertDialogContentProps) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <div
        className={alertDialogViewportClassName}
        data-slot={ALERT_DIALOG_SLOTS.viewport}
      >
        <AlertDialogPrimitive.Popup
          {...props}
          className={cn(alertDialogContentClassName, className)}
          data-size={size}
          data-slot={ALERT_DIALOG_SLOTS.content}
        >
          {children}
        </AlertDialogPrimitive.Popup>
      </div>
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }: AlertDialogHeaderProps) {
  return (
    <div
      {...props}
      className={cn(alertDialogHeaderClassName, className)}
      data-slot={ALERT_DIALOG_SLOTS.header}
    />
  );
}

function AlertDialogFooter({ className, ...props }: AlertDialogFooterProps) {
  return (
    <div
      {...props}
      className={cn(alertDialogFooterClassName, className)}
      data-slot={ALERT_DIALOG_SLOTS.footer}
    />
  );
}

function AlertDialogMedia({ className, ...props }: AlertDialogMediaProps) {
  return (
    <div
      {...props}
      className={cn(alertDialogMediaClassName, className)}
      data-slot={ALERT_DIALOG_SLOTS.media}
    />
  );
}

function AlertDialogTitle({ className, ...props }: AlertDialogTitleProps) {
  return (
    <AlertDialogPrimitive.Title
      {...props}
      className={cn(alertDialogTitleClassName, className)}
      data-slot={ALERT_DIALOG_SLOTS.title}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: AlertDialogDescriptionProps) {
  return (
    <AlertDialogPrimitive.Description
      {...props}
      className={cn(alertDialogDescriptionClassName, className)}
      data-slot={ALERT_DIALOG_SLOTS.description}
    />
  );
}

function AlertDialogAction({ className, ...props }: AlertDialogActionProps) {
  return (
    <AlertDialogPrimitive.Close
      {...props}
      className={cn(alertDialogActionClassName, className)}
      data-slot={ALERT_DIALOG_SLOTS.action}
      render={<Button />}
    />
  );
}

function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}: AlertDialogCancelProps) {
  return (
    <AlertDialogPrimitive.Close
      {...props}
      className={cn(alertDialogCancelClassName, className)}
      data-slot={ALERT_DIALOG_SLOTS.cancel}
      render={<Button size={size} variant={variant} />}
    />
  );
}

export type { AlertDialogSlot } from "./alert-dialog.contract.js";
export type {
  AlertDialogActionProps,
  AlertDialogCancelProps,
  AlertDialogContentProps,
  AlertDialogDescriptionProps,
  AlertDialogFooterProps,
  AlertDialogHeaderProps,
  AlertDialogMediaProps,
  AlertDialogOverlayProps,
  AlertDialogProps,
  AlertDialogTitleProps,
  AlertDialogTriggerProps,
};
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
