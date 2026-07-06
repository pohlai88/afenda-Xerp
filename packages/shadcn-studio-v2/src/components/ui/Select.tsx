// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface SelectProps
  extends ComponentProps<typeof SelectPrimitive.Root> {}
export interface SelectValueProps
  extends ComponentProps<typeof SelectPrimitive.Value> {}
export interface SelectTriggerProps
  extends ComponentProps<typeof SelectPrimitive.Trigger> {
  readonly size?: "default" | "sm";
}
export interface SelectContentProps
  extends ComponentProps<typeof SelectPrimitive.Popup>,
    Pick<
      ComponentProps<typeof SelectPrimitive.Positioner>,
      "align" | "alignItemWithTrigger" | "alignOffset" | "side" | "sideOffset"
    > {}
export interface SelectGroupProps
  extends ComponentProps<typeof SelectPrimitive.Group> {}
export interface SelectLabelProps
  extends ComponentProps<typeof SelectPrimitive.GroupLabel> {}
export interface SelectItemProps
  extends ComponentProps<typeof SelectPrimitive.Item> {}
export interface SelectSeparatorProps
  extends ComponentProps<typeof SelectPrimitive.Separator> {}

const SELECT_TRIGGER_BASE_CLASS =
  "flex w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[popup-open]:ring-2 data-[popup-open]:ring-ring data-[popup-open]:ring-offset-2";
const SELECT_TRIGGER_SIZE_CLASSES = {
  default: "h-10",
  sm: "h-9",
} as const;
const SELECT_POSITIONER_CLASS = "z-50 outline-none";
const SELECT_CONTENT_CLASS =
  "max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md";
const SELECT_ITEM_CLASS =
  "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

export function Select({ ...props }: SelectProps) {
  return <SelectPrimitive.Root {...props} data-slot="select" />;
}

export function SelectGroup({ className, ...props }: SelectGroupProps) {
  return (
    <SelectPrimitive.Group
      {...props}
      className={cn("p-1", className)}
      data-slot="select-group"
    />
  );
}

export function SelectValue({ className, ...props }: SelectValueProps) {
  return (
    <SelectPrimitive.Value
      {...props}
      className={cn("line-clamp-1", className)}
      data-slot="select-value"
    />
  );
}

export function SelectTrigger({
  children,
  className,
  size = "default",
  ...props
}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      {...props}
      className={cn(
        SELECT_TRIGGER_BASE_CLASS,
        SELECT_TRIGGER_SIZE_CLASSES[size],
        className
      )}
      data-size={size}
      data-slot="select-trigger"
    >
      {children}
      <SelectPrimitive.Icon
        render={<ChevronDownIcon className="size-4 shrink-0 opacity-50" />}
      />
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  align = "center",
  alignItemWithTrigger = true,
  alignOffset = 0,
  children,
  className,
  side = "bottom",
  sideOffset = 4,
  ...props
}: SelectContentProps) {
  return (
    <SelectPrimitive.Portal data-slot="select-portal">
      <SelectPrimitive.Positioner
        align={align}
        alignItemWithTrigger={alignItemWithTrigger}
        alignOffset={alignOffset}
        className={SELECT_POSITIONER_CLASS}
        data-slot="select-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <SelectPrimitive.Popup
          {...props}
          className={cn(SELECT_CONTENT_CLASS, className)}
          data-slot="select-content"
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List data-slot="select-list">
            {children}
          </SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

export function SelectLabel({ className, ...props }: SelectLabelProps) {
  return (
    <SelectPrimitive.GroupLabel
      {...props}
      className={cn(
        "px-2 py-1.5 font-medium text-muted-foreground text-xs",
        className
      )}
      data-slot="select-label"
    />
  );
}

export function SelectItem({ children, className, ...props }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      {...props}
      className={cn(SELECT_ITEM_CLASS, className)}
      data-slot="select-item"
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator data-slot="select-item-indicator">
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  return (
    <SelectPrimitive.Separator
      {...props}
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      data-slot="select-separator"
    />
  );
}

export function SelectScrollUpButton({
  className,
  ...props
}: SelectPrimitive.ScrollUpArrow.Props) {
  return (
    <SelectPrimitive.ScrollUpArrow
      {...props}
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      data-slot="select-scroll-up"
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpArrow>
  );
}

export function SelectScrollDownButton({
  className,
  ...props
}: SelectPrimitive.ScrollDownArrow.Props) {
  return (
    <SelectPrimitive.ScrollDownArrow
      {...props}
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      data-slot="select-scroll-down"
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownArrow>
  );
}
