"use client";

import type { GovernedComboboxProps, SlotRole } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
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

const COMBOBOX_SLOT_ROLES = {
  root: "root",
  body: "body",
  content: "content",
  control: "control",
  state: "state",
  footer: "footer",
  label: "label",
  actions: "actions",
  header: "header",
  icon: "icon",
} as const satisfies Record<string, SlotRole>;

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

const Combobox = Object.assign(ComboboxPrimitive.Root, {
  displayName: "Combobox",
});

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  const governed = comboboxGovernance({
    slotKey: "value",
  });

  return (
    <ComboboxPrimitive.Value {...applyGovernedPresentation(props, governed)} />
  );
}
ComboboxValue.displayName = "ComboboxValue";

const ComboboxTrigger = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Trigger>,
  ComboboxPrimitive.Trigger.Props
>(({ className, children, ...props }, ref) => {
  const governed = comboboxGovernance({
    slot: COMBOBOX_SLOT_ROLES.root,
    className: comboboxStringClassName(className),
  });

  const chevron = comboboxGovernance({
    slotKey: "trigger-chevron",
  });

  return (
    <ComboboxPrimitive.Trigger
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    >
      {children}
      <ChevronDownIcon
        aria-hidden="true"
        {...applyGovernedPresentation({}, chevron)}
      />
    </ComboboxPrimitive.Trigger>
  );
});
ComboboxTrigger.displayName = "ComboboxTrigger";

const ComboboxClear = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Clear>,
  ComboboxPrimitive.Clear.Props
>(({ className, ...props }, ref) => {
  const governed = comboboxGovernance({
    slotKey: "clear",
    className: comboboxStringClassName(className),
  });

  const clearIcon = comboboxGovernance({ slotKey: "clear-icon" });

  return (
    <ComboboxPrimitive.Clear
      ref={ref}
      render={<InputGroupButton emphasis="ghost" size="icon-xs" />}
      {...applyGovernedPresentation(props, governed)}
    >
      <XIcon aria-hidden="true" {...applyGovernedPresentation({}, clearIcon)} />
    </ComboboxPrimitive.Clear>
  );
});
ComboboxClear.displayName = "ComboboxClear";

const ComboboxInput = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Input>,
  ComboboxPrimitive.Input.Props & {
    readonly showTrigger?: boolean;
    readonly showClear?: boolean;
  }
>(
  (
    {
      className,
      children,
      disabled = false,
      showTrigger = true,
      showClear = false,
      ...props
    },
    ref
  ) => {
    const shell = comboboxGovernance({
      slotKey: "input-group-shell",
      className: comboboxStringClassName(className),
    });

    const triggerButton = comboboxGovernance({
      slotKey: "input-group-button",
    });

    return (
      <InputGroup {...applyGovernedPresentation({}, shell)}>
        <ComboboxPrimitive.Input
          ref={ref}
          render={<InputGroupInput disabled={disabled} />}
          {...props}
        />
        <InputGroupAddon align="inline-end">
          {showTrigger ? (
            <span {...applyGovernedPresentation({}, triggerButton)}>
              <InputGroupButton
                asChild
                disabled={disabled}
                emphasis="ghost"
                size="icon-xs"
              >
                <ComboboxTrigger />
              </InputGroupButton>
            </span>
          ) : null}
          {showClear ? <ComboboxClear disabled={disabled} /> : null}
        </InputGroupAddon>
        {children}
      </InputGroup>
    );
  }
);
ComboboxInput.displayName = "ComboboxInput";

const ComboboxContent = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Popup>,
  ComboboxPrimitive.Popup.Props &
    GovernedComboboxProps &
    Pick<
      ComboboxPrimitive.Positioner.Props,
      "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
    >
>(
  (
    {
      className,
      side = "bottom",
      sideOffset = 6,
      align = "start",
      alignOffset = 0,
      anchor,
      state,
      ...props
    },
    ref
  ) => {
    const positioner = comboboxGovernance({
      slotKey: "positioner",
    });

    const governed = comboboxGovernance({
      slot: COMBOBOX_SLOT_ROLES.body,
      state,
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
          {...applyGovernedPresentation({}, positioner)}
        >
          <ComboboxPrimitive.Popup
            ref={ref}
            {...applyGovernedPresentation(props, governed, {
              "data-chips": !!anchor,
            })}
          />
        </ComboboxPrimitive.Positioner>
      </ComboboxPrimitive.Portal>
    );
  }
);
ComboboxContent.displayName = "ComboboxContent";

const ComboboxList = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.List>,
  ComboboxPrimitive.List.Props
>(({ className, ...props }, ref) => {
  const governed = comboboxGovernance({
    slot: COMBOBOX_SLOT_ROLES.content,
    className: comboboxStringClassName(className),
  });

  return (
    <ComboboxPrimitive.List
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});
ComboboxList.displayName = "ComboboxList";

const ComboboxItem = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Item>,
  ComboboxPrimitive.Item.Props
>(({ className, children, ...props }, ref) => {
  const governed = comboboxGovernance({
    slot: COMBOBOX_SLOT_ROLES.control,
    className: comboboxStringClassName(className),
  });

  const indicator = comboboxGovernance({
    slotKey: "item-indicator",
  });

  const checkIcon = comboboxGovernance({ slotKey: "check-icon" });

  return (
    <ComboboxPrimitive.Item
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        render={<span {...applyGovernedPresentation({}, indicator)} />}
      >
        <CheckIcon
          aria-hidden="true"
          {...applyGovernedPresentation({}, checkIcon)}
        />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
});
ComboboxItem.displayName = "ComboboxItem";

const ComboboxGroup = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Group>,
  ComboboxPrimitive.Group.Props
>(({ className, ...props }, ref) => {
  const governed = comboboxGovernance({
    slotKey: "group",
    className: comboboxStringClassName(className),
  });

  return (
    <ComboboxPrimitive.Group
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});
ComboboxGroup.displayName = "ComboboxGroup";

const ComboboxLabel = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.GroupLabel>,
  ComboboxPrimitive.GroupLabel.Props
>(({ className, ...props }, ref) => {
  const governed = comboboxGovernance({
    slot: COMBOBOX_SLOT_ROLES.state,
    className: comboboxStringClassName(className),
  });

  return (
    <ComboboxPrimitive.GroupLabel
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});
ComboboxLabel.displayName = "ComboboxLabel";

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
ComboboxCollection.displayName = "ComboboxCollection";

const ComboboxEmpty = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Empty>,
  ComboboxPrimitive.Empty.Props
>(({ className, ...props }, ref) => {
  const governed = comboboxGovernance({
    slot: COMBOBOX_SLOT_ROLES.label,
    className: comboboxStringClassName(className),
  });

  return (
    <ComboboxPrimitive.Empty
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});
ComboboxEmpty.displayName = "ComboboxEmpty";

const ComboboxSeparator = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Separator>,
  ComboboxPrimitive.Separator.Props
>(({ className, ...props }, ref) => {
  const governed = comboboxGovernance({
    slot: COMBOBOX_SLOT_ROLES.footer,
    className: comboboxStringClassName(className),
  });

  return (
    <ComboboxPrimitive.Separator
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});
ComboboxSeparator.displayName = "ComboboxSeparator";

const ComboboxChips = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Chips>,
  ComboboxPrimitive.Chips.Props
>(({ className, ...props }, ref) => {
  const governed = comboboxGovernance({
    slot: COMBOBOX_SLOT_ROLES.actions,
    className: comboboxStringClassName(className),
  });

  return (
    <ComboboxPrimitive.Chips
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});
ComboboxChips.displayName = "ComboboxChips";

const ComboboxChip = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Chip>,
  ComboboxPrimitive.Chip.Props & {
    readonly showRemove?: boolean;
  }
>(({ className, children, showRemove = true, ...props }, ref) => {
  const governed = comboboxGovernance({
    slot: COMBOBOX_SLOT_ROLES.header,
    className: comboboxStringClassName(className),
  });

  const remove = comboboxGovernance({
    slotKey: "chip-remove",
  });

  const chipRemoveIcon = comboboxGovernance({ slotKey: "chip-remove-icon" });

  return (
    <ComboboxPrimitive.Chip
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    >
      {children}
      {showRemove ? (
        <span {...applyGovernedPresentation({}, remove)}>
          <ComboboxPrimitive.ChipRemove
            render={
              <Button
                aria-label="Remove"
                emphasis="ghost"
                intent="quiet"
                presentation="icon"
                size="xs"
              />
            }
          >
            <XIcon
              aria-hidden="true"
              {...applyGovernedPresentation({}, chipRemoveIcon)}
            />
          </ComboboxPrimitive.ChipRemove>
        </span>
      ) : null}
    </ComboboxPrimitive.Chip>
  );
});
ComboboxChip.displayName = "ComboboxChip";

const ComboboxChipsInput = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Input>,
  ComboboxPrimitive.Input.Props
>(({ className, ...props }, ref) => {
  const governed = comboboxGovernance({
    slot: COMBOBOX_SLOT_ROLES.icon,
    className: comboboxStringClassName(className),
  });

  return (
    <ComboboxPrimitive.Input
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});
ComboboxChipsInput.displayName = "ComboboxChipsInput";

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
