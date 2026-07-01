"use client";

import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import type * as React from "react";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/utils/utils";

import {
  CONTEXT_MENU_SLOTS,
  contextMenuCheckboxItemClassName,
  contextMenuCheckboxItemIndicatorClassName,
  contextMenuContentClassName,
  contextMenuItemClassName,
  contextMenuLabelClassName,
  contextMenuPositionerClassName,
  contextMenuRadioItemClassName,
  contextMenuRadioItemIndicatorClassName,
  contextMenuSeparatorClassName,
  contextMenuShortcutClassName,
  contextMenuSubContentClassName,
  contextMenuSubTriggerClassName,
  contextMenuTriggerClassName,
} from "./context-menu.contract.js";

type ContextMenuProps =
  WithoutGovernedDataSlot<ContextMenuPrimitive.Root.Props>;
type ContextMenuPortalProps =
  WithoutGovernedDataSlot<ContextMenuPrimitive.Portal.Props>;
type ContextMenuTriggerProps =
  WithoutGovernedDataSlot<ContextMenuPrimitive.Trigger.Props>;
type ContextMenuContentProps = WithoutGovernedDataSlot<
  ContextMenuPrimitive.Popup.Props &
    Pick<
      ContextMenuPrimitive.Positioner.Props,
      "align" | "alignOffset" | "side" | "sideOffset"
    >
>;
type ContextMenuGroupProps =
  WithoutGovernedDataSlot<ContextMenuPrimitive.Group.Props>;
type ContextMenuLabelProps =
  WithoutGovernedDataSlot<ContextMenuPrimitive.GroupLabel.Props> & {
    inset?: boolean;
  };
type ContextMenuItemProps =
  WithoutGovernedDataSlot<ContextMenuPrimitive.Item.Props> & {
    inset?: boolean;
    variant?: "default" | "destructive";
  };
type ContextMenuSubProps =
  WithoutGovernedDataSlot<ContextMenuPrimitive.SubmenuRoot.Props>;
type ContextMenuSubTriggerProps =
  WithoutGovernedDataSlot<ContextMenuPrimitive.SubmenuTrigger.Props> & {
    inset?: boolean;
  };
type ContextMenuSubContentProps = ContextMenuContentProps;
type ContextMenuCheckboxItemProps =
  WithoutGovernedDataSlot<ContextMenuPrimitive.CheckboxItem.Props> & {
    inset?: boolean;
  };
type ContextMenuRadioGroupProps =
  WithoutGovernedDataSlot<ContextMenuPrimitive.RadioGroup.Props>;
type ContextMenuRadioItemProps =
  WithoutGovernedDataSlot<ContextMenuPrimitive.RadioItem.Props> & {
    inset?: boolean;
  };
type ContextMenuSeparatorProps =
  WithoutGovernedDataSlot<ContextMenuPrimitive.Separator.Props>;
type ContextMenuShortcutProps = WithoutGovernedDataSlot<
  React.ComponentProps<"span">
>;

function ContextMenu({ ...props }: ContextMenuProps) {
  return (
    <ContextMenuPrimitive.Root {...props} data-slot={CONTEXT_MENU_SLOTS.root} />
  );
}

function ContextMenuPortal({ ...props }: ContextMenuPortalProps) {
  return (
    <ContextMenuPrimitive.Portal
      {...props}
      data-slot={CONTEXT_MENU_SLOTS.portal}
    />
  );
}

function ContextMenuTrigger({ className, ...props }: ContextMenuTriggerProps) {
  return (
    <ContextMenuPrimitive.Trigger
      {...props}
      className={cn(contextMenuTriggerClassName, className)}
      data-slot={CONTEXT_MENU_SLOTS.trigger}
    />
  );
}

function ContextMenuContent({
  className,
  align = "start",
  alignOffset = 4,
  side = "right",
  sideOffset = 0,
  ...props
}: ContextMenuContentProps) {
  return (
    <ContextMenuPrimitive.Portal data-slot={CONTEXT_MENU_SLOTS.portal}>
      <ContextMenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className={contextMenuPositionerClassName}
        data-slot={CONTEXT_MENU_SLOTS.positioner}
        side={side}
        sideOffset={sideOffset}
      >
        <ContextMenuPrimitive.Popup
          {...props}
          className={cn(contextMenuContentClassName, className)}
          data-slot={CONTEXT_MENU_SLOTS.content}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
}

function ContextMenuGroup({ ...props }: ContextMenuGroupProps) {
  return (
    <ContextMenuPrimitive.Group
      {...props}
      data-slot={CONTEXT_MENU_SLOTS.group}
    />
  );
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: ContextMenuLabelProps) {
  return (
    <ContextMenuPrimitive.GroupLabel
      {...props}
      className={cn(contextMenuLabelClassName, className)}
      data-inset={inset}
      data-slot={CONTEXT_MENU_SLOTS.label}
    />
  );
}

function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: ContextMenuItemProps) {
  return (
    <ContextMenuPrimitive.Item
      {...props}
      className={cn(contextMenuItemClassName, className)}
      data-inset={inset}
      data-slot={CONTEXT_MENU_SLOTS.item}
      data-variant={variant}
    />
  );
}

function ContextMenuSub({ ...props }: ContextMenuSubProps) {
  return (
    <ContextMenuPrimitive.SubmenuRoot
      {...props}
      data-slot={CONTEXT_MENU_SLOTS.sub}
    />
  );
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: ContextMenuSubTriggerProps) {
  return (
    <ContextMenuPrimitive.SubmenuTrigger
      {...props}
      className={cn(contextMenuSubTriggerClassName, className)}
      data-inset={inset}
      data-slot={CONTEXT_MENU_SLOTS.subTrigger}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </ContextMenuPrimitive.SubmenuTrigger>
  );
}

function ContextMenuSubContent({ ...props }: ContextMenuSubContentProps) {
  return (
    <ContextMenuContent
      {...props}
      className={contextMenuSubContentClassName}
      data-slot={CONTEXT_MENU_SLOTS.subContent}
      side="right"
    />
  );
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: ContextMenuCheckboxItemProps) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      {...props}
      checked={checked}
      className={cn(contextMenuCheckboxItemClassName, className)}
      data-inset={inset}
      data-slot={CONTEXT_MENU_SLOTS.checkboxItem}
    >
      <span
        className={contextMenuCheckboxItemIndicatorClassName}
        data-slot={CONTEXT_MENU_SLOTS.checkboxItemIndicator}
      >
        <ContextMenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </ContextMenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

function ContextMenuRadioGroup({ ...props }: ContextMenuRadioGroupProps) {
  return (
    <ContextMenuPrimitive.RadioGroup
      {...props}
      data-slot={CONTEXT_MENU_SLOTS.radioGroup}
    />
  );
}

function ContextMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: ContextMenuRadioItemProps) {
  return (
    <ContextMenuPrimitive.RadioItem
      {...props}
      className={cn(contextMenuRadioItemClassName, className)}
      data-inset={inset}
      data-slot={CONTEXT_MENU_SLOTS.radioItem}
    >
      <span
        className={contextMenuRadioItemIndicatorClassName}
        data-slot={CONTEXT_MENU_SLOTS.radioItemIndicator}
      >
        <ContextMenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </ContextMenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

function ContextMenuSeparator({
  className,
  ...props
}: ContextMenuSeparatorProps) {
  return (
    <ContextMenuPrimitive.Separator
      {...props}
      className={cn(contextMenuSeparatorClassName, className)}
      data-slot={CONTEXT_MENU_SLOTS.separator}
    />
  );
}

function ContextMenuShortcut({
  className,
  ...props
}: ContextMenuShortcutProps) {
  return (
    <span
      {...props}
      className={cn(contextMenuShortcutClassName, className)}
      data-slot={CONTEXT_MENU_SLOTS.shortcut}
    />
  );
}

export type { ContextMenuSlot } from "./context-menu.contract.js";
export type {
  ContextMenuCheckboxItemProps,
  ContextMenuContentProps,
  ContextMenuGroupProps,
  ContextMenuItemProps,
  ContextMenuLabelProps,
  ContextMenuPortalProps,
  ContextMenuProps,
  ContextMenuRadioGroupProps,
  ContextMenuRadioItemProps,
  ContextMenuSeparatorProps,
  ContextMenuShortcutProps,
  ContextMenuSubContentProps,
  ContextMenuSubProps,
  ContextMenuSubTriggerProps,
  ContextMenuTriggerProps,
};
export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};
