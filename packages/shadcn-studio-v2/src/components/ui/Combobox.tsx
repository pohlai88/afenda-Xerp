"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface ComboboxProps
  extends ComponentProps<typeof ComboboxPrimitive.Root> {}
export interface ComboboxTriggerProps
  extends Omit<ComponentProps<typeof ComboboxPrimitive.Trigger>, "className"> {
  readonly className?: string | undefined;
}
export interface ComboboxInputProps
  extends Omit<ComponentProps<typeof ComboboxPrimitive.Input>, "className"> {
  readonly className?: string | undefined;
}
export interface ComboboxContentProps
  extends Omit<ComponentProps<typeof ComboboxPrimitive.Popup>, "className">,
    Pick<
      ComponentProps<typeof ComboboxPrimitive.Positioner>,
      "align" | "alignOffset" | "side" | "sideOffset"
    > {
  readonly className?: string | undefined;
}
export interface ComboboxListProps
  extends Omit<ComponentProps<typeof ComboboxPrimitive.List>, "className"> {
  readonly className?: string | undefined;
}
export interface ComboboxItemProps
  extends Omit<ComponentProps<typeof ComboboxPrimitive.Item>, "className"> {
  readonly className?: string | undefined;
}
export interface ComboboxEmptyProps extends ComponentProps<"div"> {}

const COMBOBOX_TRIGGER_CLASS =
  "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[popup-open]:ring-2 data-[popup-open]:ring-ring data-[popup-open]:ring-offset-2";
const COMBOBOX_INPUT_CLASS =
  "flex h-10 w-full bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
const COMBOBOX_POSITIONER_CLASS = "z-50 outline-none";
const COMBOBOX_CONTENT_CLASS =
  "z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md";
const COMBOBOX_LIST_CLASS = "max-h-72 overflow-y-auto overflow-x-hidden";
const COMBOBOX_ITEM_CLASS =
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50";

export function comboboxTriggerClassName({
  className,
}: Pick<ComboboxTriggerProps, "className"> = {}): string {
  return cn(COMBOBOX_TRIGGER_CLASS, className);
}

export function comboboxInputClassName({
  className,
}: Pick<ComboboxInputProps, "className"> = {}): string {
  return cn(COMBOBOX_INPUT_CLASS, className);
}

export function comboboxContentClassName({
  className,
}: Pick<ComboboxContentProps, "className"> = {}): string {
  return cn(COMBOBOX_CONTENT_CLASS, className);
}

export function comboboxListClassName({
  className,
}: Pick<ComboboxListProps, "className"> = {}): string {
  return cn(COMBOBOX_LIST_CLASS, className);
}

export function comboboxItemClassName({
  className,
}: Pick<ComboboxItemProps, "className"> = {}): string {
  return cn(COMBOBOX_ITEM_CLASS, className);
}

export function Combobox({ ...props }: ComboboxProps) {
  return <ComboboxPrimitive.Root {...props} data-slot="combobox" />;
}

export function ComboboxTrigger({
  children,
  className,
  ...props
}: ComboboxTriggerProps) {
  return (
    <ComboboxPrimitive.Trigger
      {...props}
      className={comboboxTriggerClassName({ className })}
      data-slot="combobox-trigger"
    >
      {children}
      <ChevronDownIcon
        aria-hidden="true"
        className="size-4 shrink-0 opacity-50"
      />
    </ComboboxPrimitive.Trigger>
  );
}

export function ComboboxInput({ className, ...props }: ComboboxInputProps) {
  return (
    <ComboboxPrimitive.Input
      {...props}
      className={comboboxInputClassName({ className })}
      data-slot="combobox-input"
    />
  );
}

export function ComboboxContent({
  align = "start",
  alignOffset = 0,
  className,
  side = "bottom",
  sideOffset = 4,
  ...props
}: ComboboxContentProps) {
  return (
    <ComboboxPrimitive.Portal data-slot="combobox-portal">
      <ComboboxPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className={COMBOBOX_POSITIONER_CLASS}
        data-slot="combobox-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <ComboboxPrimitive.Popup
          {...props}
          className={comboboxContentClassName({ className })}
          data-slot="combobox-content"
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

export function ComboboxList({ className, ...props }: ComboboxListProps) {
  return (
    <ComboboxPrimitive.List
      {...props}
      className={comboboxListClassName({ className })}
      data-slot="combobox-list"
    />
  );
}

export function ComboboxItem({
  children,
  className,
  ...props
}: ComboboxItemProps) {
  return (
    <ComboboxPrimitive.Item
      {...props}
      className={comboboxItemClassName({ className })}
      data-slot="combobox-item"
    >
      <span className="flex size-4 items-center justify-center">
        <ComboboxPrimitive.ItemIndicator data-slot="combobox-item-indicator">
          <CheckIcon aria-hidden="true" className="size-4" />
        </ComboboxPrimitive.ItemIndicator>
      </span>
      {children}
    </ComboboxPrimitive.Item>
  );
}

export function ComboboxEmpty({ className, ...props }: ComboboxEmptyProps) {
  return (
    <div
      {...props}
      className={cn("py-6 text-center text-sm", className)}
      data-slot="combobox-empty"
    />
  );
}
