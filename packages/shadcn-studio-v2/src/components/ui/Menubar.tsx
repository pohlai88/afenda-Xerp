"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./DropdownMenu";

export interface MenubarProps
  extends Omit<ComponentProps<typeof MenubarPrimitive>, "className"> {
  readonly className?: string | undefined;
}
export interface MenubarMenuProps extends ComponentProps<typeof DropdownMenu> {}
export interface MenubarTriggerProps
  extends Omit<ComponentProps<typeof DropdownMenuTrigger>, "className"> {
  readonly className?: string | undefined;
}
export interface MenubarContentProps
  extends Omit<ComponentProps<typeof DropdownMenuContent>, "className"> {
  readonly className?: string | undefined;
}
export interface MenubarItemProps
  extends Omit<ComponentProps<typeof DropdownMenuItem>, "className"> {
  readonly className?: string | undefined;
  readonly inset?: boolean;
}
export interface MenubarCheckboxItemProps
  extends Omit<ComponentProps<typeof MenuPrimitive.CheckboxItem>, "className"> {
  readonly className?: string | undefined;
  readonly inset?: boolean;
}
export interface MenubarRadioGroupProps
  extends ComponentProps<typeof DropdownMenuRadioGroup> {}
export interface MenubarRadioItemProps
  extends Omit<ComponentProps<typeof MenuPrimitive.RadioItem>, "className"> {
  readonly className?: string | undefined;
  readonly inset?: boolean;
}
export interface MenubarLabelProps
  extends Omit<ComponentProps<typeof DropdownMenuLabel>, "className"> {
  readonly className?: string | undefined;
  readonly inset?: boolean;
}
export interface MenubarSeparatorProps
  extends Omit<ComponentProps<typeof DropdownMenuSeparator>, "className"> {
  readonly className?: string | undefined;
}
export interface MenubarShortcutProps
  extends Omit<ComponentProps<typeof DropdownMenuShortcut>, "className"> {
  readonly className?: string | undefined;
}
export interface MenubarGroupProps
  extends ComponentProps<typeof DropdownMenuGroup> {}
export interface MenubarSubProps
  extends ComponentProps<typeof DropdownMenuSub> {}
export interface MenubarSubTriggerProps
  extends Omit<ComponentProps<typeof DropdownMenuSubTrigger>, "className"> {
  readonly className?: string | undefined;
  readonly inset?: boolean;
}
export interface MenubarSubContentProps
  extends Omit<ComponentProps<typeof DropdownMenuSubContent>, "className"> {
  readonly className?: string | undefined;
}

const MENUBAR_BASE_CLASS =
  "flex h-10 items-center space-x-1 rounded-md border border-border bg-background p-1";
const MENUBAR_TRIGGER_CLASS =
  "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 font-medium text-sm outline-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[popup-open]:bg-accent data-[popup-open]:text-accent-foreground disabled:pointer-events-none disabled:opacity-50";
const MENUBAR_CONTENT_CLASS =
  "z-50 min-w-[12rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none";
const MENUBAR_ITEM_CLASS =
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus-visible:bg-accent focus-visible:text-accent-foreground data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50";
const MENUBAR_LABEL_CLASS = "px-2 py-1.5 font-medium text-sm";
const MENUBAR_SEPARATOR_CLASS = "-mx-1 my-1 h-px bg-border";
const MENUBAR_SHORTCUT_CLASS =
  "ml-auto text-muted-foreground text-xs tracking-widest";

export function menubarClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(MENUBAR_BASE_CLASS, className);
}

export function menubarTriggerClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(MENUBAR_TRIGGER_CLASS, className);
}

export function menubarContentClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(MENUBAR_CONTENT_CLASS, className);
}

export function menubarItemClassName({
  className,
  inset,
}: {
  readonly className?: string | undefined;
  readonly inset?: boolean | undefined;
} = {}): string {
  return cn(MENUBAR_ITEM_CLASS, inset && "pl-8", className);
}

export function Menubar({ className, ...props }: MenubarProps) {
  return (
    <MenubarPrimitive
      {...props}
      className={menubarClassName({ className })}
      data-slot="menubar"
    />
  );
}

export function MenubarMenu({ ...props }: MenubarMenuProps) {
  return <DropdownMenu {...props} data-slot="menubar-menu" />;
}

export function MenubarTrigger({ className, ...props }: MenubarTriggerProps) {
  return (
    <DropdownMenuTrigger
      {...props}
      className={menubarTriggerClassName({ className })}
      data-slot="menubar-trigger"
    />
  );
}

export function MenubarContent({
  align = "start",
  alignOffset = 0,
  className,
  side = "bottom",
  sideOffset = 4,
  ...props
}: MenubarContentProps) {
  return (
    <DropdownMenuContent
      {...props}
      align={align}
      alignOffset={alignOffset}
      className={menubarContentClassName({ className })}
      data-slot="menubar-content"
      side={side}
      sideOffset={sideOffset}
    />
  );
}

export function MenubarItem({ className, inset, ...props }: MenubarItemProps) {
  return (
    <DropdownMenuItem
      {...props}
      className={menubarItemClassName({ className, inset })}
      data-slot="menubar-item"
    />
  );
}

export function MenubarCheckboxItem({
  children,
  className,
  inset,
  ...props
}: MenubarCheckboxItemProps) {
  return (
    <MenuPrimitive.CheckboxItem
      {...props}
      className={cn(MENUBAR_ITEM_CLASS, "pl-8", inset && "pl-10", className)}
      data-slot="menubar-checkbox-item"
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <MenuPrimitive.CheckboxItemIndicator data-slot="menubar-checkbox-indicator">
          <CheckIcon aria-hidden="true" className="size-4" />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

export function MenubarRadioGroup({ ...props }: MenubarRadioGroupProps) {
  return <DropdownMenuRadioGroup {...props} data-slot="menubar-radio-group" />;
}

export function MenubarRadioItem({
  children,
  className,
  inset,
  ...props
}: MenubarRadioItemProps) {
  return (
    <MenuPrimitive.RadioItem
      {...props}
      className={cn(MENUBAR_ITEM_CLASS, "pl-8", inset && "pl-10", className)}
      data-slot="menubar-radio-item"
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <MenuPrimitive.RadioItemIndicator data-slot="menubar-radio-indicator">
          <CheckIcon aria-hidden="true" className="size-4" />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

export function MenubarLabel({
  className,
  inset,
  ...props
}: MenubarLabelProps) {
  return (
    <DropdownMenuLabel
      {...props}
      className={cn(MENUBAR_LABEL_CLASS, inset && "pl-8", className)}
      data-slot="menubar-label"
    />
  );
}

export function MenubarSeparator({
  className,
  ...props
}: MenubarSeparatorProps) {
  return (
    <DropdownMenuSeparator
      {...props}
      className={cn(MENUBAR_SEPARATOR_CLASS, className)}
      data-slot="menubar-separator"
    />
  );
}

export function MenubarShortcut({ className, ...props }: MenubarShortcutProps) {
  return (
    <DropdownMenuShortcut
      {...props}
      className={cn(MENUBAR_SHORTCUT_CLASS, className)}
      data-slot="menubar-shortcut"
    />
  );
}

export function MenubarGroup({ ...props }: MenubarGroupProps) {
  return <DropdownMenuGroup {...props} data-slot="menubar-group" />;
}

export function MenubarSub({ ...props }: MenubarSubProps) {
  return <DropdownMenuSub {...props} data-slot="menubar-sub" />;
}

export function MenubarSubTrigger({
  children,
  className,
  inset,
  ...props
}: MenubarSubTriggerProps) {
  return (
    <DropdownMenuSubTrigger
      {...props}
      className={menubarItemClassName({ className, inset })}
      data-slot="menubar-sub-trigger"
    >
      {children}
      <ChevronRightIcon aria-hidden="true" className="ml-auto size-4" />
    </DropdownMenuSubTrigger>
  );
}

export function MenubarSubContent({
  align = "start",
  alignOffset = -4,
  className,
  side = "right",
  sideOffset = 4,
  ...props
}: MenubarSubContentProps) {
  return (
    <DropdownMenuSubContent
      {...props}
      align={align}
      alignOffset={alignOffset}
      className={menubarContentClassName({ className })}
      data-slot="menubar-sub-content"
      side={side}
      sideOffset={sideOffset}
    />
  );
}
