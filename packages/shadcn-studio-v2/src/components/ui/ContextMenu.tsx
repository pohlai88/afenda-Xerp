// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface ContextMenuProps
  extends ComponentProps<typeof ContextMenuPrimitive.Root> {}
export interface ContextMenuTriggerProps
  extends ComponentProps<typeof ContextMenuPrimitive.Trigger> {}
export interface ContextMenuContentProps
  extends ComponentProps<typeof ContextMenuPrimitive.Popup>,
    Pick<
      ComponentProps<typeof ContextMenuPrimitive.Positioner>,
      "align" | "alignOffset" | "side" | "sideOffset"
    > {}
export interface ContextMenuItemProps
  extends ComponentProps<typeof ContextMenuPrimitive.Item> {
  readonly inset?: boolean;
}
export interface ContextMenuCheckboxItemProps
  extends ComponentProps<typeof ContextMenuPrimitive.CheckboxItem> {
  readonly inset?: boolean;
}
export interface ContextMenuRadioGroupProps
  extends ComponentProps<typeof ContextMenuPrimitive.RadioGroup> {}
export interface ContextMenuRadioItemProps
  extends ComponentProps<typeof ContextMenuPrimitive.RadioItem> {
  readonly inset?: boolean;
}
export interface ContextMenuLabelProps
  extends ComponentProps<typeof ContextMenuPrimitive.GroupLabel> {
  readonly inset?: boolean;
}
export interface ContextMenuSeparatorProps
  extends ComponentProps<typeof ContextMenuPrimitive.Separator> {}
export interface ContextMenuShortcutProps extends ComponentProps<"span"> {}
export interface ContextMenuGroupProps
  extends ComponentProps<typeof ContextMenuPrimitive.Group> {}
export interface ContextMenuSubProps
  extends ComponentProps<typeof ContextMenuPrimitive.SubmenuRoot> {}
export interface ContextMenuSubTriggerProps
  extends ComponentProps<typeof ContextMenuPrimitive.SubmenuTrigger> {
  readonly inset?: boolean;
}
export interface ContextMenuSubContentProps extends ContextMenuContentProps {}

const CONTENT_CLASS =
  "z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md";
const ITEM_CLASS =
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

export function ContextMenu({ ...props }: ContextMenuProps) {
  return <ContextMenuPrimitive.Root {...props} data-slot="context-menu" />;
}

export function ContextMenuTrigger({ ...props }: ContextMenuTriggerProps) {
  return (
    <ContextMenuPrimitive.Trigger {...props} data-slot="context-menu-trigger" />
  );
}

export function ContextMenuContent({
  align = "start",
  alignOffset = 0,
  className,
  side = "right",
  sideOffset = 4,
  ...props
}: ContextMenuContentProps) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal">
      <ContextMenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className="z-50 outline-none"
        data-slot="context-menu-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <ContextMenuPrimitive.Popup
          {...props}
          className={cn(
            CONTENT_CLASS,
            typeof className === "string" ? className : undefined
          )}
          data-slot="context-menu-content"
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
}

export function ContextMenuItem({
  className,
  inset,
  ...props
}: ContextMenuItemProps) {
  return (
    <ContextMenuPrimitive.Item
      {...props}
      className={cn(
        ITEM_CLASS,
        inset ? "pl-8" : undefined,
        typeof className === "string" ? className : undefined
      )}
      data-slot="context-menu-item"
    />
  );
}

export function ContextMenuCheckboxItem({
  children,
  className,
  inset,
  ...props
}: ContextMenuCheckboxItemProps) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      {...props}
      className={cn(
        ITEM_CLASS,
        inset ? "pl-10" : "pl-8",
        typeof className === "string" ? className : undefined
      )}
      data-slot="context-menu-checkbox-item"
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <ContextMenuPrimitive.CheckboxItemIndicator data-slot="context-menu-checkbox-indicator">
          <CheckIcon className="size-4" />
        </ContextMenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

export function ContextMenuRadioGroup({
  ...props
}: ContextMenuRadioGroupProps) {
  return (
    <ContextMenuPrimitive.RadioGroup
      {...props}
      data-slot="context-menu-radio-group"
    />
  );
}

export function ContextMenuRadioItem({
  children,
  className,
  inset,
  ...props
}: ContextMenuRadioItemProps) {
  return (
    <ContextMenuPrimitive.RadioItem
      {...props}
      className={cn(
        ITEM_CLASS,
        inset ? "pl-10" : "pl-8",
        typeof className === "string" ? className : undefined
      )}
      data-slot="context-menu-radio-item"
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <ContextMenuPrimitive.RadioItemIndicator data-slot="context-menu-radio-indicator">
          <CheckIcon className="size-4" />
        </ContextMenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

export function ContextMenuLabel({
  className,
  inset,
  ...props
}: ContextMenuLabelProps) {
  return (
    <ContextMenuPrimitive.GroupLabel
      {...props}
      className={cn(
        "px-2 py-1.5 font-medium text-sm",
        inset ? "pl-8" : undefined,
        typeof className === "string" ? className : undefined
      )}
      data-slot="context-menu-label"
    />
  );
}

export function ContextMenuSeparator({
  className,
  ...props
}: ContextMenuSeparatorProps) {
  return (
    <ContextMenuPrimitive.Separator
      {...props}
      className={cn(
        "-mx-1 my-1 h-px bg-border",
        typeof className === "string" ? className : undefined
      )}
      data-slot="context-menu-separator"
    />
  );
}

export function ContextMenuShortcut({
  className,
  ...props
}: ContextMenuShortcutProps) {
  return (
    <span
      {...props}
      className={cn(
        "ml-auto text-muted-foreground text-xs tracking-widest",
        className
      )}
      data-slot="context-menu-shortcut"
    />
  );
}

export function ContextMenuGroup({ ...props }: ContextMenuGroupProps) {
  return (
    <ContextMenuPrimitive.Group {...props} data-slot="context-menu-group" />
  );
}

export function ContextMenuSub({ ...props }: ContextMenuSubProps) {
  return (
    <ContextMenuPrimitive.SubmenuRoot {...props} data-slot="context-menu-sub" />
  );
}

export function ContextMenuSubTrigger({
  children,
  className,
  inset,
  ...props
}: ContextMenuSubTriggerProps) {
  return (
    <ContextMenuPrimitive.SubmenuTrigger
      {...props}
      className={cn(
        ITEM_CLASS,
        inset ? "pl-8" : undefined,
        typeof className === "string" ? className : undefined
      )}
      data-slot="context-menu-sub-trigger"
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </ContextMenuPrimitive.SubmenuTrigger>
  );
}

export function ContextMenuSubContent({
  align = "start",
  alignOffset = -4,
  className,
  side = "right",
  sideOffset = 4,
  ...props
}: ContextMenuSubContentProps) {
  return (
    <ContextMenuContent
      {...props}
      align={align}
      alignOffset={alignOffset}
      className={className}
      side={side}
      sideOffset={sideOffset}
    />
  );
}
