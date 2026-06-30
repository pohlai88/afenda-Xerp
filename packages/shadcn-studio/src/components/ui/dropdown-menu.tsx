"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import type * as React from "react";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/lib/utils";

import {
  DROPDOWN_MENU_SLOTS,
  dropdownMenuCheckboxItemClassName,
  dropdownMenuCheckboxItemIndicatorClassName,
  dropdownMenuContentClassName,
  dropdownMenuItemClassName,
  dropdownMenuLabelClassName,
  dropdownMenuPositionerClassName,
  dropdownMenuRadioItemClassName,
  dropdownMenuRadioItemIndicatorClassName,
  dropdownMenuSeparatorClassName,
  dropdownMenuShortcutClassName,
  dropdownMenuSubContentClassName,
  dropdownMenuSubTriggerClassName,
} from "./dropdown-menu.contract.js";

type DropdownMenuProps = WithoutGovernedDataSlot<MenuPrimitive.Root.Props>;
type DropdownMenuPortalProps =
  WithoutGovernedDataSlot<MenuPrimitive.Portal.Props>;
type DropdownMenuTriggerProps =
  WithoutGovernedDataSlot<MenuPrimitive.Trigger.Props>;
type DropdownMenuContentProps = WithoutGovernedDataSlot<
  MenuPrimitive.Popup.Props &
    Pick<
      MenuPrimitive.Positioner.Props,
      "align" | "alignOffset" | "side" | "sideOffset"
    >
>;
type DropdownMenuGroupProps =
  WithoutGovernedDataSlot<MenuPrimitive.Group.Props>;
type DropdownMenuLabelProps =
  WithoutGovernedDataSlot<MenuPrimitive.GroupLabel.Props> & {
    inset?: boolean;
  };
type DropdownMenuItemProps =
  WithoutGovernedDataSlot<MenuPrimitive.Item.Props> & {
    inset?: boolean;
    variant?: "default" | "destructive";
  };
type DropdownMenuSubProps =
  WithoutGovernedDataSlot<MenuPrimitive.SubmenuRoot.Props>;
type DropdownMenuSubTriggerProps =
  WithoutGovernedDataSlot<MenuPrimitive.SubmenuTrigger.Props> & {
    inset?: boolean;
  };
type DropdownMenuSubContentProps = DropdownMenuContentProps;
type DropdownMenuCheckboxItemProps =
  WithoutGovernedDataSlot<MenuPrimitive.CheckboxItem.Props> & {
    inset?: boolean;
  };
type DropdownMenuRadioGroupProps =
  WithoutGovernedDataSlot<MenuPrimitive.RadioGroup.Props>;
type DropdownMenuRadioItemProps =
  WithoutGovernedDataSlot<MenuPrimitive.RadioItem.Props> & {
    inset?: boolean;
  };
type DropdownMenuSeparatorProps =
  WithoutGovernedDataSlot<MenuPrimitive.Separator.Props>;
type DropdownMenuShortcutProps = WithoutGovernedDataSlot<
  React.ComponentProps<"span">
>;

function DropdownMenu({ ...props }: DropdownMenuProps) {
  return <MenuPrimitive.Root {...props} data-slot={DROPDOWN_MENU_SLOTS.root} />;
}

function DropdownMenuPortal({ ...props }: DropdownMenuPortalProps) {
  return (
    <MenuPrimitive.Portal {...props} data-slot={DROPDOWN_MENU_SLOTS.portal} />
  );
}

function DropdownMenuTrigger({ ...props }: DropdownMenuTriggerProps) {
  return (
    <MenuPrimitive.Trigger {...props} data-slot={DROPDOWN_MENU_SLOTS.trigger} />
  );
}

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  className,
  ...props
}: DropdownMenuContentProps) {
  return (
    <MenuPrimitive.Portal data-slot={DROPDOWN_MENU_SLOTS.portal}>
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className={dropdownMenuPositionerClassName}
        data-slot={DROPDOWN_MENU_SLOTS.positioner}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          {...props}
          className={cn(dropdownMenuContentClassName, className)}
          data-slot={DROPDOWN_MENU_SLOTS.content}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({ ...props }: DropdownMenuGroupProps) {
  return (
    <MenuPrimitive.Group {...props} data-slot={DROPDOWN_MENU_SLOTS.group} />
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: DropdownMenuLabelProps) {
  return (
    <MenuPrimitive.GroupLabel
      {...props}
      className={cn(dropdownMenuLabelClassName, className)}
      data-inset={inset}
      data-slot={DROPDOWN_MENU_SLOTS.label}
    />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: DropdownMenuItemProps) {
  return (
    <MenuPrimitive.Item
      {...props}
      className={cn(dropdownMenuItemClassName, className)}
      data-inset={inset}
      data-slot={DROPDOWN_MENU_SLOTS.item}
      data-variant={variant}
    />
  );
}

function DropdownMenuSub({ ...props }: DropdownMenuSubProps) {
  return (
    <MenuPrimitive.SubmenuRoot {...props} data-slot={DROPDOWN_MENU_SLOTS.sub} />
  );
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: DropdownMenuSubTriggerProps) {
  return (
    <MenuPrimitive.SubmenuTrigger
      {...props}
      className={cn(dropdownMenuSubTriggerClassName, className)}
      data-inset={inset}
      data-slot={DROPDOWN_MENU_SLOTS.subTrigger}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </MenuPrimitive.SubmenuTrigger>
  );
}

function DropdownMenuSubContent({
  align = "start",
  alignOffset = -3,
  side = "right",
  sideOffset = 0,
  className,
  ...props
}: DropdownMenuSubContentProps) {
  return (
    <DropdownMenuContent
      align={align}
      alignOffset={alignOffset}
      className={cn(dropdownMenuSubContentClassName, className)}
      data-slot={DROPDOWN_MENU_SLOTS.subContent}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: DropdownMenuCheckboxItemProps) {
  return (
    <MenuPrimitive.CheckboxItem
      {...props}
      checked={checked}
      className={cn(dropdownMenuCheckboxItemClassName, className)}
      data-inset={inset}
      data-slot={DROPDOWN_MENU_SLOTS.checkboxItem}
    >
      <span
        className={dropdownMenuCheckboxItemIndicatorClassName}
        data-slot={DROPDOWN_MENU_SLOTS.checkboxItemIndicator}
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({ ...props }: DropdownMenuRadioGroupProps) {
  return (
    <MenuPrimitive.RadioGroup
      {...props}
      data-slot={DROPDOWN_MENU_SLOTS.radioGroup}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: DropdownMenuRadioItemProps) {
  return (
    <MenuPrimitive.RadioItem
      {...props}
      className={cn(dropdownMenuRadioItemClassName, className)}
      data-inset={inset}
      data-slot={DROPDOWN_MENU_SLOTS.radioItem}
    >
      <span
        className={dropdownMenuRadioItemIndicatorClassName}
        data-slot={DROPDOWN_MENU_SLOTS.radioItemIndicator}
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: DropdownMenuSeparatorProps) {
  return (
    <MenuPrimitive.Separator
      {...props}
      className={cn(dropdownMenuSeparatorClassName, className)}
      data-slot={DROPDOWN_MENU_SLOTS.separator}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: DropdownMenuShortcutProps) {
  return (
    <span
      {...props}
      className={cn(dropdownMenuShortcutClassName, className)}
      data-slot={DROPDOWN_MENU_SLOTS.shortcut}
    />
  );
}

export type { DropdownMenuSlot } from "./dropdown-menu.contract.js";
export type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuContentProps,
  DropdownMenuGroupProps,
  DropdownMenuItemProps,
  DropdownMenuLabelProps,
  DropdownMenuPortalProps,
  DropdownMenuProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuSeparatorProps,
  DropdownMenuShortcutProps,
  DropdownMenuSubContentProps,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuTriggerProps,
};
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
