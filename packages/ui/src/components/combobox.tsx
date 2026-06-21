"use client";

import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { cn } from "@afenda/ui/lib/utils";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import * as React from "react";
import { Button } from "./button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./input-group";

const COMBOBOX_RECIPE_NAME = "surface" as const;

const Combobox = ComboboxPrimitive.Root;

type ComboboxClassName = string | undefined;

function comboboxGovernance(
  input: Omit<
    Parameters<typeof resolvePrimitiveGovernance>[0],
    "componentName"
  > & {
    readonly className?: ComboboxClassName;
  }
) {
  const { className, ...rest } = input;

  return resolvePrimitiveGovernance({
    componentName: "Combobox",
    recipeName: COMBOBOX_RECIPE_NAME,
    ...rest,
    ...(className === undefined ? {} : { className }),
  });
}

function comboboxStringClassName(className: unknown): ComboboxClassName {
  return typeof className === "string" ? className : undefined;
}

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  const governed = comboboxGovernance({
    slotKey: "value",
  });

  return (
    <ComboboxPrimitive.Value {...applyGovernedPresentation(props, governed)} />
  );
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props) {
  const governed = comboboxGovernance({
    slot: "root",
    className: comboboxStringClassName(className),
  });

  const chevron = comboboxGovernance({
    slotKey: "trigger-chevron",
  });

  return (
    <ComboboxPrimitive.Trigger {...applyGovernedPresentation(props, governed)}>
      {children}
      <ChevronDownIcon
        {...chevron.dataAttributes}
        className={cn(chevron.className)}
      />
    </ComboboxPrimitive.Trigger>
  );
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  const governed = comboboxGovernance({
    slotKey: "clear",
    className: comboboxStringClassName(className),
  });

  const clearIcon = comboboxGovernance({ slotKey: "clear-icon" });

  return (
    <ComboboxPrimitive.Clear
      render={<InputGroupButton emphasis="ghost" size="icon-xs" />}
      {...applyGovernedPresentation(props, governed)}
    >
      <XIcon
        {...clearIcon.dataAttributes}
        className={cn(clearIcon.className)}
      />
    </ComboboxPrimitive.Clear>
  );
}

function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}: ComboboxPrimitive.Input.Props & {
  readonly showTrigger?: boolean;
  readonly showClear?: boolean;
}) {
  const shell = comboboxGovernance({
    slotKey: "input-group-shell",
    className: comboboxStringClassName(className),
  });

  const triggerButton = comboboxGovernance({
    slotKey: "input-group-button",
  });

  return (
    <InputGroup {...shell.dataAttributes} className={cn(shell.className)}>
      <ComboboxPrimitive.Input
        render={<InputGroupInput disabled={disabled} />}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        {showTrigger ? (
          <InputGroupButton
            asChild
            data-slot="input-group-button"
            emphasis="ghost"
            size="icon-xs"
            {...triggerButton.dataAttributes}
            className={cn(triggerButton.className)}
            disabled={disabled}
          >
            <ComboboxTrigger />
          </InputGroupButton>
        ) : null}
        {showClear ? <ComboboxClear disabled={disabled} /> : null}
      </InputGroupAddon>
      {children}
    </InputGroup>
  );
}

function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
  >) {
  const positioner = comboboxGovernance({
    slotKey: "positioner",
  });

  const governed = comboboxGovernance({
    slot: "body",
    className: comboboxStringClassName(className),
  });

  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        side={side}
        sideOffset={sideOffset}
        {...positioner.dataAttributes}
        className={cn(positioner.className)}
      >
        <ComboboxPrimitive.Popup
          {...applyGovernedPresentation(props, governed, {
            "data-chips": !!anchor,
          })}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  const governed = comboboxGovernance({
    slot: "content",
    className: comboboxStringClassName(className),
  });

  return (
    <ComboboxPrimitive.List {...applyGovernedPresentation(props, governed)} />
  );
}

function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) {
  const governed = comboboxGovernance({
    slot: "control",
    className: comboboxStringClassName(className),
  });

  const indicator = comboboxGovernance({
    slotKey: "item-indicator",
  });

  const checkIcon = comboboxGovernance({ slotKey: "check-icon" });

  return (
    <ComboboxPrimitive.Item {...applyGovernedPresentation(props, governed)}>
      {children}
      <ComboboxPrimitive.ItemIndicator
        render={
          <span
            {...indicator.dataAttributes}
            className={cn(indicator.className)}
          />
        }
      >
        <CheckIcon
          {...checkIcon.dataAttributes}
          className={cn(checkIcon.className)}
        />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  const governed = comboboxGovernance({
    slotKey: "group",
    className: comboboxStringClassName(className),
  });

  return (
    <ComboboxPrimitive.Group {...applyGovernedPresentation(props, governed)} />
  );
}

function ComboboxLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) {
  const governed = comboboxGovernance({
    slot: "state",
    className: comboboxStringClassName(className),
  });

  return (
    <ComboboxPrimitive.GroupLabel
      {...applyGovernedPresentation(props, governed)}
    />
  );
}

function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
  const governed = comboboxGovernance({
    slotKey: "collection",
  });

  return (
    <ComboboxPrimitive.Collection
      {...applyGovernedPresentation(props, governed)}
    />
  );
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  const governed = comboboxGovernance({
    slot: "label",
    className: comboboxStringClassName(className),
  });

  return (
    <ComboboxPrimitive.Empty {...applyGovernedPresentation(props, governed)} />
  );
}

function ComboboxSeparator({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props) {
  const governed = comboboxGovernance({
    slot: "footer",
    className: comboboxStringClassName(className),
  });

  return (
    <ComboboxPrimitive.Separator
      {...applyGovernedPresentation(props, governed)}
    />
  );
}

function ComboboxChips({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> &
  ComboboxPrimitive.Chips.Props) {
  const governed = comboboxGovernance({
    slot: "actions",
    className: comboboxStringClassName(className),
  });

  return (
    <ComboboxPrimitive.Chips {...applyGovernedPresentation(props, governed)} />
  );
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  readonly showRemove?: boolean;
}) {
  const governed = comboboxGovernance({
    slot: "header",
    className: comboboxStringClassName(className),
  });

  const remove = comboboxGovernance({
    slotKey: "chip-remove",
  });

  const chipRemoveIcon = comboboxGovernance({ slotKey: "chip-remove-icon" });

  return (
    <ComboboxPrimitive.Chip {...applyGovernedPresentation(props, governed)}>
      {children}
      {showRemove ? (
        <ComboboxPrimitive.ChipRemove
          render={
            <Button
              emphasis="ghost"
              intent="quiet"
              presentation="icon"
              size="xs"
            />
          }
          {...remove.dataAttributes}
          className={cn(remove.className)}
          data-slot="combobox-chip-remove"
        >
          <XIcon
            {...chipRemoveIcon.dataAttributes}
            className={cn(chipRemoveIcon.className)}
          />
        </ComboboxPrimitive.ChipRemove>
      ) : null}
    </ComboboxPrimitive.Chip>
  );
}

function ComboboxChipsInput({
  className,
  ...props
}: ComboboxPrimitive.Input.Props) {
  const governed = comboboxGovernance({
    slot: "icon",
    className: comboboxStringClassName(className),
  });

  return (
    <ComboboxPrimitive.Input {...applyGovernedPresentation(props, governed)} />
  );
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null);
}

export {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
};
