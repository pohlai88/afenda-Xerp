// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { ChevronDownIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface NavigationMenuProps
  extends ComponentProps<typeof NavigationMenuPrimitive.Root> {}
export interface NavigationMenuListProps
  extends ComponentProps<typeof NavigationMenuPrimitive.List> {}
export interface NavigationMenuItemProps
  extends ComponentProps<typeof NavigationMenuPrimitive.Item> {}
export interface NavigationMenuTriggerProps
  extends ComponentProps<typeof NavigationMenuPrimitive.Trigger> {}
export interface NavigationMenuContentProps
  extends ComponentProps<typeof NavigationMenuPrimitive.Popup> {}
export interface NavigationMenuLinkProps
  extends ComponentProps<typeof NavigationMenuPrimitive.Link> {}
export interface NavigationMenuViewportProps
  extends ComponentProps<typeof NavigationMenuPrimitive.Viewport> {}

export function NavigationMenu({ className, ...props }: NavigationMenuProps) {
  return (
    <NavigationMenuPrimitive.Root
      {...props}
      className={cn(
        "relative z-10 flex max-w-max flex-1 items-center justify-center",
        typeof className === "string" ? className : undefined
      )}
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
      className={cn(
        "group flex flex-1 list-none items-center justify-center space-x-1",
        typeof className === "string" ? className : undefined
      )}
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
      className={cn(
        "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 font-medium text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
        typeof className === "string" ? className : undefined
      )}
      data-slot="navigation-menu-trigger"
    >
      {children}
      <ChevronDownIcon className="relative top-px ml-1 size-3 transition duration-200 group-data-[popup-open]:rotate-180" />
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
      className={cn(
        "top-0 left-0 w-full p-2 md:absolute md:w-auto",
        typeof className === "string" ? className : undefined
      )}
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
      className={cn(
        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
        typeof className === "string" ? className : undefined
      )}
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
        className={cn(
          "relative mt-1.5 h-[var(--available-height)] w-full overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-lg md:w-[var(--available-width)]",
          typeof className === "string" ? className : undefined
        )}
        data-slot="navigation-menu-viewport"
      />
    </div>
  );
}
