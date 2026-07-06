// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import { buttonClassName } from "./Button";

export interface AlertDialogProps
  extends ComponentProps<typeof AlertDialogPrimitive.Root> {}
export interface AlertDialogTriggerProps
  extends ComponentProps<typeof AlertDialogPrimitive.Trigger> {}
export interface AlertDialogPortalProps
  extends ComponentProps<typeof AlertDialogPrimitive.Portal> {}
export interface AlertDialogActionProps
  extends ComponentProps<typeof AlertDialogPrimitive.Close> {}
export interface AlertDialogCancelProps
  extends ComponentProps<typeof AlertDialogPrimitive.Close> {}
export interface AlertDialogOverlayProps
  extends ComponentProps<typeof AlertDialogPrimitive.Backdrop> {}
export interface AlertDialogContentProps
  extends ComponentProps<typeof AlertDialogPrimitive.Popup> {}
export interface AlertDialogHeaderProps extends ComponentProps<"div"> {}
export interface AlertDialogFooterProps extends ComponentProps<"div"> {}
export interface AlertDialogTitleProps
  extends ComponentProps<typeof AlertDialogPrimitive.Title> {}
export interface AlertDialogDescriptionProps
  extends ComponentProps<typeof AlertDialogPrimitive.Description> {}

export function AlertDialog({ ...props }: AlertDialogProps) {
  return <AlertDialogPrimitive.Root {...props} data-slot="alert-dialog" />;
}

export function AlertDialogTrigger({ ...props }: AlertDialogTriggerProps) {
  return (
    <AlertDialogPrimitive.Trigger {...props} data-slot="alert-dialog-trigger" />
  );
}

export function AlertDialogPortal({ ...props }: AlertDialogPortalProps) {
  return (
    <AlertDialogPrimitive.Portal {...props} data-slot="alert-dialog-portal" />
  );
}

export function AlertDialogOverlay({
  className,
  ...props
}: AlertDialogOverlayProps) {
  return (
    <AlertDialogPrimitive.Backdrop
      {...props}
      className={cn(
        "fixed inset-0 z-50 bg-black/50",
        typeof className === "string" ? className : undefined
      )}
      data-slot="alert-dialog-overlay"
    />
  );
}

export function AlertDialogContent({
  className,
  ...props
}: AlertDialogContentProps) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <AlertDialogPrimitive.Popup
          {...props}
          className={cn(
            "grid w-full max-w-lg gap-4 rounded-lg border border-border bg-background p-6 shadow-lg",
            typeof className === "string" ? className : undefined
          )}
          data-slot="alert-dialog-content"
        />
      </div>
    </AlertDialogPortal>
  );
}

export function AlertDialogHeader({
  className,
  ...props
}: AlertDialogHeaderProps) {
  return (
    <div
      {...props}
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      data-slot="alert-dialog-header"
    />
  );
}

export function AlertDialogFooter({
  className,
  ...props
}: AlertDialogFooterProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      data-slot="alert-dialog-footer"
    />
  );
}

export function AlertDialogTitle({
  className,
  ...props
}: AlertDialogTitleProps) {
  return (
    <AlertDialogPrimitive.Title
      {...props}
      className={cn(
        "font-semibold text-lg",
        typeof className === "string" ? className : undefined
      )}
      data-slot="alert-dialog-title"
    />
  );
}

export function AlertDialogDescription({
  className,
  ...props
}: AlertDialogDescriptionProps) {
  return (
    <AlertDialogPrimitive.Description
      {...props}
      className={cn(
        "text-muted-foreground text-sm",
        typeof className === "string" ? className : undefined
      )}
      data-slot="alert-dialog-description"
    />
  );
}

export function AlertDialogAction({
  className,
  ...props
}: AlertDialogActionProps) {
  return (
    <AlertDialogPrimitive.Close
      {...props}
      className={buttonClassName({
        className: typeof className === "string" ? className : undefined,
      })}
      data-slot="alert-dialog-action"
    />
  );
}

export function AlertDialogCancel({
  className,
  ...props
}: AlertDialogCancelProps) {
  return (
    <AlertDialogPrimitive.Close
      {...props}
      className={buttonClassName({
        className: typeof className === "string" ? className : undefined,
        variant: "outline",
      })}
      data-slot="alert-dialog-cancel"
    />
  );
}
