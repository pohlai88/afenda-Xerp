/**
 * ERP-local context switch presentation contracts (ADR-0027 — replaces @afenda/appshell types).
 * Display-only — no security authority.
 */

export interface ErpContextSwitchTarget {
  readonly companySlug: string;
  readonly isSelected: boolean;
  readonly label: string;
  readonly organizationSlug?: string;
}

export interface ErpAllowedContextOptions {
  readonly targets: readonly ErpContextSwitchTarget[];
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
