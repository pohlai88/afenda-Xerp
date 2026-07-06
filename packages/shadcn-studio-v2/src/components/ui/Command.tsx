// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { CheckIcon, SearchIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface CommandProps
  extends ComponentProps<typeof ComboboxPrimitive.Root> {}
export interface CommandInputProps
  extends ComponentProps<typeof ComboboxPrimitive.Input> {}
export interface CommandListProps
  extends ComponentProps<typeof ComboboxPrimitive.List> {}
export interface CommandEmptyProps extends ComponentProps<"div"> {}
export interface CommandGroupProps
  extends ComponentProps<typeof ComboboxPrimitive.Group> {}
export interface CommandItemProps
  extends ComponentProps<typeof ComboboxPrimitive.Item> {}
export interface CommandSeparatorProps extends ComponentProps<"div"> {}
export interface CommandShortcutProps extends ComponentProps<"span"> {}

export function Command({ className, ...props }: CommandProps) {
  return (
    <ComboboxPrimitive.Root
      {...props}
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
        typeof className === "string" ? className : undefined
      )}
      data-slot="command"
    />
  );
}

export function CommandInput({ className, ...props }: CommandInputProps) {
  return (
    <div
      className="flex items-center border-border border-b px-3"
      data-slot="command-input-wrapper"
    >
      <SearchIcon className="mr-2 size-4 shrink-0 opacity-50" />
      <ComboboxPrimitive.Input
        {...props}
        className={cn(
          "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          typeof className === "string" ? className : undefined
        )}
        data-slot="command-input"
      />
    </div>
  );
}

export function CommandList({ className, ...props }: CommandListProps) {
  return (
    <ComboboxPrimitive.List
      {...props}
      className={cn(
        "max-h-[300px] overflow-y-auto overflow-x-hidden",
        typeof className === "string" ? className : undefined
      )}
      data-slot="command-list"
    />
  );
}

export function CommandEmpty({ className, ...props }: CommandEmptyProps) {
  return (
    <div
      {...props}
      className={cn("py-6 text-center text-sm", className)}
      data-slot="command-empty"
    />
  );
}

export function CommandGroup({ className, ...props }: CommandGroupProps) {
  return (
    <ComboboxPrimitive.Group
      {...props}
      className={cn(
        "overflow-hidden p-1 text-foreground",
        typeof className === "string" ? className : undefined
      )}
      data-slot="command-group"
    />
  );
}

export function CommandItem({
  children,
  className,
  ...props
}: CommandItemProps) {
  return (
    <ComboboxPrimitive.Item
      {...props}
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50",
        typeof className === "string" ? className : undefined
      )}
      data-slot="command-item"
    >
      <span className="flex size-4 items-center justify-center">
        <ComboboxPrimitive.ItemIndicator data-slot="command-item-indicator">
          <CheckIcon className="size-4" />
        </ComboboxPrimitive.ItemIndicator>
      </span>
      {children}
    </ComboboxPrimitive.Item>
  );
}

export function CommandSeparator({
  className,
  ...props
}: CommandSeparatorProps) {
  return (
    <div
      {...props}
      className={cn("-mx-1 h-px bg-border", className)}
      data-slot="command-separator"
    />
  );
}

export function CommandShortcut({ className, ...props }: CommandShortcutProps) {
  return (
    <span
      {...props}
      className={cn(
        "ml-auto text-muted-foreground text-xs tracking-widest",
        className
      )}
      data-slot="command-shortcut"
    />
  );
}
