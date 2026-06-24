"use client";

import {
  AppShellContextSwitcher,
  type AppShellContextSwitchSelection,
} from "@afenda/appshell";
import type { ApplicationShellAllowedContextOptions } from "@afenda/kernel";

import { resolveContextSwitchPresentation } from "@/lib/context/resolve-context-switch-presentation";
import { useSwitchOperatingContext } from "@/lib/workspace/use-switch-operating-context";

export interface WorkspaceContextSwitcherProps {
  readonly allowedOptions: ApplicationShellAllowedContextOptions;
}

export function WorkspaceContextSwitcher({
  allowedOptions,
}: WorkspaceContextSwitcherProps) {
  const { isPending, switchContext } = useSwitchOperatingContext();
  const presentation = resolveContextSwitchPresentation(allowedOptions, {
    isPending,
  });

  if (!presentation.shouldRender) {
    return null;
  }

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
      menuLabel={presentation.copy.menuLabel}
      onSelect={handleSelect}
      triggerLabel={presentation.copy.triggerLabel}
    />
  );
}
