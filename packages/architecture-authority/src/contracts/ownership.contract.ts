export const AUTHORITY_LEVELS = [
  "architecture",
  "platform",
  "design",
  "metadata",
  "erp-spine",
  "domain",
  "application",
] as const;

export type AuthorityLevel = (typeof AUTHORITY_LEVELS)[number];

export interface PackageOwnership {
  readonly authorityLevel: AuthorityLevel;
  readonly ownerDomain: string;
  readonly packageName: string;
}

export interface OwnershipAuditRow {
  readonly apiApprover: string;
  readonly dependencyApprover: string;
  readonly deprecationApprover: string;
  readonly exceptionApprover: string;
  readonly packageName: string;
}

export interface OwnershipContract {
  readonly auditRows: readonly OwnershipAuditRow[];
  readonly packages: readonly PackageOwnership[];
}
