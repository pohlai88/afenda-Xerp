/** Governed seed profile identifiers (TIP-003A). */
export type SeedProfile =
  | "demo"
  | "dev"
  | "platform"
  | "preview"
  | "test";

export type BootstrapProfile = "local" | "preview";

export interface SeedEnsureResult {
  readonly created: boolean;
  readonly id: string;
  readonly key: string;
}

export interface SeedGrantResult {
  readonly created: boolean;
  readonly permissionKey: string;
  readonly roleKey: string;
}

export interface WorkspaceSeedResult {
  readonly companyId: string;
  readonly membershipId: string;
  readonly organizationId: string | null;
  readonly tenantId: string;
  readonly tenantRoleId: string;
  readonly userId: string;
}

/** @deprecated Use `WorkspaceSeedResult`. */
export type DevWorkspaceSeedResult = WorkspaceSeedResult;

export interface SeedRunResult {
  readonly correlationId: string;
  readonly grants: readonly SeedGrantResult[];
  readonly permissions: readonly SeedEnsureResult[];
  readonly policies: readonly SeedEnsureResult[];
  readonly profile: SeedProfile;
  readonly roles: readonly SeedEnsureResult[];
  readonly workspace?: WorkspaceSeedResult;
}

export interface SeedVerificationIssue {
  readonly code: string;
  readonly message: string;
}

export interface SeedVerificationResult {
  readonly issues: readonly SeedVerificationIssue[];
  readonly ok: boolean;
  readonly profile: SeedProfile;
}
