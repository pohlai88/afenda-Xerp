"use client";

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import { buttonClassName } from "./button";

export interface AlertDialogProps
  extends ComponentProps<typeof AlertDialogPrimitive.Root> {}
export interface AlertDialogTriggerProps
  extends ComponentProps<typeof AlertDialogPrimitive.Trigger> {}
export interface AlertDialogPortalProps
  extends ComponentProps<typeof AlertDialogPrimitive.Portal> {}
export interface AlertDialogOverlayProps
  extends Omit<
    ComponentProps<typeof AlertDialogPrimitive.Backdrop>,
    "className"
  > {
  readonly className?: string | undefined;
}
export interface AlertDialogContentProps
  extends Omit<ComponentProps<typeof AlertDialogPrimitive.Popup>, "className"> {
  readonly className?: string | undefined;
}
export interface AlertDialogHeaderProps extends ComponentProps<"div"> {}
export interface AlertDialogFooterProps extends ComponentProps<"div"> {}
export interface AlertDialogTitleProps
  extends Omit<ComponentProps<typeof AlertDialogPrimitive.Title>, "className"> {
  readonly className?: string | undefined;
}
export interface AlertDialogDescriptionProps
  extends Omit<
    ComponentProps<typeof AlertDialogPrimitive.Description>,
    "className"
  > {
  readonly className?: string | undefined;
}
export interface AlertDialogActionProps
  extends Omit<ComponentProps<typeof AlertDialogPrimitive.Close>, "className"> {
  readonly className?: string | undefined;
}
export interface AlertDialogCancelProps
  extends Omit<ComponentProps<typeof AlertDialogPrimitive.Close>, "className"> {
  readonly className?: string | undefined;
}

const ALERT_DIALOG_OVERLAY_CLASS =
  "fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px]";
const ALERT_DIALOG_VIEWPORT_CLASS =
  "fixed inset-0 z-50 flex items-center justify-center p-4";
const ALERT_DIALOG_CONTENT_CLASS =
  "grid w-full max-w-lg gap-4 rounded-lg border border-border bg-background p-6 shadow-lg";
const ALERT_DIALOG_HEADER_CLASS =
  "flex flex-col gap-2 text-center sm:text-left";
const ALERT_DIALOG_FOOTER_CLASS =
  "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end";
const ALERT_DIALOG_TITLE_CLASS = "font-semibold text-lg";
const ALERT_DIALOG_DESCRIPTION_CLASS = "text-muted-foreground text-sm";

export function alertDialogOverlayClassName({
  className,
}: Pick<AlertDialogOverlayProps, "className"> = {}): string {
  return cn(ALERT_DIALOG_OVERLAY_CLASS, className);
}

export function alertDialogContentClassName({
  className,
}: Pick<AlertDialogContentProps, "className"> = {}): string {
  return cn(ALERT_DIALOG_CONTENT_CLASS, className);
}

export function alertDialogHeaderClassName({
  className,
}: Pick<AlertDialogHeaderProps, "className"> = {}): string {
  return cn(ALERT_DIALOG_HEADER_CLASS, className);
}

export function alertDialogFooterClassName({
  className,
}: Pick<AlertDialogFooterProps, "className"> = {}): string {
  return cn(ALERT_DIALOG_FOOTER_CLASS, className);
}

export function alertDialogTitleClassName({
  className,
}: Pick<AlertDialogTitleProps, "className"> = {}): string {
  return cn(ALERT_DIALOG_TITLE_CLASS, className);
}

export function alertDialogDescriptionClassName({
  className,
}: Pick<AlertDialogDescriptionProps, "className"> = {}): string {
  return cn(ALERT_DIALOG_DESCRIPTION_CLASS, className);
}

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
      className={alertDialogOverlayClassName({ className })}
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
      <div className={ALERT_DIALOG_VIEWPORT_CLASS}>
        <AlertDialogPrimitive.Popup
          {...props}
          className={alertDialogContentClassName({ className })}
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
      className={alertDialogHeaderClassName({ className })}
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
      className={alertDialogFooterClassName({ className })}
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
      className={alertDialogTitleClassName({ className })}
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
      className={alertDialogDescriptionClassName({ className })}
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
      className={buttonClassName({ className })}
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
      className={buttonClassName({ className, variant: "outline" })}
      data-slot="alert-dialog-cancel"
    />
  );
}
