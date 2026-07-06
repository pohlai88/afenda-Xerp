"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface SelectProps
  extends ComponentProps<typeof SelectPrimitive.Root> {}
export interface SelectValueProps
  extends Omit<ComponentProps<typeof SelectPrimitive.Value>, "className"> {
  readonly className?: string | undefined;
}
export interface SelectTriggerProps
  extends Omit<ComponentProps<typeof SelectPrimitive.Trigger>, "className"> {
  readonly className?: string | undefined;
  readonly size?: "default" | "sm";
}
export interface SelectContentProps
  extends Omit<ComponentProps<typeof SelectPrimitive.Popup>, "className">,
    Pick<
      ComponentProps<typeof SelectPrimitive.Positioner>,
      "align" | "alignItemWithTrigger" | "alignOffset" | "side" | "sideOffset"
    > {
  readonly className?: string | undefined;
}
export interface SelectGroupProps
  extends Omit<ComponentProps<typeof SelectPrimitive.Group>, "className"> {
  readonly className?: string | undefined;
}
export interface SelectLabelProps
  extends Omit<ComponentProps<typeof SelectPrimitive.GroupLabel>, "className"> {
  readonly className?: string | undefined;
}
export interface SelectItemProps
  extends Omit<ComponentProps<typeof SelectPrimitive.Item>, "className"> {
  readonly className?: string | undefined;
}
export interface SelectSeparatorProps
  extends Omit<ComponentProps<typeof SelectPrimitive.Separator>, "className"> {
  readonly className?: string | undefined;
}

const SELECT_TRIGGER_BASE_CLASS =
  "flex w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[popup-open]:ring-2 data-[popup-open]:ring-ring data-[popup-open]:ring-offset-2";
const SELECT_TRIGGER_SIZE_CLASSES = {
  default: "h-10",
  sm: "h-9",
} satisfies Record<NonNullable<SelectTriggerProps["size"]>, string>;
const SELECT_POSITIONER_CLASS = "z-50 outline-none";
const SELECT_CONTENT_CLASS =
  "max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none";
const SELECT_ITEM_CLASS =
  "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none transition-colors focus-visible:bg-accent focus-visible:text-accent-foreground data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50";
const SELECT_LABEL_CLASS =
  "px-2 py-1.5 font-medium text-muted-foreground text-xs";
const SELECT_SEPARATOR_CLASS = "-mx-1 my-1 h-px bg-border";
const SELECT_SCROLL_BUTTON_CLASS =
  "flex cursor-default items-center justify-center py-1 outline-none focus-visible:bg-accent";

export function selectTriggerClassName({
  className,
  size = "default",
}: {
  readonly className?: string | undefined;
  readonly size?: SelectTriggerProps["size"];
} = {}): string {
  return cn(
    SELECT_TRIGGER_BASE_CLASS,
    SELECT_TRIGGER_SIZE_CLASSES[size],
    className
  );
}

export function selectContentClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(SELECT_CONTENT_CLASS, className);
}

export function selectItemClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(SELECT_ITEM_CLASS, className);
}

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
      className={selectTriggerClassName({ className, size })}
      data-size={size}
      data-slot="select-trigger"
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <ChevronDownIcon
            aria-hidden="true"
            className="size-4 shrink-0 opacity-50"
          />
        }
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
          className={selectContentClassName({ className })}
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
      className={cn(SELECT_LABEL_CLASS, className)}
      data-slot="select-label"
    />
  );
}

export function SelectItem({ children, className, ...props }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      {...props}
      className={selectItemClassName({ className })}
      data-slot="select-item"
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator data-slot="select-item-indicator">
          <CheckIcon aria-hidden="true" className="size-4" />
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
      className={cn(SELECT_SEPARATOR_CLASS, className)}
      data-slot="select-separator"
    />
  );
}

export function SelectScrollUpButton({
  className,
  ...props
}: Omit<SelectPrimitive.ScrollUpArrow.Props, "className"> & {
  readonly className?: string | undefined;
}) {
  return (
    <SelectPrimitive.ScrollUpArrow
      {...props}
      className={cn(SELECT_SCROLL_BUTTON_CLASS, className)}
      data-slot="select-scroll-up"
    >
      <ChevronUpIcon aria-hidden="true" className="size-4" />
    </SelectPrimitive.ScrollUpArrow>
  );
}

export function SelectScrollDownButton({
  className,
  ...props
}: Omit<SelectPrimitive.ScrollDownArrow.Props, "className"> & {
  readonly className?: string | undefined;
}) {
  return (
    <SelectPrimitive.ScrollDownArrow
      {...props}
      className={cn(SELECT_SCROLL_BUTTON_CLASS, className)}
      data-slot="select-scroll-down"
    >
      <ChevronDownIcon aria-hidden="true" className="size-4" />
    </SelectPrimitive.ScrollDownArrow>
  );
}
