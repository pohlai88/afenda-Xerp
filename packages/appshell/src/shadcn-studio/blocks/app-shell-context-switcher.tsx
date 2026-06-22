"use client";

import { Building2Icon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  Button,
} from "@afenda/ui";
import type { ApplicationShellAllowedContextOptions } from "@afenda/kernel";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { mapStockButtonProps } from "@afenda/ui/governance";

const DEFAULT_MENU_LABEL = "Switch workspace";
const CONTEXT_SWITCH_TARGET_SEPARATOR = "::";

export type AppShellContextSwitcherGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "DropdownMenu"
>;

export interface AppShellContextSwitchSelection {
  readonly companySlug: string;
  readonly organizationSlug?: string;
}

export interface AppShellContextSwitcherProps {
  readonly allowedOptions: ApplicationShellAllowedContextOptions;
  readonly isPending?: boolean;
  readonly menuLabel?: string;
  readonly onSelect: (selection: AppShellContextSwitchSelection) => void;
  readonly triggerLabel?: string;
}

function toContextSwitchTargetValue(input: AppShellContextSwitchSelection): string {
  if (input.organizationSlug) {
    return `${input.companySlug}${CONTEXT_SWITCH_TARGET_SEPARATOR}${input.organizationSlug}`;
  }

  return input.companySlug;
}

function fromContextSwitchTargetValue(value: string): AppShellContextSwitchSelection {
  const separatorIndex = value.indexOf(CONTEXT_SWITCH_TARGET_SEPARATOR);
  if (separatorIndex === -1) {
    return { companySlug: value };
  }

  return {
    companySlug: value.slice(0, separatorIndex),
    organizationSlug: value.slice(separatorIndex + CONTEXT_SWITCH_TARGET_SEPARATOR.length),
  };
}

export function AppShellContextSwitcher({
  allowedOptions,
  isPending = false,
  menuLabel = DEFAULT_MENU_LABEL,
  onSelect,
  triggerLabel = "Switch workspace context",
}: AppShellContextSwitcherProps) {
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
          {...mapStockButtonProps("outline", "sm")}
          aria-label={triggerLabel}
          disabled={isPending}
          type="button"
        >
          <Building2Icon aria-hidden className="app-shell-context-switcher-icon" />
          <span className="app-shell-context-switcher-label">Switch</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>
          <span
            className="app-shell-context-switcher-menu-label"
            id="app-shell-context-switcher-menu-label"
          >
            {menuLabel}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          aria-labelledby="app-shell-context-switcher-menu-label"
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
              <DropdownMenuRadioItem key={value} value={value}>
                {target.label}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
