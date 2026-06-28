export interface ModulePlaceholderShellCopy {
  readonly shellDescription: string;
}

export interface ModulePlaceholderStandardCopy
  extends ModulePlaceholderShellCopy {
  readonly domainBody: string;
  readonly emptyStateTitle: string;
  readonly variant: "standard";
}

export interface ModulePlaceholderAccountingCopy
  extends ModulePlaceholderShellCopy {
  readonly domainBody: string;
  readonly emptyStateTitle: string;
  readonly variant: "accounting";
}

export type ModulePlaceholderCopy =
  | ModulePlaceholderAccountingCopy
  | ModulePlaceholderStandardCopy;

export const MODULE_PLACEHOLDER_SHELL_DESCRIPTION =
  "Shell placeholder surface. Business domain logic arrives in a future delivery." as const;

export const MODULE_PLACEHOLDER_STANDARD_DOMAIN_BODY =
  "This module workspace is registered in the feature manifest. Domain capabilities will appear here after the module PAS slice completes." as const;

export const MODULE_PLACEHOLDER_ACCOUNTING_DOMAIN_BODY =
  "Accounting remains a shell placeholder until the Phase 9 Accounting Readiness Gate passes. Domain capabilities will appear here after Accounting Core delivery — no transaction or financial-record UI in this surface." as const;

export const MODULE_PLACEHOLDER_STANDARD_TEMPLATE = {
  variant: "standard",
  shellDescription: MODULE_PLACEHOLDER_SHELL_DESCRIPTION,
  domainBody: MODULE_PLACEHOLDER_STANDARD_DOMAIN_BODY,
  emptyStateTitle: "Module workspace",
} as const satisfies Omit<ModulePlaceholderStandardCopy, "emptyStateTitle"> & {
  readonly emptyStateTitle: string;
};

export const MODULE_PLACEHOLDER_ACCOUNTING_TEMPLATE = {
  variant: "accounting",
  shellDescription: MODULE_PLACEHOLDER_SHELL_DESCRIPTION,
  domainBody: MODULE_PLACEHOLDER_ACCOUNTING_DOMAIN_BODY,
  emptyStateTitle: "Accounting",
} as const satisfies ModulePlaceholderAccountingCopy;
