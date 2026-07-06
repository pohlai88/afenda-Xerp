"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface DropdownMenuProps
  extends ComponentProps<typeof MenuPrimitive.Root> {}
export interface DropdownMenuPortalProps
  extends ComponentProps<typeof MenuPrimitive.Portal> {}
export interface DropdownMenuTriggerProps
  extends ComponentProps<typeof MenuPrimitive.Trigger> {}
export interface DropdownMenuContentProps
  extends Omit<ComponentProps<typeof MenuPrimitive.Popup>, "className">,
    Pick<
      ComponentProps<typeof MenuPrimitive.Positioner>,
      "align" | "alignOffset" | "side" | "sideOffset"
    > {
  readonly className?: string | undefined;
}
export interface DropdownMenuGroupProps
  extends ComponentProps<typeof MenuPrimitive.Group> {}
export interface DropdownMenuLabelProps
  extends Omit<ComponentProps<typeof MenuPrimitive.GroupLabel>, "className"> {
  readonly className?: string | undefined;
  readonly inset?: boolean;
}
export interface DropdownMenuItemProps
  extends Omit<ComponentProps<typeof MenuPrimitive.Item>, "className"> {
  readonly className?: string | undefined;
  readonly inset?: boolean;
  readonly variant?: "default" | "destructive";
}
export interface DropdownMenuSubProps
  extends ComponentProps<typeof MenuPrimitive.SubmenuRoot> {}
export interface DropdownMenuSubTriggerProps
  extends Omit<
    ComponentProps<typeof MenuPrimitive.SubmenuTrigger>,
    "className"
  > {
  readonly className?: string | undefined;
  readonly inset?: boolean;
}
export interface DropdownMenuSubContentProps extends DropdownMenuContentProps {}
export interface DropdownMenuCheckboxItemProps
  extends Omit<ComponentProps<typeof MenuPrimitive.CheckboxItem>, "className"> {
  readonly className?: string | undefined;
  readonly inset?: boolean;
}
export interface DropdownMenuRadioGroupProps
  extends ComponentProps<typeof MenuPrimitive.RadioGroup> {}
export interface DropdownMenuRadioItemProps
  extends Omit<ComponentProps<typeof MenuPrimitive.RadioItem>, "className"> {
  readonly className?: string | undefined;
  readonly inset?: boolean;
}
export interface DropdownMenuSeparatorProps
  extends Omit<ComponentProps<typeof MenuPrimitive.Separator>, "className"> {
  readonly className?: string | undefined;
}
export interface DropdownMenuShortcutProps extends ComponentProps<"span"> {}

const DROPDOWN_MENU_POSITIONER_CLASS = "z-50 outline-none";
const DROPDOWN_MENU_CONTENT_CLASS =
  "z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md";
const DROPDOWN_MENU_ITEM_CLASS =
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus-visible:bg-accent focus-visible:text-accent-foreground data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50 data-[variant=destructive]:text-destructive data-[variant=destructive]:data-[highlighted]:bg-destructive/10 data-[variant=destructive]:data-[highlighted]:text-destructive";

export function dropdownMenuContentClassName({
  className,
}: Pick<DropdownMenuContentProps, "className"> = {}): string {
  return cn(DROPDOWN_MENU_CONTENT_CLASS, className);
}

export function dropdownMenuItemClassName(
  className?: string | undefined,
  inset?: boolean
): string {
  return cn(DROPDOWN_MENU_ITEM_CLASS, inset && "pl-8", className);
}

export function DropdownMenu({ ...props }: DropdownMenuProps) {
  return <MenuPrimitive.Root {...props} data-slot="dropdown-menu" />;
}

export function DropdownMenuPortal({ ...props }: DropdownMenuPortalProps) {
  return <MenuPrimitive.Portal {...props} data-slot="dropdown-menu-portal" />;
}

export function DropdownMenuTrigger({ ...props }: DropdownMenuTriggerProps) {
  return <MenuPrimitive.Trigger {...props} data-slot="dropdown-menu-trigger" />;
}

export function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  className,
  side = "bottom",
  sideOffset = 4,
  ...props
}: DropdownMenuContentProps) {
  return (
    <MenuPrimitive.Portal data-slot="dropdown-menu-portal">
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className={DROPDOWN_MENU_POSITIONER_CLASS}
        data-slot="dropdown-menu-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          {...props}
          className={dropdownMenuContentClassName({ className })}
          data-slot="dropdown-menu-content"
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

export function DropdownMenuGroup({ ...props }: DropdownMenuGroupProps) {
  return <MenuPrimitive.Group {...props} data-slot="dropdown-menu-group" />;
}

export function DropdownMenuLabel({
  className,
  inset,
  ...props
}: DropdownMenuLabelProps) {
  return (
    <MenuPrimitive.GroupLabel
      {...props}
      className={cn(
        "px-2 py-1.5 font-medium text-sm",
        inset && "pl-8",
        className
      )}
      data-slot="dropdown-menu-label"
    />
  );
}

export function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: DropdownMenuItemProps) {
  return (
    <MenuPrimitive.Item
      {...props}
      className={dropdownMenuItemClassName(className, inset)}
      data-slot="dropdown-menu-item"
      data-variant={variant}
    />
  );
}

export function DropdownMenuSub({ ...props }: DropdownMenuSubProps) {
  return <MenuPrimitive.SubmenuRoot {...props} data-slot="dropdown-menu-sub" />;
}

export function DropdownMenuSubTrigger({
  children,
  className,
  inset,
  ...props
}: DropdownMenuSubTriggerProps) {
  return (
    <MenuPrimitive.SubmenuTrigger
      {...props}
      className={dropdownMenuItemClassName(className, inset)}
      data-slot="dropdown-menu-sub-trigger"
    >
      {children}
      <ChevronRightIcon aria-hidden="true" className="ml-auto size-4" />
    </MenuPrimitive.SubmenuTrigger>
  );
}

export function DropdownMenuSubContent({
  align = "start",
  alignOffset = -4,
  className,
  side = "right",
  sideOffset = 4,
  ...props
}: DropdownMenuSubContentProps) {
  return (
    <DropdownMenuContent
      {...props}
      align={align}
      alignOffset={alignOffset}
      className={className}
      side={side}
      sideOffset={sideOffset}
    />
  );
}

export function DropdownMenuCheckboxItem({
  checked,
  children,
  className,
  inset,
  ...props
}: DropdownMenuCheckboxItemProps) {
  return (
    <MenuPrimitive.CheckboxItem
      {...props}
      checked={checked}
      className={cn(
        DROPDOWN_MENU_ITEM_CLASS,
        "pl-8",
        inset && "pl-10",
        className
      )}
      data-slot="dropdown-menu-checkbox-item"
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <MenuPrimitive.CheckboxItemIndicator data-slot="dropdown-menu-checkbox-indicator">
          <CheckIcon aria-hidden="true" className="size-4" />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

export function DropdownMenuRadioGroup({
  ...props
}: DropdownMenuRadioGroupProps) {
  return (
    <MenuPrimitive.RadioGroup
      {...props}
      data-slot="dropdown-menu-radio-group"
    />
  );
}

export function DropdownMenuRadioItem({
  children,
  className,
  inset,
  ...props
}: DropdownMenuRadioItemProps) {
  return (
    <MenuPrimitive.RadioItem
      {...props}
      className={cn(
        DROPDOWN_MENU_ITEM_CLASS,
        "pl-8",
        inset && "pl-10",
        className
      )}
      data-slot="dropdown-menu-radio-item"
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <MenuPrimitive.RadioItemIndicator data-slot="dropdown-menu-radio-indicator">
          <CheckIcon aria-hidden="true" className="size-4" />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: DropdownMenuSeparatorProps) {
  return (
    <MenuPrimitive.Separator
      {...props}
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      data-slot="dropdown-menu-separator"
    />
  );
}

export function DropdownMenuShortcut({
  className,
  ...props
}: DropdownMenuShortcutProps) {
  return (
    <span
      {...props}
      className={cn(
        "ml-auto text-muted-foreground text-xs tracking-widest",
        className
      )}
      data-slot="dropdown-menu-shortcut"
    />
  );
}
