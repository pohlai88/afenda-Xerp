export type PlatformTenantStatus = "active" | "archived" | "suspended";

/** Hard platform isolation boundary for authorization. */
export interface TenantContract {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly status: PlatformTenantStatus;
}

/** Only active tenants allow normal workspace authorization. */
export function isTenantOperational(
  tenant: Pick<TenantContract, "status">
): boolean {
  return tenant.status === "active";
}

export function getTenantAccessBlockReason(
  status: PlatformTenantStatus
): string | null {
  switch (status) {
    case "active":
      return null;
    case "suspended":
      return "Tenant is suspended and workspace access is blocked.";
    case "archived":
      return "Tenant is archived and workspace access is blocked.";
    default:
      return `Tenant status "${status}" cannot access the workspace.`;
  }
}
