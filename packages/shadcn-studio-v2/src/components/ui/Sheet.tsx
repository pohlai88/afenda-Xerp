"use client";

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { XIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import { buttonClassName } from "./button";

export interface SheetProps
  extends ComponentProps<typeof DrawerPrimitive.Root> {}
export interface SheetTriggerProps
  extends ComponentProps<typeof DrawerPrimitive.Trigger> {}
export interface SheetPortalProps
  extends ComponentProps<typeof DrawerPrimitive.Portal> {}
export interface SheetCloseProps
  extends ComponentProps<typeof DrawerPrimitive.Close> {}
export interface SheetOverlayProps
  extends Omit<ComponentProps<typeof DrawerPrimitive.Backdrop>, "className"> {
  readonly className?: string | undefined;
}
export interface SheetContentProps
  extends Omit<ComponentProps<typeof DrawerPrimitive.Popup>, "className"> {
  readonly className?: string | undefined;
  readonly side?: "bottom" | "left" | "right" | "top";
}
export interface SheetCloseButtonProps
  extends Omit<ComponentProps<typeof DrawerPrimitive.Close>, "className"> {
  readonly className?: string | undefined;
}
export interface SheetHeaderProps extends ComponentProps<"div"> {}
export interface SheetFooterProps extends ComponentProps<"div"> {}
export interface SheetTitleProps
  extends Omit<ComponentProps<typeof DrawerPrimitive.Title>, "className"> {
  readonly className?: string | undefined;
}
export interface SheetDescriptionProps
  extends Omit<
    ComponentProps<typeof DrawerPrimitive.Description>,
    "className"
  > {
  readonly className?: string | undefined;
}

const SHEET_SIDE_CLASSES = {
  bottom: "inset-x-0 bottom-0 border-t",
  left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
  right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
  top: "inset-x-0 top-0 border-b",
} as const;
const SHEET_CLOSE_BUTTON_CLASS = "absolute top-4 right-4 size-8 p-0";

export function sheetOverlayClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn("fixed inset-0 z-50 bg-black/50", className);
}

export function sheetContentClassName({
  className,
  side = "right",
}: {
  readonly className?: string | undefined;
  readonly side?: SheetContentProps["side"];
} = {}): string {
  return cn(
    "fixed z-50 gap-4 bg-background p-6 shadow-lg",
    SHEET_SIDE_CLASSES[side],
    className
  );
}

export function sheetCloseButtonClassName({
  className,
}: Pick<SheetCloseButtonProps, "className"> = {}): string {
  return buttonClassName({
    className: cn(SHEET_CLOSE_BUTTON_CLASS, className),
    size: "icon",
    variant: "ghost",
  });
}

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
      className={sheetOverlayClassName({ className })}
      data-slot="sheet-overlay"
    />
  );
}

export function SheetContent({
  children,
  className,
  side = "right",
  ...props
}: SheetContentProps) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DrawerPrimitive.Popup
        {...props}
        className={sheetContentClassName({ className, side })}
        data-side={side}
        data-slot="sheet-content"
      >
        {children}
      </DrawerPrimitive.Popup>
    </SheetPortal>
  );
}

export function SheetCloseButton({
  className,
  ...props
}: SheetCloseButtonProps) {
  return (
    <DrawerPrimitive.Close
      {...props}
      aria-label={props["aria-label"] ?? "Close"}
      className={sheetCloseButtonClassName({ className })}
      data-slot="sheet-close-button"
    >
      <XIcon aria-hidden="true" className="size-4" />
    </DrawerPrimitive.Close>
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
      className={cn("font-semibold text-foreground", className)}
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
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="sheet-description"
    />
  );
}
