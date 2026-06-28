import type { ProjectLookupRow } from "@afenda/database";
import {
  type ProjectContext,
  parseUnknownProjectContext,
  type TenantId,
} from "@afenda/kernel";

export function toProjectContext(
  row: ProjectLookupRow,
  tenantId: TenantId
): ProjectContext {
  return parseUnknownProjectContext({
    projectId: row.enterpriseId,
    tenantId,
    companyId: row.companyEnterpriseId,
    organizationUnitId: row.organizationUnitEnterpriseId,
    slug: row.slug,
    displayName: row.displayName,
    status: row.status,
  });
}
