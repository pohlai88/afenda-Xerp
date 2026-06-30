"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type * as React from "react";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/lib/utils";

import {
  SELECT_SLOTS,
  selectContentClassName,
  selectGroupClassName,
  selectItemClassName,
  selectItemIndicatorClassName,
  selectLabelClassName,
  selectPositionerClassName,
  selectScrollButtonClassName,
  selectScrollDownButtonClassName,
  selectSeparatorClassName,
  selectTriggerClassName,
  selectTriggerIconClassName,
  selectValueClassName,
} from "./select.contract.js";

type SelectProps = WithoutGovernedDataSlot<
  React.ComponentProps<typeof SelectPrimitive.Root>
>;
type SelectGroupProps = WithoutGovernedDataSlot<SelectPrimitive.Group.Props>;
type SelectValueProps = WithoutGovernedDataSlot<SelectPrimitive.Value.Props>;
type SelectTriggerProps =
  WithoutGovernedDataSlot<SelectPrimitive.Trigger.Props> & {
    size?: "sm" | "default";
  };
type SelectContentProps = WithoutGovernedDataSlot<
  SelectPrimitive.Popup.Props &
    Pick<
      SelectPrimitive.Positioner.Props,
      "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
    >
>;
type SelectLabelProps =
  WithoutGovernedDataSlot<SelectPrimitive.GroupLabel.Props>;
type SelectItemProps = WithoutGovernedDataSlot<SelectPrimitive.Item.Props>;
type SelectSeparatorProps =
  WithoutGovernedDataSlot<SelectPrimitive.Separator.Props>;
type SelectScrollUpButtonProps = WithoutGovernedDataSlot<
  React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>
>;
type SelectScrollDownButtonProps = WithoutGovernedDataSlot<
  React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>
>;

const Select = (({ ...props }: SelectProps) => (
  <SelectPrimitive.Root {...props} data-slot={SELECT_SLOTS.root} />
)) as typeof SelectPrimitive.Root;

function SelectGroup({ className, ...props }: SelectGroupProps) {
  return (
    <SelectPrimitive.Group
      {...props}
      className={cn(selectGroupClassName, className)}
      data-slot={SELECT_SLOTS.group}
    />
  );
}

function SelectValue({ className, ...props }: SelectValueProps) {
  return (
    <SelectPrimitive.Value
      {...props}
      className={cn(selectValueClassName, className)}
      data-slot={SELECT_SLOTS.value}
    />
  );
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      {...props}
      className={cn(selectTriggerClassName, className)}
      data-size={size}
      data-slot={SELECT_SLOTS.trigger}
    >
      {children}
      <SelectPrimitive.Icon
        render={<ChevronDownIcon className={selectTriggerIconClassName} />}
      />
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectContentProps) {
  return (
    <SelectPrimitive.Portal data-slot={SELECT_SLOTS.portal}>
      <SelectPrimitive.Positioner
        align={align}
        alignItemWithTrigger={alignItemWithTrigger}
        alignOffset={alignOffset}
        className={selectPositionerClassName}
        data-slot={SELECT_SLOTS.positioner}
        side={side}
        sideOffset={sideOffset}
      >
        <SelectPrimitive.Popup
          {...props}
          className={cn(selectContentClassName, className)}
          data-align-trigger={alignItemWithTrigger}
          data-slot={SELECT_SLOTS.content}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List data-slot={SELECT_SLOTS.list}>
            {children}
          </SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({ className, ...props }: SelectLabelProps) {
  return (
    <SelectPrimitive.GroupLabel
      {...props}
      className={cn(selectLabelClassName, className)}
      data-slot={SELECT_SLOTS.label}
    />
  );
}

function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      {...props}
      className={cn(selectItemClassName, className)}
      data-slot={SELECT_SLOTS.item}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={<span className={selectItemIndicatorClassName} />}
      >
        <CheckIcon className="pointer-events-none" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  return (
    <SelectPrimitive.Separator
      {...props}
      className={cn(selectSeparatorClassName, className)}
      data-slot={SELECT_SLOTS.separator}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: SelectScrollUpButtonProps) {
  return (
    <SelectPrimitive.ScrollUpArrow
      {...props}
      className={cn(selectScrollButtonClassName, className)}
      data-slot={SELECT_SLOTS.scrollUpButton}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: SelectScrollDownButtonProps) {
  return (
    <SelectPrimitive.ScrollDownArrow
      {...props}
      className={cn(selectScrollDownButtonClassName, className)}
      data-slot={SELECT_SLOTS.scrollDownButton}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  );
}

export type { SelectSlot } from "./select.contract.js";
export type {
  SelectContentProps,
  SelectGroupProps,
  SelectItemProps,
  SelectLabelProps,
  SelectProps,
  SelectScrollDownButtonProps,
  SelectScrollUpButtonProps,
  SelectSeparatorProps,
  SelectTriggerProps,
  SelectValueProps,
};
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
