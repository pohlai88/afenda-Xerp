"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import { buttonClassName } from "./button";

export interface DialogProps
  extends ComponentProps<typeof DialogPrimitive.Root> {}
export interface DialogTriggerProps
  extends ComponentProps<typeof DialogPrimitive.Trigger> {}
export interface DialogPortalProps
  extends ComponentProps<typeof DialogPrimitive.Portal> {}
export interface DialogCloseProps
  extends ComponentProps<typeof DialogPrimitive.Close> {}
export interface DialogOverlayProps
  extends Omit<ComponentProps<typeof DialogPrimitive.Backdrop>, "className"> {
  readonly className?: string | undefined;
}
export interface DialogContentProps
  extends Omit<ComponentProps<typeof DialogPrimitive.Popup>, "className"> {
  readonly className?: string | undefined;
}
export interface DialogCloseButtonProps
  extends Omit<ComponentProps<typeof DialogPrimitive.Close>, "className"> {
  readonly className?: string | undefined;
}
export interface DialogHeaderProps extends ComponentProps<"div"> {}
export interface DialogFooterProps extends ComponentProps<"div"> {}
export interface DialogTitleProps
  extends Omit<ComponentProps<typeof DialogPrimitive.Title>, "className"> {
  readonly className?: string | undefined;
}
export interface DialogDescriptionProps
  extends Omit<
    ComponentProps<typeof DialogPrimitive.Description>,
    "className"
  > {
  readonly className?: string | undefined;
}

const DIALOG_OVERLAY_CLASS =
  "fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px]";
const DIALOG_VIEWPORT_CLASS =
  "fixed inset-0 z-50 flex items-center justify-center p-4";
const DIALOG_CONTENT_CLASS =
  "relative grid w-full max-w-lg gap-4 rounded-lg border border-border bg-background p-6 text-foreground shadow-lg outline-none";
const DIALOG_CLOSE_BUTTON_CLASS = "absolute top-4 right-4 size-8 p-0";

export function dialogOverlayClassName({
  className,
}: Pick<DialogOverlayProps, "className"> = {}): string {
  return cn(DIALOG_OVERLAY_CLASS, className);
}

export function dialogContentClassName({
  className,
}: Pick<DialogContentProps, "className"> = {}): string {
  return cn(DIALOG_CONTENT_CLASS, className);
}

export function dialogCloseButtonClassName({
  className,
}: Pick<DialogCloseButtonProps, "className"> = {}): string {
  return buttonClassName({
    className: cn(DIALOG_CLOSE_BUTTON_CLASS, className),
    size: "icon",
    variant: "ghost",
  });
}

export function Dialog({ ...props }: DialogProps) {
  return <DialogPrimitive.Root {...props} data-slot="dialog" />;
}

export function DialogTrigger({ ...props }: DialogTriggerProps) {
  return <DialogPrimitive.Trigger {...props} data-slot="dialog-trigger" />;
}

export function DialogPortal({ ...props }: DialogPortalProps) {
  return <DialogPrimitive.Portal {...props} data-slot="dialog-portal" />;
}

export function DialogClose({ ...props }: DialogCloseProps) {
  return <DialogPrimitive.Close {...props} data-slot="dialog-close" />;
}

export function DialogOverlay({ className, ...props }: DialogOverlayProps) {
  return (
    <DialogPrimitive.Backdrop
      {...props}
      className={dialogOverlayClassName({ className })}
      data-slot="dialog-overlay"
    />
  );
}

export function DialogContent({
  children,
  className,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <div className={DIALOG_VIEWPORT_CLASS} data-slot="dialog-viewport">
        <DialogPrimitive.Popup
          {...props}
          className={dialogContentClassName({ className })}
          data-slot="dialog-content"
        >
          {children}
        </DialogPrimitive.Popup>
      </div>
    </DialogPortal>
  );
}

export function DialogCloseButton({
  className,
  ...props
}: DialogCloseButtonProps) {
  return (
    <DialogPrimitive.Close
      {...props}
      aria-label={props["aria-label"] ?? "Close"}
      className={dialogCloseButtonClassName({ className })}
      data-slot="dialog-close-button"
    >
      <XIcon aria-hidden="true" className="size-4" />
    </DialogPrimitive.Close>
  );
}

export function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return (
    <div
      {...props}
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      data-slot="dialog-header"
    />
  );
}

export function DialogFooter({ className, ...props }: DialogFooterProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      data-slot="dialog-footer"
    />
  );
}

export function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      {...props}
      className={cn(
        "font-semibold text-lg leading-none tracking-tight",
        className
      )}
      data-slot="dialog-title"
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      {...props}
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="dialog-description"
    />
  );
}
