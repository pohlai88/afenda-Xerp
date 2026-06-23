"use client";

import type { GovernedCommandProps, SlotRole } from "@afenda/ui/governance";
import { createGovernedSpanSlot } from "@afenda/ui/governance/create-governed-slot";
import {
  applyGovernedPresentation,
  mergeGovernedPresentation,
} from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";

import { Command as CommandPrimitive } from "cmdk";
import { CheckIcon, SearchIcon, XIcon } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import * as React from "react";
import { Button } from "./button";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "./dialog";
import { InputGroup, InputGroupAddon } from "./input-group";

const COMMAND_RECIPE_NAME = "surface" as const;
const DIALOG_RECIPE_NAME = "surface" as const;

const COMMAND_SLOT_ROLES = {
  root: "root",
  body: "body",
  control: "control",
  content: "content",
  state: "state",
  label: "label",
  footer: "footer",
  actions: "actions",
  header: "header",
} as const satisfies Record<string, SlotRole>;

const CommandShortcut = createGovernedSpanSlot("CommandShortcut", {
  componentName: "Command",
  recipeName: COMMAND_RECIPE_NAME,
  slot: COMMAND_SLOT_ROLES.header,
});

export interface CommandProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof CommandPrimitive>,
      "className"
    >,
    GovernedCommandProps {
  readonly className?: string;
}

const Command = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive>,
  CommandProps
>(({ className, state, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Command",
    recipeName: COMMAND_RECIPE_NAME,
    slot: COMMAND_SLOT_ROLES.root,
    state,
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
  const contentExtension = resolvePrimitiveGovernance({
    componentName: "Command",
    recipeName: COMMAND_RECIPE_NAME,
    slotKey: "dialog-content",
    className,
  });

  const dialogRoot = resolvePrimitiveGovernance({
    componentName: "Dialog",
    recipeName: DIALOG_RECIPE_NAME,
    slot: "root",
  });

  const mergedPanel = mergeGovernedPresentation(dialogRoot, contentExtension);

  const dialogHeaderSr = resolvePrimitiveGovernance({
    componentName: "Command",
    recipeName: COMMAND_RECIPE_NAME,
    slotKey: "dialog-header-sr",
  });

  const closeButton = resolvePrimitiveGovernance({
    componentName: "Dialog",
    recipeName: DIALOG_RECIPE_NAME,
    slotKey: "close-button",
  });

  const closeLabel = resolvePrimitiveGovernance({
    componentName: "Dialog",
    recipeName: DIALOG_RECIPE_NAME,
    slotKey: "close-label",
  });

  return (
    <Dialog {...props}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          {...applyGovernedPresentation({}, mergedPanel)}
        >
          <div {...applyGovernedPresentation({}, dialogHeaderSr)}>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
          </div>
          <Command>{children}</Command>
          {showCloseButton ? (
            <div {...applyGovernedPresentation({}, closeButton)}>
              <DialogPrimitive.Close asChild>
                <Button
                  emphasis="ghost"
                  intent="quiet"
                  presentation="icon"
                  size="sm"
                >
                  <XIcon aria-hidden="true" />
                  <span {...applyGovernedPresentation({}, closeLabel)}>
                    Close
                  </span>
                </Button>
              </DialogPrimitive.Close>
            </div>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPortal>
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
    slot: COMMAND_SLOT_ROLES.body,
  });

  const inputGroupShell = resolvePrimitiveGovernance({
    componentName: "Command",
    recipeName: COMMAND_RECIPE_NAME,
    slotKey: "input-group-shell",
  });

  const governed = resolvePrimitiveGovernance({
    componentName: "Command",
    recipeName: COMMAND_RECIPE_NAME,
    slot: COMMAND_SLOT_ROLES.control,
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
          <SearchIcon
            aria-hidden="true"
            {...applyGovernedPresentation({}, icon)}
          />
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
    slot: COMMAND_SLOT_ROLES.content,
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
    slot: COMMAND_SLOT_ROLES.state,
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
    slot: COMMAND_SLOT_ROLES.label,
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
    slot: COMMAND_SLOT_ROLES.footer,
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
    slot: COMMAND_SLOT_ROLES.actions,
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
      <CheckIcon aria-hidden="true" {...applyGovernedPresentation({}, check)} />
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
