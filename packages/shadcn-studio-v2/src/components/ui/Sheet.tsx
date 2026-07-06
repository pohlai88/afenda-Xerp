// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { XIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import { buttonClassName } from "./Button";

export interface SheetProps
  extends ComponentProps<typeof DrawerPrimitive.Root> {}
export interface SheetTriggerProps
  extends ComponentProps<typeof DrawerPrimitive.Trigger> {}
export interface SheetPortalProps
  extends ComponentProps<typeof DrawerPrimitive.Portal> {}
export interface SheetCloseProps
  extends ComponentProps<typeof DrawerPrimitive.Close> {}
export interface SheetOverlayProps
  extends ComponentProps<typeof DrawerPrimitive.Backdrop> {}
export interface SheetContentProps
  extends ComponentProps<typeof DrawerPrimitive.Popup> {
  readonly showCloseButton?: boolean;
  readonly side?: "bottom" | "left" | "right" | "top";
}
export interface SheetHeaderProps extends ComponentProps<"div"> {}
export interface SheetFooterProps extends ComponentProps<"div"> {}
export interface SheetTitleProps
  extends ComponentProps<typeof DrawerPrimitive.Title> {}
export interface SheetDescriptionProps
  extends ComponentProps<typeof DrawerPrimitive.Description> {}

const SHEET_SIDE_CLASSES = {
  bottom: "inset-x-0 bottom-0 border-t",
  left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
  right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
  top: "inset-x-0 top-0 border-b",
} as const;

export function Sheet({ ...props }: SheetProps) {
  return <DrawerPrimitive.Root {...props} data-slot="sheet" />;
}

export function SheetTrigger({ ...props }: SheetTriggerProps) {
  return <DrawerPrimitive.Trigger {...props} data-slot="sheet-trigger" />;
}

export function SheetPortal({ ...props }: SheetPortalProps) {
  return <DrawerPrimitive.Portal {...props} data-slot="sheet-portal" />;
}

export function SheetClose({ ...props }: SheetCloseProps) {
  return <DrawerPrimitive.Close {...props} data-slot="sheet-close" />;
}

export function SheetOverlay({ className, ...props }: SheetOverlayProps) {
  return (
    <DrawerPrimitive.Backdrop
      {...props}
      className={cn(
        "fixed inset-0 z-50 bg-black/50",
        typeof className === "string" ? className : undefined
      )}
      data-slot="sheet-overlay"
    />
  );
}

export function SheetContent({
  children,
  className,
  showCloseButton = true,
  side = "right",
  ...props
}: SheetContentProps) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DrawerPrimitive.Popup
        {...props}
        className={cn(
          "fixed z-50 gap-4 bg-background p-6 shadow-lg",
          SHEET_SIDE_CLASSES[side],
          typeof className === "string" ? className : undefined
        )}
        data-side={side}
        data-slot="sheet-content"
      >
        {children}
        {showCloseButton ? (
          <DrawerPrimitive.Close
            aria-label="Close"
            className={buttonClassName({
              className: "absolute top-4 right-4 size-8 p-0",
              size: "icon",
              variant: "ghost",
            })}
            data-slot="sheet-close"
          >
            <XIcon className="size-4" />
          </DrawerPrimitive.Close>
        ) : null}
      </DrawerPrimitive.Popup>
    </SheetPortal>
  );
}

export function SheetHeader({ className, ...props }: SheetHeaderProps) {
  return (
    <div
      {...props}
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      data-slot="sheet-header"
    />
  );
}

export function SheetFooter({ className, ...props }: SheetFooterProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      data-slot="sheet-footer"
    />
  );
}

export function SheetTitle({ className, ...props }: SheetTitleProps) {
  return (
    <DrawerPrimitive.Title
      {...props}
      className={cn(
        "font-semibold text-foreground",
        typeof className === "string" ? className : undefined
      )}
      data-slot="sheet-title"
    />
  );
}

export function SheetDescription({
  className,
  ...props
}: SheetDescriptionProps) {
  return (
    <DrawerPrimitive.Description
      {...props}
      className={cn(
        "text-muted-foreground text-sm",
        typeof className === "string" ? className : undefined
      )}
      data-slot="sheet-description"
    />
  );
}
