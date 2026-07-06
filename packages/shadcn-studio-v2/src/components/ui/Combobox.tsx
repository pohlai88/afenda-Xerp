// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface ComboboxProps
  extends ComponentProps<typeof ComboboxPrimitive.Root> {}
export interface ComboboxTriggerProps
  extends ComponentProps<typeof ComboboxPrimitive.Trigger> {}
export interface ComboboxInputProps
  extends ComponentProps<typeof ComboboxPrimitive.Input> {}
export interface ComboboxContentProps
  extends ComponentProps<typeof ComboboxPrimitive.Popup>,
    Pick<
      ComponentProps<typeof ComboboxPrimitive.Positioner>,
      "align" | "alignOffset" | "side" | "sideOffset"
    > {}
export interface ComboboxListProps
  extends ComponentProps<typeof ComboboxPrimitive.List> {}
export interface ComboboxItemProps
  extends ComponentProps<typeof ComboboxPrimitive.Item> {}
export interface ComboboxEmptyProps extends ComponentProps<"div"> {}

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
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none",
        typeof className === "string" ? className : undefined
      )}
      data-slot="combobox-trigger"
    >
      {children}
      <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
    </ComboboxPrimitive.Trigger>
  );
}

export function ComboboxInput({ className, ...props }: ComboboxInputProps) {
  return (
    <ComboboxPrimitive.Input
      {...props}
      className={cn(
        "flex h-10 w-full bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground",
        typeof className === "string" ? className : undefined
      )}
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
        className="z-50 outline-none"
        data-slot="combobox-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <ComboboxPrimitive.Popup
          {...props}
          className={cn(
            "z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
            typeof className === "string" ? className : undefined
          )}
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
      className={cn(
        "max-h-72 overflow-y-auto overflow-x-hidden",
        typeof className === "string" ? className : undefined
      )}
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
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50",
        typeof className === "string" ? className : undefined
      )}
      data-slot="combobox-item"
    >
      <span className="flex size-4 items-center justify-center">
        <ComboboxPrimitive.ItemIndicator data-slot="combobox-item-indicator">
          <CheckIcon className="size-4" />
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
