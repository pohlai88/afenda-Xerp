"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components-ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components-ui/input-group";
import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/utils/utils";

import {
  COMBOBOX_SLOTS,
  comboboxChipClassName,
  comboboxChipInputClassName,
  comboboxChipRemoveClassName,
  comboboxChipsClassName,
  comboboxContentClassName,
  comboboxEmptyClassName,
  comboboxInputGroupClassName,
  comboboxItemClassName,
  comboboxItemIndicatorClassName,
  comboboxLabelClassName,
  comboboxListClassName,
  comboboxPositionerClassName,
  comboboxSeparatorClassName,
  comboboxTriggerClassName,
  comboboxTriggerIconClassName,
} from "./combobox.contract.js";

type ComboboxProps = WithoutGovernedDataSlot<
  React.ComponentProps<typeof ComboboxPrimitive.Root>
>;
type ComboboxValueProps =
  WithoutGovernedDataSlot<ComboboxPrimitive.Value.Props>;
type ComboboxTriggerProps =
  WithoutGovernedDataSlot<ComboboxPrimitive.Trigger.Props>;
type ComboboxClearProps =
  WithoutGovernedDataSlot<ComboboxPrimitive.Clear.Props>;
type ComboboxInputProps =
  WithoutGovernedDataSlot<ComboboxPrimitive.Input.Props> & {
    showTrigger?: boolean;
    showClear?: boolean;
  };
type ComboboxContentProps = WithoutGovernedDataSlot<
  ComboboxPrimitive.Popup.Props &
    Pick<
      ComboboxPrimitive.Positioner.Props,
      "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
    >
>;
type ComboboxListProps = WithoutGovernedDataSlot<ComboboxPrimitive.List.Props>;
type ComboboxItemProps = WithoutGovernedDataSlot<ComboboxPrimitive.Item.Props>;
type ComboboxGroupProps =
  WithoutGovernedDataSlot<ComboboxPrimitive.Group.Props>;
type ComboboxLabelProps =
  WithoutGovernedDataSlot<ComboboxPrimitive.GroupLabel.Props>;
type ComboboxCollectionProps =
  WithoutGovernedDataSlot<ComboboxPrimitive.Collection.Props>;
type ComboboxEmptyProps =
  WithoutGovernedDataSlot<ComboboxPrimitive.Empty.Props>;
type ComboboxSeparatorProps =
  WithoutGovernedDataSlot<ComboboxPrimitive.Separator.Props>;
type ComboboxChipsProps = WithoutGovernedDataSlot<
  React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> &
    ComboboxPrimitive.Chips.Props
>;
type ComboboxChipProps =
  WithoutGovernedDataSlot<ComboboxPrimitive.Chip.Props> & {
    showRemove?: boolean;
  };
type ComboboxChipsInputProps =
  WithoutGovernedDataSlot<ComboboxPrimitive.Input.Props>;

const Combobox = (({ ...props }: ComboboxProps) => (
  <ComboboxPrimitive.Root {...props} data-slot={COMBOBOX_SLOTS.root} />
)) as typeof ComboboxPrimitive.Root;

function ComboboxValue({ ...props }: ComboboxValueProps) {
  return (
    <ComboboxPrimitive.Value {...props} data-slot={COMBOBOX_SLOTS.value} />
  );
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxTriggerProps) {
  return (
    <ComboboxPrimitive.Trigger
      {...props}
      className={cn(comboboxTriggerClassName, className)}
      data-slot={COMBOBOX_SLOTS.trigger}
    >
      {children}
      <ChevronDownIcon className={comboboxTriggerIconClassName} />
    </ComboboxPrimitive.Trigger>
  );
}

function ComboboxClear({ className, ...props }: ComboboxClearProps) {
  return (
    <ComboboxPrimitive.Clear
      {...props}
      className={cn(className)}
      data-slot={COMBOBOX_SLOTS.clear}
      render={<InputGroupButton size="icon-xs" variant="ghost" />}
    >
      <XIcon className="pointer-events-none" />
    </ComboboxPrimitive.Clear>
  );
}

function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}: ComboboxInputProps) {
  return (
    <InputGroup className={cn(comboboxInputGroupClassName, className)}>
      <ComboboxPrimitive.Input
        render={<InputGroupInput disabled={disabled} />}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        {showTrigger && (
          <InputGroupButton
            className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
            data-slot={COMBOBOX_SLOTS.inputGroupButton}
            disabled={disabled}
            render={<ComboboxTrigger />}
            size="icon-xs"
            variant="ghost"
          />
        )}
        {showClear && <ComboboxClear disabled={disabled} />}
      </InputGroupAddon>
      {children}
    </InputGroup>
  );
}

function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxContentProps) {
  return (
    <ComboboxPrimitive.Portal data-slot={COMBOBOX_SLOTS.portal}>
      <ComboboxPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className={comboboxPositionerClassName}
        data-slot={COMBOBOX_SLOTS.positioner}
        side={side}
        sideOffset={sideOffset}
      >
        <ComboboxPrimitive.Popup
          {...props}
          className={cn(comboboxContentClassName, className)}
          data-chips={!!anchor}
          data-slot={COMBOBOX_SLOTS.content}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

function ComboboxList({ className, ...props }: ComboboxListProps) {
  return (
    <ComboboxPrimitive.List
      {...props}
      className={cn(comboboxListClassName, className)}
      data-slot={COMBOBOX_SLOTS.list}
    />
  );
}

function ComboboxItem({ className, children, ...props }: ComboboxItemProps) {
  return (
    <ComboboxPrimitive.Item
      {...props}
      className={cn(comboboxItemClassName, className)}
      data-slot={COMBOBOX_SLOTS.item}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        data-slot={COMBOBOX_SLOTS.itemIndicator}
        render={<span className={comboboxItemIndicatorClassName} />}
      >
        <CheckIcon className="pointer-events-none" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
}

function ComboboxGroup({ className, ...props }: ComboboxGroupProps) {
  return (
    <ComboboxPrimitive.Group
      {...props}
      className={cn(className)}
      data-slot={COMBOBOX_SLOTS.group}
    />
  );
}

function ComboboxLabel({ className, ...props }: ComboboxLabelProps) {
  return (
    <ComboboxPrimitive.GroupLabel
      {...props}
      className={cn(comboboxLabelClassName, className)}
      data-slot={COMBOBOX_SLOTS.label}
    />
  );
}

function ComboboxCollection({ ...props }: ComboboxCollectionProps) {
  return (
    <ComboboxPrimitive.Collection
      {...props}
      data-slot={COMBOBOX_SLOTS.collection}
    />
  );
}

function ComboboxEmpty({ className, ...props }: ComboboxEmptyProps) {
  return (
    <ComboboxPrimitive.Empty
      {...props}
      className={cn(comboboxEmptyClassName, className)}
      data-slot={COMBOBOX_SLOTS.empty}
    />
  );
}

function ComboboxSeparator({ className, ...props }: ComboboxSeparatorProps) {
  return (
    <ComboboxPrimitive.Separator
      {...props}
      className={cn(comboboxSeparatorClassName, className)}
      data-slot={COMBOBOX_SLOTS.separator}
    />
  );
}

function ComboboxChips({ className, ...props }: ComboboxChipsProps) {
  return (
    <ComboboxPrimitive.Chips
      {...props}
      className={cn(comboboxChipsClassName, className)}
      data-slot={COMBOBOX_SLOTS.chips}
    />
  );
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxChipProps) {
  return (
    <ComboboxPrimitive.Chip
      {...props}
      className={cn(comboboxChipClassName, className)}
      data-slot={COMBOBOX_SLOTS.chip}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          className={comboboxChipRemoveClassName}
          data-slot={COMBOBOX_SLOTS.chipRemove}
          render={<Button size="icon-xs" variant="ghost" />}
        >
          <XIcon className="pointer-events-none" />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  );
}

function ComboboxChipsInput({ className, ...props }: ComboboxChipsInputProps) {
  return (
    <ComboboxPrimitive.Input
      {...props}
      className={cn(comboboxChipInputClassName, className)}
      data-slot={COMBOBOX_SLOTS.chipInput}
    />
  );
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null);
}

export type { ComboboxSlot } from "./combobox.contract.js";
export type {
  ComboboxChipProps,
  ComboboxChipsInputProps,
  ComboboxChipsProps,
  ComboboxClearProps,
  ComboboxCollectionProps,
  ComboboxContentProps,
  ComboboxEmptyProps,
  ComboboxGroupProps,
  ComboboxInputProps,
  ComboboxItemProps,
  ComboboxLabelProps,
  ComboboxListProps,
  ComboboxProps,
  ComboboxSeparatorProps,
  ComboboxTriggerProps,
  ComboboxValueProps,
};
export {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
};
