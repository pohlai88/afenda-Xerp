"use client";

import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { ChevronDownIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface NavigationMenuProps
  extends Omit<
    ComponentProps<typeof NavigationMenuPrimitive.Root>,
    "className"
  > {
  readonly className?: string | undefined;
}
export interface NavigationMenuListProps
  extends Omit<
    ComponentProps<typeof NavigationMenuPrimitive.List>,
    "className"
  > {
  readonly className?: string | undefined;
}
export interface NavigationMenuItemProps
  extends ComponentProps<typeof NavigationMenuPrimitive.Item> {}
export interface NavigationMenuTriggerProps
  extends Omit<
    ComponentProps<typeof NavigationMenuPrimitive.Trigger>,
    "className"
  > {
  readonly className?: string | undefined;
}
export interface NavigationMenuContentProps
  extends Omit<
    ComponentProps<typeof NavigationMenuPrimitive.Popup>,
    "className"
  > {
  readonly className?: string | undefined;
}
export interface NavigationMenuLinkProps
  extends Omit<
    ComponentProps<typeof NavigationMenuPrimitive.Link>,
    "className"
  > {
  readonly className?: string | undefined;
}
export interface NavigationMenuViewportProps
  extends Omit<
    ComponentProps<typeof NavigationMenuPrimitive.Viewport>,
    "className"
  > {
  readonly className?: string | undefined;
}

const NAVIGATION_MENU_BASE_CLASS =
  "relative z-10 flex max-w-max flex-1 items-center justify-center";
const NAVIGATION_MENU_LIST_CLASS =
  "group flex flex-1 list-none items-center justify-center space-x-1";
const NAVIGATION_MENU_TRIGGER_CLASS =
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 font-medium text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[popup-open]:bg-accent/50 data-[popup-open]:text-accent-foreground";
const NAVIGATION_MENU_CONTENT_CLASS =
  "top-0 left-0 w-full p-2 outline-none md:absolute md:w-auto";
const NAVIGATION_MENU_LINK_CLASS =
  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground";
const NAVIGATION_MENU_VIEWPORT_CLASS =
  "relative mt-1.5 h-[var(--available-height)] w-full overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-lg md:w-[var(--available-width)]";

export function navigationMenuClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(NAVIGATION_MENU_BASE_CLASS, className);
}

export function navigationMenuListClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(NAVIGATION_MENU_LIST_CLASS, className);
}

export function navigationMenuTriggerClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(NAVIGATION_MENU_TRIGGER_CLASS, className);
}

export function navigationMenuContentClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(NAVIGATION_MENU_CONTENT_CLASS, className);
}

export function navigationMenuLinkClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(NAVIGATION_MENU_LINK_CLASS, className);
}

export function navigationMenuViewportClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn(NAVIGATION_MENU_VIEWPORT_CLASS, className);
}

export function NavigationMenu({ className, ...props }: NavigationMenuProps) {
  return (
    <NavigationMenuPrimitive.Root
      {...props}
      className={navigationMenuClassName({ className })}
      data-slot="navigation-menu"
    />
  );
}

export function NavigationMenuList({
  className,
  ...props
}: NavigationMenuListProps) {
  return (
    <NavigationMenuPrimitive.List
      {...props}
      className={navigationMenuListClassName({ className })}
      data-slot="navigation-menu-list"
    />
  );
}

export function NavigationMenuItem({ ...props }: NavigationMenuItemProps) {
  return (
    <NavigationMenuPrimitive.Item {...props} data-slot="navigation-menu-item" />
  );
}

export function NavigationMenuTrigger({
  children,
  className,
  ...props
}: NavigationMenuTriggerProps) {
  return (
    <NavigationMenuPrimitive.Trigger
      {...props}
      className={navigationMenuTriggerClassName({ className })}
      data-slot="navigation-menu-trigger"
    >
      {children}
      <span className="relative top-px ml-1 inline-flex transition duration-200 group-data-[popup-open]:rotate-180">
        <ChevronDownIcon aria-hidden="true" className="size-3" />
      </span>
    </NavigationMenuPrimitive.Trigger>
  );
}

export function NavigationMenuContent({
  className,
  ...props
}: NavigationMenuContentProps) {
  return (
    <NavigationMenuPrimitive.Popup
      {...props}
      className={navigationMenuContentClassName({ className })}
      data-slot="navigation-menu-content"
    />
  );
}

export function NavigationMenuLink({
  className,
  ...props
}: NavigationMenuLinkProps) {
  return (
    <NavigationMenuPrimitive.Link
      {...props}
      className={navigationMenuLinkClassName({ className })}
      data-slot="navigation-menu-link"
    />
  );
}

export function NavigationMenuViewport({
  className,
  ...props
}: NavigationMenuViewportProps) {
  return (
    <div className="absolute top-full left-0 flex justify-center">
      <NavigationMenuPrimitive.Viewport
        {...props}
        className={navigationMenuViewportClassName({ className })}
        data-slot="navigation-menu-viewport"
      />
    </div>
  );
}
