"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { Building2Icon } from "lucide-react";
import { useId } from "react";
import type { ApplicationShellAllowedContextOptions } from "../../contracts/app-shell-context-switch.contract.js";
import type { AppShellContextSwitchSelection } from "../../contracts/context.contract.js";

const DEFAULT_MENU_LABEL = "Switch workspace";
const CONTEXT_SWITCH_TARGET_SEPARATOR = "::";

export type AppShellContextSwitcherGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "DropdownMenu"
>;

export type { AppShellContextSwitchSelection };

export interface AppShellContextSwitcherProps {
  readonly align?: "start" | "center" | "end";
  readonly allowedOptions: ApplicationShellAllowedContextOptions;
  readonly isPending?: boolean;
  readonly menuLabel?: string;
  readonly onSelect: (selection: AppShellContextSwitchSelection) => void;
  readonly triggerLabel?: string;
}

function toContextSwitchTargetValue(
  input: AppShellContextSwitchSelection
): string {
  if (input.organizationSlug) {
    return `${input.companySlug}${CONTEXT_SWITCH_TARGET_SEPARATOR}${input.organizationSlug}`;
  }

  return input.companySlug;
}

function fromContextSwitchTargetValue(
  value: string
): AppShellContextSwitchSelection {
  const separatorIndex = value.indexOf(CONTEXT_SWITCH_TARGET_SEPARATOR);
  if (separatorIndex === -1) {
    return { companySlug: value };
  }

  return {
    companySlug: value.slice(0, separatorIndex),
    organizationSlug: value.slice(
      separatorIndex + CONTEXT_SWITCH_TARGET_SEPARATOR.length
    ),
  };
}

export function AppShellContextSwitcher({
  allowedOptions,
  align = "start",
  isPending = false,
  menuLabel = DEFAULT_MENU_LABEL,
  onSelect,
  triggerLabel = "Switch workspace context",
}: AppShellContextSwitcherProps) {
  const menuLabelId = useId();
  const selectedTarget =
    allowedOptions.targets.find((target) => target.isSelected) ??
    allowedOptions.targets[0];

  if (!selectedTarget || allowedOptions.targets.length <= 1) {
    return null;
  }

  const selectedValue = toContextSwitchTargetValue({
    companySlug: selectedTarget.companySlug,
    ...(selectedTarget.organizationSlug
      ? { organizationSlug: selectedTarget.organizationSlug }
      : {}),
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-busy={isPending}
          aria-label={triggerLabel}
          disabled={isPending}
          emphasis="outline"
          intent="primary"
          presentation="default"
          size="sm"
          type="button"
        >
          <Building2Icon
            aria-hidden
            className="app-shell-context-switcher-icon"
          />
          <span className="app-shell-context-switcher-label">Switch</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <div className="app-shell-context-switcher-dropdown">
          <DropdownMenuLabel>
            <span
              className="app-shell-context-switcher-menu-label"
              id={menuLabelId}
            >
              {menuLabel}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup
            aria-labelledby={menuLabelId}
            onValueChange={(value) => {
              onSelect(fromContextSwitchTargetValue(value));
            }}
            value={selectedValue}
          >
            {allowedOptions.targets.map((target) => {
              const value = toContextSwitchTargetValue({
                companySlug: target.companySlug,
                ...(target.organizationSlug
                  ? { organizationSlug: target.organizationSlug }
                  : {}),
              });

              return (
                <DropdownMenuRadioItem
                  aria-label={target.label}
                  key={value}
                  value={value}
                >
                  {target.label}
                </DropdownMenuRadioItem>
              );
            })}
          </DropdownMenuRadioGroup>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
