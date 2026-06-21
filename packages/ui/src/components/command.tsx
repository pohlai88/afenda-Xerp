"use client";

import { createGovernedSpanSlot } from "@afenda/ui/governance/create-governed-slot";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";

import { cn } from "@afenda/ui/lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import { CheckIcon, SearchIcon } from "lucide-react";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { InputGroup, InputGroupAddon } from "./input-group";

const COMMAND_RECIPE_NAME = "surface" as const;

const CommandShortcut = createGovernedSpanSlot("CommandShortcut", {
  componentName: "Command",
  recipeName: COMMAND_RECIPE_NAME,
  slot: "header",
});

const Command = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive>,
  Omit<React.ComponentPropsWithoutRef<typeof CommandPrimitive>, "className"> & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Command",
    recipeName: COMMAND_RECIPE_NAME,
    slot: "root",
    className,
  });

  return (
    <CommandPrimitive
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

Command.displayName = "Command";

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = false,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  readonly title?: string;
  readonly description?: string;
  readonly className?: string;
  readonly showCloseButton?: boolean;
}) {
  const contentClass = resolvePrimitiveGovernance({
    componentName: "Command",
    recipeName: COMMAND_RECIPE_NAME,
    slotKey: "dialog-content",
    className,
  });

  const dialogHeaderSr = resolvePrimitiveGovernance({
    componentName: "Command",
    recipeName: COMMAND_RECIPE_NAME,
    slotKey: "dialog-header-sr",
  });

  return (
    <Dialog {...props}>
      <DialogHeader className={dialogHeaderSr.className}>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(contentClass.className)}
        showCloseButton={showCloseButton}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

const CommandInput = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Input>,
  Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const wrapper = resolvePrimitiveGovernance({
    componentName: "Command",
    recipeName: COMMAND_RECIPE_NAME,
    slot: "body",
  });

  const inputGroupShell = resolvePrimitiveGovernance({
    componentName: "Command",
    recipeName: COMMAND_RECIPE_NAME,
    slotKey: "input-group-shell",
  });

  const governed = resolvePrimitiveGovernance({
    componentName: "Command",
    recipeName: COMMAND_RECIPE_NAME,
    slot: "control",
    className,
  });

  const icon = resolvePrimitiveGovernance({
    componentName: "Command",
    recipeName: COMMAND_RECIPE_NAME,
    slotKey: "input-search-icon",
  });

  return (
    <div {...applyGovernedPresentation({}, wrapper)}>
      <InputGroup {...applyGovernedPresentation({}, inputGroupShell)}>
        <CommandPrimitive.Input
          ref={ref}
          {...applyGovernedPresentation(props, governed)}
        />
        <InputGroupAddon>
          <SearchIcon {...applyGovernedPresentation({}, icon)} />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
});

CommandInput.displayName = "CommandInput";

const CommandList = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.List>,
  Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Command",
    recipeName: COMMAND_RECIPE_NAME,
    slot: "content",
    className,
  });

  return (
    <CommandPrimitive.List
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

CommandList.displayName = "CommandList";

const CommandEmpty = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Empty>,
  Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Command",
    recipeName: COMMAND_RECIPE_NAME,
    slot: "state",
    className,
  });

  return (
    <CommandPrimitive.Empty
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

CommandEmpty.displayName = "CommandEmpty";

const CommandGroup = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Group>,
  Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Command",
    recipeName: COMMAND_RECIPE_NAME,
    slot: "label",
    className,
  });

  return (
    <CommandPrimitive.Group
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

CommandGroup.displayName = "CommandGroup";

const CommandSeparator = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Separator>,
  Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Command",
    recipeName: COMMAND_RECIPE_NAME,
    slot: "footer",
    className,
  });

  return (
    <CommandPrimitive.Separator
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

CommandSeparator.displayName = "CommandSeparator";

const CommandItem = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Item>,
  Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>,
    "className"
  > & {
    readonly className?: string;
  }
>(({ className, children, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Command",
    recipeName: COMMAND_RECIPE_NAME,
    slot: "actions",
    className,
  });

  const check = resolvePrimitiveGovernance({
    componentName: "Command",
    recipeName: COMMAND_RECIPE_NAME,
    slotKey: "item-check",
  });

  return (
    <CommandPrimitive.Item
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    >
      {children}
      <CheckIcon {...applyGovernedPresentation({}, check)} />
    </CommandPrimitive.Item>
  );
});

CommandItem.displayName = "CommandItem";

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
