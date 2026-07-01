"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar";
import { CheckIcon } from "lucide-react";
import type * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/utils/utils";

import {
  MENUBAR_SLOTS,
  menubarCheckboxItemClassName,
  menubarCheckboxItemIndicatorClassName,
  menubarContentClassName,
  menubarItemClassName,
  menubarLabelClassName,
  menubarRadioItemClassName,
  menubarRadioItemIndicatorClassName,
  menubarRootClassName,
  menubarSeparatorClassName,
  menubarShortcutClassName,
  menubarSubContentClassName,
  menubarSubTriggerClassName,
  menubarTriggerClassName,
} from "./menubar.contract.js";

type MenubarProps = WithoutGovernedDataSlot<MenubarPrimitive.Props>;
type MenubarMenuProps = WithoutGovernedDataSlot<
  React.ComponentProps<typeof DropdownMenu>
>;
type MenubarGroupProps = WithoutGovernedDataSlot<
  React.ComponentProps<typeof DropdownMenuGroup>
>;
type MenubarPortalProps = WithoutGovernedDataSlot<
  React.ComponentProps<typeof DropdownMenuPortal>
>;
type MenubarTriggerProps = WithoutGovernedDataSlot<
  React.ComponentProps<typeof DropdownMenuTrigger>
>;
type MenubarContentProps = WithoutGovernedDataSlot<
  React.ComponentProps<typeof DropdownMenuContent>
>;
type MenubarItemProps = WithoutGovernedDataSlot<
  React.ComponentProps<typeof DropdownMenuItem>
>;
type MenubarCheckboxItemProps =
  WithoutGovernedDataSlot<MenuPrimitive.CheckboxItem.Props> & {
    inset?: boolean;
  };
type MenubarRadioGroupProps = WithoutGovernedDataSlot<
  React.ComponentProps<typeof DropdownMenuRadioGroup>
>;
type MenubarRadioItemProps =
  WithoutGovernedDataSlot<MenuPrimitive.RadioItem.Props> & {
    inset?: boolean;
  };
type MenubarLabelProps = WithoutGovernedDataSlot<
  React.ComponentProps<typeof DropdownMenuLabel>
> & {
  inset?: boolean;
};
type MenubarSeparatorProps = WithoutGovernedDataSlot<
  React.ComponentProps<typeof DropdownMenuSeparator>
>;
type MenubarShortcutProps = WithoutGovernedDataSlot<
  React.ComponentProps<typeof DropdownMenuShortcut>
>;
type MenubarSubProps = WithoutGovernedDataSlot<
  React.ComponentProps<typeof DropdownMenuSub>
>;
type MenubarSubTriggerProps = WithoutGovernedDataSlot<
  React.ComponentProps<typeof DropdownMenuSubTrigger>
> & {
  inset?: boolean;
};
type MenubarSubContentProps = WithoutGovernedDataSlot<
  React.ComponentProps<typeof DropdownMenuSubContent>
>;

function Menubar({ className, ...props }: MenubarProps) {
  return (
    <MenubarPrimitive
      {...props}
      className={cn(menubarRootClassName, className)}
      data-slot={MENUBAR_SLOTS.root}
    />
  );
}

function MenubarMenu({ ...props }: MenubarMenuProps) {
  return <DropdownMenu {...props} data-slot={MENUBAR_SLOTS.menu} />;
}

function MenubarGroup({ ...props }: MenubarGroupProps) {
  return <DropdownMenuGroup {...props} data-slot={MENUBAR_SLOTS.group} />;
}

function MenubarPortal({ ...props }: MenubarPortalProps) {
  return <DropdownMenuPortal {...props} data-slot={MENUBAR_SLOTS.portal} />;
}

function MenubarTrigger({ className, ...props }: MenubarTriggerProps) {
  return (
    <DropdownMenuTrigger
      {...props}
      className={cn(menubarTriggerClassName, className)}
      data-slot={MENUBAR_SLOTS.trigger}
    />
  );
}

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: MenubarContentProps) {
  return (
    <DropdownMenuContent
      {...props}
      align={align}
      alignOffset={alignOffset}
      className={cn(menubarContentClassName, className)}
      data-slot={MENUBAR_SLOTS.content}
      sideOffset={sideOffset}
    />
  );
}

function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenubarItemProps) {
  return (
    <DropdownMenuItem
      {...props}
      className={cn(menubarItemClassName, className)}
      data-inset={inset}
      data-slot={MENUBAR_SLOTS.item}
      data-variant={variant}
    />
  );
}

function MenubarCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: MenubarCheckboxItemProps) {
  return (
    <MenuPrimitive.CheckboxItem
      {...props}
      checked={checked}
      className={cn(menubarCheckboxItemClassName, className)}
      data-inset={inset}
      data-slot={MENUBAR_SLOTS.checkboxItem}
    >
      <span
        className={menubarCheckboxItemIndicatorClassName}
        data-slot={MENUBAR_SLOTS.checkboxItemIndicator}
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

function MenubarRadioGroup({ ...props }: MenubarRadioGroupProps) {
  return (
    <DropdownMenuRadioGroup {...props} data-slot={MENUBAR_SLOTS.radioGroup} />
  );
}

function MenubarRadioItem({
  className,
  children,
  inset,
  ...props
}: MenubarRadioItemProps) {
  return (
    <MenuPrimitive.RadioItem
      {...props}
      className={cn(menubarRadioItemClassName, className)}
      data-inset={inset}
      data-slot={MENUBAR_SLOTS.radioItem}
    >
      <span
        className={menubarRadioItemIndicatorClassName}
        data-slot={MENUBAR_SLOTS.radioItemIndicator}
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

function MenubarLabel({ className, inset, ...props }: MenubarLabelProps) {
  return (
    <DropdownMenuLabel
      {...props}
      className={cn(menubarLabelClassName, className)}
      data-inset={inset}
      data-slot={MENUBAR_SLOTS.label}
    />
  );
}

function MenubarSeparator({ className, ...props }: MenubarSeparatorProps) {
  return (
    <DropdownMenuSeparator
      {...props}
      className={cn(menubarSeparatorClassName, className)}
      data-slot={MENUBAR_SLOTS.separator}
    />
  );
}

function MenubarShortcut({ className, ...props }: MenubarShortcutProps) {
  return (
    <DropdownMenuShortcut
      {...props}
      className={cn(menubarShortcutClassName, className)}
      data-slot={MENUBAR_SLOTS.shortcut}
    />
  );
}

function MenubarSub({ ...props }: MenubarSubProps) {
  return <DropdownMenuSub {...props} data-slot={MENUBAR_SLOTS.sub} />;
}

function MenubarSubTrigger({
  className,
  inset,
  ...props
}: MenubarSubTriggerProps) {
  return (
    <DropdownMenuSubTrigger
      {...props}
      className={cn(menubarSubTriggerClassName, className)}
      data-inset={inset}
      data-slot={MENUBAR_SLOTS.subTrigger}
    />
  );
}

function MenubarSubContent({ className, ...props }: MenubarSubContentProps) {
  return (
    <DropdownMenuSubContent
      {...props}
      className={cn(menubarSubContentClassName, className)}
      data-slot={MENUBAR_SLOTS.subContent}
    />
  );
}

export type { MenubarSlot } from "./menubar.contract.js";
export type {
  MenubarCheckboxItemProps,
  MenubarContentProps,
  MenubarGroupProps,
  MenubarItemProps,
  MenubarLabelProps,
  MenubarMenuProps,
  MenubarPortalProps,
  MenubarProps,
  MenubarRadioGroupProps,
  MenubarRadioItemProps,
  MenubarSeparatorProps,
  MenubarShortcutProps,
  MenubarSubContentProps,
  MenubarSubProps,
  MenubarSubTriggerProps,
  MenubarTriggerProps,
};
export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
};
