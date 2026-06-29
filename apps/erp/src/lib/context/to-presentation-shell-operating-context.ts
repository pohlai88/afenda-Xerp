import type { OperatingContext } from "@afenda/kernel";

/** PAS-006 protected shell context labels — not @afenda/appshell. */
export interface PresentationShellOperatingContext {
  readonly legalEntityLabel: string;
  readonly tenantLabel: string;
  readonly workspaceLabel: string;
}

/** Projects kernel operating context into PAS-006 presentation shell labels. */
export function toPresentationShellOperatingContext(
  context: OperatingContext
): PresentationShellOperatingContext {
  const legalEntityLabel = context.legalEntity.displayName;
  const organizationUnitLabel = context.organizationUnit?.displayName;

  return {
    tenantLabel: context.tenant.displayName,
    legalEntityLabel,
    workspaceLabel:
      organizationUnitLabel === undefined
        ? legalEntityLabel
        : `${legalEntityLabel} · ${organizationUnitLabel}`,
  };
}
