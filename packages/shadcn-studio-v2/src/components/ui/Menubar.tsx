// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface MenubarProps
  extends ComponentProps<typeof MenubarPrimitive.Root> {}
export interface MenubarMenuProps
  extends ComponentProps<typeof MenubarPrimitive.Menu> {}
export interface MenubarTriggerProps
  extends ComponentProps<typeof MenubarPrimitive.Trigger> {}
export interface MenubarContentProps
  extends ComponentProps<typeof MenubarPrimitive.Popup>,
    Pick<
      ComponentProps<typeof MenubarPrimitive.Positioner>,
      "align" | "alignOffset" | "side" | "sideOffset"
    > {}
export interface MenubarItemProps
  extends ComponentProps<typeof MenubarPrimitive.Item> {
  readonly inset?: boolean;
}
export interface MenubarCheckboxItemProps
  extends ComponentProps<typeof MenubarPrimitive.CheckboxItem> {
  readonly inset?: boolean;
}
export interface MenubarRadioGroupProps
  extends ComponentProps<typeof MenubarPrimitive.RadioGroup> {}
export interface MenubarRadioItemProps
  extends ComponentProps<typeof MenubarPrimitive.RadioItem> {
  readonly inset?: boolean;
}
export interface MenubarLabelProps
  extends ComponentProps<typeof MenubarPrimitive.GroupLabel> {
  readonly inset?: boolean;
}
export interface MenubarSeparatorProps
  extends ComponentProps<typeof MenubarPrimitive.Separator> {}
export interface MenubarShortcutProps extends ComponentProps<"span"> {}
export interface MenubarGroupProps
  extends ComponentProps<typeof MenubarPrimitive.Group> {}
export interface MenubarSubProps
  extends ComponentProps<typeof MenubarPrimitive.SubmenuRoot> {}
export interface MenubarSubTriggerProps
  extends ComponentProps<typeof MenubarPrimitive.SubmenuTrigger> {
  readonly inset?: boolean;
}
export interface MenubarSubContentProps extends MenubarContentProps {}

const CONTENT_CLASS =
  "z-50 min-w-[12rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md";
const ITEM_CLASS =
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

export function Menubar({ className, ...props }: MenubarProps) {
  return (
    <MenubarPrimitive.Root
      {...props}
      className={cn(
        "flex h-10 items-center space-x-1 rounded-md border border-border bg-background p-1",
        typeof className === "string" ? className : undefined
      )}
      data-slot="menubar"
    />
  );
}

export function MenubarMenu({ ...props }: MenubarMenuProps) {
  return <MenubarPrimitive.Menu {...props} data-slot="menubar-menu" />;
}

export function MenubarTrigger({ className, ...props }: MenubarTriggerProps) {
  return (
    <MenubarPrimitive.Trigger
      {...props}
      className={cn(
        "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 font-medium text-sm outline-none data-[popup-open]:bg-accent data-[popup-open]:text-accent-foreground",
        typeof className === "string" ? className : undefined
      )}
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
    <MenubarPrimitive.Portal data-slot="menubar-portal">
      <MenubarPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className="z-50 outline-none"
        data-slot="menubar-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <MenubarPrimitive.Popup
          {...props}
          className={cn(
            CONTENT_CLASS,
            typeof className === "string" ? className : undefined
          )}
          data-slot="menubar-content"
        />
      </MenubarPrimitive.Positioner>
    </MenubarPrimitive.Portal>
  );
}

export function MenubarItem({ className, inset, ...props }: MenubarItemProps) {
  return (
    <MenubarPrimitive.Item
      {...props}
      className={cn(
        ITEM_CLASS,
        inset ? "pl-8" : undefined,
        typeof className === "string" ? className : undefined
      )}
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
    <MenubarPrimitive.CheckboxItem
      {...props}
      className={cn(
        ITEM_CLASS,
        inset ? "pl-10" : "pl-8",
        typeof className === "string" ? className : undefined
      )}
      data-slot="menubar-checkbox-item"
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <MenubarPrimitive.CheckboxItemIndicator data-slot="menubar-checkbox-indicator">
          <CheckIcon className="size-4" />
        </MenubarPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
}

export function MenubarRadioGroup({ ...props }: MenubarRadioGroupProps) {
  return (
    <MenubarPrimitive.RadioGroup {...props} data-slot="menubar-radio-group" />
  );
}

export function MenubarRadioItem({
  children,
  className,
  inset,
  ...props
}: MenubarRadioItemProps) {
  return (
    <MenubarPrimitive.RadioItem
      {...props}
      className={cn(
        ITEM_CLASS,
        inset ? "pl-10" : "pl-8",
        typeof className === "string" ? className : undefined
      )}
      data-slot="menubar-radio-item"
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <MenubarPrimitive.RadioItemIndicator data-slot="menubar-radio-indicator">
          <CheckIcon className="size-4" />
        </MenubarPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
}

export function MenubarLabel({
  className,
  inset,
  ...props
}: MenubarLabelProps) {
  return (
    <MenubarPrimitive.GroupLabel
      {...props}
      className={cn(
        "px-2 py-1.5 font-medium text-sm",
        inset ? "pl-8" : undefined,
        typeof className === "string" ? className : undefined
      )}
      data-slot="menubar-label"
    />
  );
}

export function MenubarSeparator({
  className,
  ...props
}: MenubarSeparatorProps) {
  return (
    <MenubarPrimitive.Separator
      {...props}
      className={cn(
        "-mx-1 my-1 h-px bg-border",
        typeof className === "string" ? className : undefined
      )}
      data-slot="menubar-separator"
    />
  );
}

export function MenubarShortcut({ className, ...props }: MenubarShortcutProps) {
  return (
    <span
      {...props}
      className={cn(
        "ml-auto text-muted-foreground text-xs tracking-widest",
        className
      )}
      data-slot="menubar-shortcut"
    />
  );
}

export function MenubarGroup({ ...props }: MenubarGroupProps) {
  return <MenubarPrimitive.Group {...props} data-slot="menubar-group" />;
}

export function MenubarSub({ ...props }: MenubarSubProps) {
  return <MenubarPrimitive.SubmenuRoot {...props} data-slot="menubar-sub" />;
}

export function MenubarSubTrigger({
  children,
  className,
  inset,
  ...props
}: MenubarSubTriggerProps) {
  return (
    <MenubarPrimitive.SubmenuTrigger
      {...props}
      className={cn(
        ITEM_CLASS,
        inset ? "pl-8" : undefined,
        typeof className === "string" ? className : undefined
      )}
      data-slot="menubar-sub-trigger"
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </MenubarPrimitive.SubmenuTrigger>
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
    <MenubarContent
      {...props}
      align={align}
      alignOffset={alignOffset}
      className={className}
      side={side}
      sideOffset={sideOffset}
    />
  );
}
