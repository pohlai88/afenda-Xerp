"use client";

import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import type * as React from "react";

import { Button } from "@/components-ui/button";
import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/utils/utils";

import {
  SHEET_SLOTS,
  sheetCloseButtonClassName,
  sheetContentClassName,
  sheetDescriptionClassName,
  sheetFooterClassName,
  sheetHeaderClassName,
  sheetOverlayClassName,
  sheetTitleClassName,
  sheetViewportClassName,
} from "./sheet.contract.js";

type SheetProps = WithoutGovernedDataSlot<SheetPrimitive.Root.Props>;
type SheetTriggerProps = WithoutGovernedDataSlot<SheetPrimitive.Trigger.Props>;
type SheetPortalProps = WithoutGovernedDataSlot<SheetPrimitive.Portal.Props>;
type SheetCloseProps = WithoutGovernedDataSlot<SheetPrimitive.Close.Props>;
type SheetOverlayProps = WithoutGovernedDataSlot<SheetPrimitive.Backdrop.Props>;
type SheetViewportProps = WithoutGovernedDataSlot<React.ComponentProps<"div">>;
type SheetContentProps = WithoutGovernedDataSlot<SheetPrimitive.Popup.Props> & {
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
};
type SheetHeaderProps = WithoutGovernedDataSlot<React.ComponentProps<"div">>;
type SheetFooterProps = WithoutGovernedDataSlot<React.ComponentProps<"div">>;
type SheetTitleProps = WithoutGovernedDataSlot<SheetPrimitive.Title.Props>;
type SheetDescriptionProps =
  WithoutGovernedDataSlot<SheetPrimitive.Description.Props>;

function Sheet({ ...props }: SheetProps) {
  return <SheetPrimitive.Root {...props} data-slot={SHEET_SLOTS.root} />;
}

function SheetTrigger({ ...props }: SheetTriggerProps) {
  return <SheetPrimitive.Trigger {...props} data-slot={SHEET_SLOTS.trigger} />;
}

function SheetClose({ ...props }: SheetCloseProps) {
  return <SheetPrimitive.Close {...props} data-slot={SHEET_SLOTS.close} />;
}

function SheetPortal({ ...props }: SheetPortalProps) {
  return <SheetPrimitive.Portal {...props} data-slot={SHEET_SLOTS.portal} />;
}

function SheetOverlay({ className, ...props }: SheetOverlayProps) {
  return (
    <SheetPrimitive.Backdrop
      {...props}
      className={cn(sheetOverlayClassName, className)}
      data-slot={SHEET_SLOTS.overlay}
    />
  );
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: SheetContentProps) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <div className={sheetViewportClassName} data-slot={SHEET_SLOTS.viewport}>
        <SheetPrimitive.Popup
          {...props}
          className={cn(sheetContentClassName, className)}
          data-side={side}
          data-slot={SHEET_SLOTS.content}
        >
          {children}
          {showCloseButton && (
            <SheetPrimitive.Close
              data-slot={SHEET_SLOTS.close}
              render={
                <Button
                  className={sheetCloseButtonClassName}
                  size="icon-sm"
                  variant="ghost"
                />
              }
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </SheetPrimitive.Close>
          )}
        </SheetPrimitive.Popup>
      </div>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: SheetHeaderProps) {
  return (
    <div
      {...props}
      className={cn(sheetHeaderClassName, className)}
      data-slot={SHEET_SLOTS.header}
    />
  );
}

function SheetFooter({ className, ...props }: SheetFooterProps) {
  return (
    <div
      {...props}
      className={cn(sheetFooterClassName, className)}
      data-slot={SHEET_SLOTS.footer}
    />
  );
}

function SheetTitle({ className, ...props }: SheetTitleProps) {
  return (
    <SheetPrimitive.Title
      {...props}
      className={cn(sheetTitleClassName, className)}
      data-slot={SHEET_SLOTS.title}
    />
  );
}

function SheetDescription({ className, ...props }: SheetDescriptionProps) {
  return (
    <SheetPrimitive.Description
      {...props}
      className={cn(sheetDescriptionClassName, className)}
      data-slot={SHEET_SLOTS.description}
    />
  );
}

export type { SheetSlot } from "./sheet.contract.js";
export type {
  SheetCloseProps,
  SheetContentProps,
  SheetDescriptionProps,
  SheetFooterProps,
  SheetHeaderProps,
  SheetOverlayProps,
  SheetPortalProps,
  SheetProps,
  SheetTitleProps,
  SheetTriggerProps,
  SheetViewportProps,
};
export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
