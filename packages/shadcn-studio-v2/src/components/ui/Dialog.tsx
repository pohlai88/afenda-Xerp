// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import { buttonClassName } from "./Button";

export interface DialogProps
  extends ComponentProps<typeof DialogPrimitive.Root> {}
export interface DialogTriggerProps
  extends ComponentProps<typeof DialogPrimitive.Trigger> {}
export interface DialogPortalProps
  extends ComponentProps<typeof DialogPrimitive.Portal> {}
export interface DialogCloseProps
  extends ComponentProps<typeof DialogPrimitive.Close> {}
export interface DialogOverlayProps
  extends ComponentProps<typeof DialogPrimitive.Backdrop> {}
export interface DialogContentProps
  extends ComponentProps<typeof DialogPrimitive.Popup> {
  readonly showCloseButton?: boolean;
}
export interface DialogHeaderProps extends ComponentProps<"div"> {}
export interface DialogFooterProps extends ComponentProps<"div"> {}
export interface DialogTitleProps
  extends ComponentProps<typeof DialogPrimitive.Title> {}
export interface DialogDescriptionProps
  extends ComponentProps<typeof DialogPrimitive.Description> {}

const DIALOG_OVERLAY_CLASS =
  "fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px]";
const DIALOG_VIEWPORT_CLASS =
  "fixed inset-0 z-50 flex items-center justify-center p-4";
const DIALOG_CONTENT_CLASS =
  "relative grid w-full max-w-lg gap-4 rounded-lg border border-border bg-background p-6 shadow-lg";

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
      className={cn(DIALOG_OVERLAY_CLASS, className)}
      data-slot="dialog-overlay"
    />
  );
}

export function DialogContent({
  children,
  className,
  showCloseButton = true,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <div className={DIALOG_VIEWPORT_CLASS} data-slot="dialog-viewport">
        <DialogPrimitive.Popup
          {...props}
          className={cn(DIALOG_CONTENT_CLASS, className)}
          data-slot="dialog-content"
        >
          {children}
          {showCloseButton ? (
            <DialogPrimitive.Close
              aria-label="Close"
              className={buttonClassName({
                className: "absolute top-4 right-4 size-8 p-0",
                size: "icon",
                variant: "ghost",
              })}
              data-slot="dialog-close"
            >
              <XIcon className="size-4" />
            </DialogPrimitive.Close>
          ) : null}
        </DialogPrimitive.Popup>
      </div>
    </DialogPortal>
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
