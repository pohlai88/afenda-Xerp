import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { ChevronDownIcon } from "lucide-react";
import type * as React from "react";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/utils/utils";

import {
  NAVIGATION_MENU_SLOTS,
  navigationMenuContentClassName,
  navigationMenuIndicatorClassName,
  navigationMenuIndicatorMarkerClassName,
  navigationMenuItemClassName,
  navigationMenuLinkClassName,
  navigationMenuListClassName,
  navigationMenuPopupClassName,
  navigationMenuPositionerClassName,
  navigationMenuRootClassName,
  navigationMenuTriggerIconClassName,
  navigationMenuTriggerStyle,
  navigationMenuViewportClassName,
} from "./navigation-menu.contract.js";

type NavigationMenuProps = WithoutGovernedDataSlot<
  NavigationMenuPrimitive.Root.Props &
    Pick<NavigationMenuPrimitive.Positioner.Props, "align">
>;
type NavigationMenuListProps = WithoutGovernedDataSlot<
  React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.List>
>;
type NavigationMenuItemProps = WithoutGovernedDataSlot<
  React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Item>
>;
type NavigationMenuTriggerProps =
  WithoutGovernedDataSlot<NavigationMenuPrimitive.Trigger.Props>;
type NavigationMenuContentProps =
  WithoutGovernedDataSlot<NavigationMenuPrimitive.Content.Props>;
type NavigationMenuPositionerProps =
  WithoutGovernedDataSlot<NavigationMenuPrimitive.Positioner.Props>;
type NavigationMenuLinkProps =
  WithoutGovernedDataSlot<NavigationMenuPrimitive.Link.Props>;
type NavigationMenuIndicatorProps = WithoutGovernedDataSlot<
  React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Icon>
>;

function NavigationMenu({
  align = "start",
  className,
  children,
  ...props
}: NavigationMenuProps) {
  return (
    <NavigationMenuPrimitive.Root
      {...props}
      className={cn(navigationMenuRootClassName, className)}
      data-slot={NAVIGATION_MENU_SLOTS.root}
    >
      {children}
      <NavigationMenuPositioner align={align} />
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({ className, ...props }: NavigationMenuListProps) {
  return (
    <NavigationMenuPrimitive.List
      {...props}
      className={cn(navigationMenuListClassName, className)}
      data-slot={NAVIGATION_MENU_SLOTS.list}
    />
  );
}

function NavigationMenuItem({ className, ...props }: NavigationMenuItemProps) {
  return (
    <NavigationMenuPrimitive.Item
      {...props}
      className={cn(navigationMenuItemClassName, className)}
      data-slot={NAVIGATION_MENU_SLOTS.item}
    />
  );
}

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: NavigationMenuTriggerProps) {
  return (
    <NavigationMenuPrimitive.Trigger
      {...props}
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      data-slot={NAVIGATION_MENU_SLOTS.trigger}
    >
      {children}{" "}
      <ChevronDownIcon
        aria-hidden="true"
        className={navigationMenuTriggerIconClassName}
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  ...props
}: NavigationMenuContentProps) {
  return (
    <NavigationMenuPrimitive.Content
      {...props}
      className={cn(navigationMenuContentClassName, className)}
      data-slot={NAVIGATION_MENU_SLOTS.content}
    />
  );
}

function NavigationMenuPositioner({
  className,
  side = "bottom",
  sideOffset = 8,
  align = "start",
  alignOffset = 0,
  ...props
}: NavigationMenuPositionerProps) {
  return (
    <NavigationMenuPrimitive.Portal data-slot={NAVIGATION_MENU_SLOTS.portal}>
      <NavigationMenuPrimitive.Positioner
        {...props}
        align={align}
        alignOffset={alignOffset}
        className={cn(navigationMenuPositionerClassName, className)}
        data-slot={NAVIGATION_MENU_SLOTS.positioner}
        side={side}
        sideOffset={sideOffset}
      >
        <NavigationMenuPrimitive.Popup
          className={navigationMenuPopupClassName}
          data-slot={NAVIGATION_MENU_SLOTS.popup}
        >
          <NavigationMenuPrimitive.Viewport
            className={navigationMenuViewportClassName}
            data-slot={NAVIGATION_MENU_SLOTS.viewport}
          />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  );
}

function NavigationMenuLink({ className, ...props }: NavigationMenuLinkProps) {
  return (
    <NavigationMenuPrimitive.Link
      {...props}
      className={cn(navigationMenuLinkClassName, className)}
      data-slot={NAVIGATION_MENU_SLOTS.link}
    />
  );
}

function NavigationMenuIndicator({
  className,
  ...props
}: NavigationMenuIndicatorProps) {
  return (
    <NavigationMenuPrimitive.Icon
      {...props}
      className={cn(navigationMenuIndicatorClassName, className)}
      data-slot={NAVIGATION_MENU_SLOTS.indicator}
    >
      <div className={navigationMenuIndicatorMarkerClassName} />
    </NavigationMenuPrimitive.Icon>
  );
}

export type { NavigationMenuSlot } from "./navigation-menu.contract.js";
export type {
  NavigationMenuContentProps,
  NavigationMenuIndicatorProps,
  NavigationMenuItemProps,
  NavigationMenuLinkProps,
  NavigationMenuListProps,
  NavigationMenuPositionerProps,
  NavigationMenuProps,
  NavigationMenuTriggerProps,
};
export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPositioner,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
};
