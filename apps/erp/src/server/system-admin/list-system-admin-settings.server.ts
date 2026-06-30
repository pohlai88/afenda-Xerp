import { listPermissionCatalog } from "@afenda/database";

import type { SystemAdminModuleSettingRowDto } from "@/server/api/contracts/system-admin/system-admin.api-contract";

const MODULE_DOMAIN_LABELS: Record<string, string> = {
  accounting: "Accounting",
  dashboard: "Dashboard",
  finance: "Finance",
  hr: "Human Resources",
  inventory: "Inventory",
  system_admin: "System Admin",
  workspace: "Workspace",
};

function toModuleLabel(domain: string): string {
  return MODULE_DOMAIN_LABELS[domain] ?? domain;
}

export async function listSystemAdminSettings(): Promise<{
  readonly modules: readonly SystemAdminModuleSettingRowDto[];
}> {
  const permissions = await listPermissionCatalog();
  const countsByDomain = new Map<string, number>();

  for (const permission of permissions) {
    countsByDomain.set(
      permission.domain,
      (countsByDomain.get(permission.domain) ?? 0) + 1
    );
  }

  const modules = [...countsByDomain.entries()]
    .map(([domain, permissionCount]) => ({
      domain,
      label: toModuleLabel(domain),
      permissionCount,
    }))
    .sort((left, right) => left.label.localeCompare(right.label));

  return { modules };
}
