"use client";

import * as React from "react";

import { cn } from "#/lib/utils";
import { Button } from "#/components/button";
import type { GovernedButtonProps } from "@/governance";
import { applyGovernedPresentation } from "#/governance/governed-render";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";
import { Input } from "#/components/input";
import { Textarea } from "#/components/textarea";

const INPUT_GROUP_RECIPE_NAME = "form-control" as const;

type InputGroupAddonAlign =
  | "inline-start"
  | "inline-end"
  | "block-start"
  | "block-end";

type InputGroupButtonSize = "xs" | "sm" | "icon-xs" | "icon-sm";

export interface InputGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "InputGroup",
      recipeName: INPUT_GROUP_RECIPE_NAME,
      slot: "root",
      className,
    });

    return (
      <div
        ref={ref}
        {...applyGovernedPresentation({ ...props, role: "group" }, governed)}
      />
    );
  }
);

InputGroup.displayName = "InputGroup";

interface InputGroupAddonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
  readonly align?: InputGroupAddonAlign;
}

const InputGroupAddon = React.forwardRef<HTMLDivElement, InputGroupAddonProps>(
  ({ className, align = "inline-start", ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "InputGroup",
      recipeName: INPUT_GROUP_RECIPE_NAME,
      slot: "control",
      slotKey: `addon-${align}`,
      className,
    });

    return (
      <div
        ref={ref}
        {...applyGovernedPresentation(
          {
            role: "group",
            onClick: (event: React.MouseEvent<HTMLDivElement>) => {
              if ((event.target as HTMLElement).closest("button")) {
                return;
              }
              event.currentTarget.parentElement?.querySelector("input")?.focus();
            },
            ...props,
          },
          governed,
          { "data-align": align }
        )}
      />
    );
  }
);

InputGroupAddon.displayName = "InputGroupAddon";

function resolveInputGroupButtonProps(
  size: InputGroupButtonSize
): Pick<GovernedButtonProps, "intent" | "emphasis" | "size" | "presentation"> {
  switch (size) {
    case "icon-xs":
      return {
        intent: "quiet",
        emphasis: "ghost",
        size: "xs",
        presentation: "icon",
      };
    case "icon-sm":
      return {
        intent: "quiet",
        emphasis: "ghost",
        size: "sm",
        presentation: "icon",
      };
    case "xs":
      return { intent: "quiet", emphasis: "ghost", size: "xs" };
    case "sm":
      return { intent: "quiet", emphasis: "ghost", size: "sm" };
  }
}

type InputGroupButtonProps = Omit<
  React.ComponentPropsWithoutRef<typeof Button>,
  "size" | "intent" | "emphasis"
> & {
  readonly size?: InputGroupButtonSize;
  readonly intent?: GovernedButtonProps["intent"];
  readonly emphasis?: GovernedButtonProps["emphasis"];
};

const InputGroupButton = React.forwardRef<
  HTMLButtonElement,
  InputGroupButtonProps
>(
  (
    {
      className,
      type = "button",
      intent,
      emphasis,
      size = "xs",
      ...props
    },
    ref
  ) => {
    const buttonSize = size;
    const governedButton = resolveInputGroupButtonProps(buttonSize);
    const governedAddon = resolvePrimitiveGovernance({
      componentName: "InputGroup",
      recipeName: INPUT_GROUP_RECIPE_NAME,
      slot: "actions",
      slotKey: `button-${buttonSize}`,
      className,
    });

    return (
      <Button
        ref={ref}
        type={type}
        data-size={buttonSize}
        intent={intent ?? governedButton.intent ?? "quiet"}
        emphasis={emphasis ?? governedButton.emphasis ?? "ghost"}
        size={governedButton.size ?? "xs"}
        {...(governedButton.presentation === undefined
          ? {}
          : { presentation: governedButton.presentation })}
        {...applyGovernedPresentation(props, governedAddon)}
      />
    );
  }
);

InputGroupButton.displayName = "InputGroupButton";

interface InputGroupTextProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "className"> {
  readonly className?: string;
}

const InputGroupText = React.forwardRef<HTMLSpanElement, InputGroupTextProps>(
  ({ className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "InputGroup",
      recipeName: INPUT_GROUP_RECIPE_NAME,
      slot: "body",
      className,
    });

    return (
      <span ref={ref} {...applyGovernedPresentation(props, governed)} />
    );
  }
);

InputGroupText.displayName = "InputGroupText";

interface InputGroupInputProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Input>, "className"> {
  readonly className?: string;
}

const InputGroupInput = React.forwardRef<HTMLInputElement, InputGroupInputProps>(
  ({ className, size: _nativeSize, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "InputGroup",
      recipeName: INPUT_GROUP_RECIPE_NAME,
      slot: "state",
      slotKey: "control-input",
      className,
    });

    return (
      <Input ref={ref} {...applyGovernedPresentation(props, governed)} />
    );
  }
);

InputGroupInput.displayName = "InputGroupInput";

interface InputGroupTextareaProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Textarea>, "className"> {
  readonly className?: string;
}

const InputGroupTextarea = React.forwardRef<
  HTMLTextAreaElement,
  InputGroupTextareaProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "InputGroup",
    recipeName: INPUT_GROUP_RECIPE_NAME,
    slot: "state",
    slotKey: "control-textarea",
    className,
  });

  return (
    <Textarea ref={ref} {...applyGovernedPresentation(props, governed)} />
  );
});

InputGroupTextarea.displayName = "InputGroupTextarea";

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
};
