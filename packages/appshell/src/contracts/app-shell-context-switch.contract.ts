/**
 * Serializable AppShell context display + switch targets.
 * Display-only — no security authority.
 */

export interface ApplicationShellContextSwitchTarget {
  readonly companySlug: string;
  readonly isSelected: boolean;
  readonly label: string;
  readonly organizationSlug?: string;
}

export interface ApplicationShellAllowedContextOptions {
  readonly targets: readonly ApplicationShellContextSwitchTarget[];
}

export interface WorkspaceDisplayLabelInput {
  readonly legalEntityLabel: string;
  readonly organizationUnitLabel?: string;
}

/** Derived workspace label for shell chrome — legal entity with optional org unit. */
export function formatWorkspaceDisplayLabel(
  input: WorkspaceDisplayLabelInput
): string {
  if (input.organizationUnitLabel) {
    return `${input.legalEntityLabel} · ${input.organizationUnitLabel}`;
  }

  return input.legalEntityLabel;
}
