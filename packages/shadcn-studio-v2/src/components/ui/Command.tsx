"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { CheckIcon, SearchIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface CommandProps
  extends Omit<ComponentProps<typeof ComboboxPrimitive.Root>, "className"> {
  readonly className?: string | undefined;
}
export interface CommandInputProps
  extends Omit<ComponentProps<typeof ComboboxPrimitive.Input>, "className"> {
  readonly className?: string | undefined;
}
export interface CommandListProps
  extends Omit<ComponentProps<typeof ComboboxPrimitive.List>, "className"> {
  readonly className?: string | undefined;
}
export interface CommandEmptyProps extends ComponentProps<"div"> {}
export interface CommandGroupProps
  extends Omit<ComponentProps<typeof ComboboxPrimitive.Group>, "className"> {
  readonly className?: string | undefined;
}
export interface CommandItemProps
  extends Omit<ComponentProps<typeof ComboboxPrimitive.Item>, "className"> {
  readonly className?: string | undefined;
}
export interface CommandSeparatorProps extends ComponentProps<"div"> {}
export interface CommandShortcutProps extends ComponentProps<"span"> {}

const COMMAND_CLASS =
  "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground";
const COMMAND_INPUT_CLASS =
  "flex h-10 w-full rounded-md bg-transparent py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
const COMMAND_LIST_CLASS = "max-h-[300px] overflow-y-auto overflow-x-hidden";
const COMMAND_GROUP_CLASS = "overflow-hidden p-1 text-foreground";
const COMMAND_ITEM_CLASS =
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50";

export function commandClassName({
  className,
}: Pick<CommandProps, "className"> = {}): string {
  return cn(COMMAND_CLASS, className);
}

export function commandInputClassName({
  className,
}: Pick<CommandInputProps, "className"> = {}): string {
  return cn(COMMAND_INPUT_CLASS, className);
}

export function commandListClassName({
  className,
}: Pick<CommandListProps, "className"> = {}): string {
  return cn(COMMAND_LIST_CLASS, className);
}

export function commandGroupClassName({
  className,
}: Pick<CommandGroupProps, "className"> = {}): string {
  return cn(COMMAND_GROUP_CLASS, className);
}

export function commandItemClassName({
  className,
}: Pick<CommandItemProps, "className"> = {}): string {
  return cn(COMMAND_ITEM_CLASS, className);
}

export function Command({ children, className, ...props }: CommandProps) {
  return (
    <ComboboxPrimitive.Root {...props} data-slot="command">
      <div className={commandClassName({ className })}>{children}</div>
    </ComboboxPrimitive.Root>
  );
}

export function CommandInput({ className, ...props }: CommandInputProps) {
  return (
    <div
      className="flex items-center border-border border-b px-3"
      data-slot="command-input-wrapper"
    >
      <SearchIcon
        aria-hidden="true"
        className="mr-2 size-4 shrink-0 opacity-50"
      />
      <ComboboxPrimitive.Input
        {...props}
        className={commandInputClassName({ className })}
        data-slot="command-input"
      />
    </div>
  );
}

export function CommandList({ className, ...props }: CommandListProps) {
  return (
    <ComboboxPrimitive.List
      {...props}
      className={commandListClassName({ className })}
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
      className={commandGroupClassName({ className })}
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
      className={commandItemClassName({ className })}
      data-slot="command-item"
    >
      <span className="flex size-4 items-center justify-center">
        <ComboboxPrimitive.ItemIndicator data-slot="command-item-indicator">
          <CheckIcon aria-hidden="true" className="size-4" />
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
