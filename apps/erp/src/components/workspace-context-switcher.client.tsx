"use client";

import {
  AppShellContextSwitcher,
  type AppShellContextSwitchSelection,
} from "@afenda/appshell";
import type { ApplicationShellAllowedContextOptions } from "@afenda/kernel";

import { useSwitchOperatingContext } from "@/lib/workspace/use-switch-operating-context";

export interface WorkspaceContextSwitcherProps {
  readonly allowedOptions: ApplicationShellAllowedContextOptions;
}

export function WorkspaceContextSwitcher({
  allowedOptions,
}: WorkspaceContextSwitcherProps) {
  const { isPending, switchContext } = useSwitchOperatingContext();

  async function handleSelect(selection: AppShellContextSwitchSelection) {
    await switchContext({
      companySlug: selection.companySlug,
      ...(selection.organizationSlug
        ? { organizationSlug: selection.organizationSlug }
        : {}),
    });
  }

  return (
    <AppShellContextSwitcher
      allowedOptions={allowedOptions}
      isPending={isPending}
      onSelect={handleSelect}
    />
  );
}
