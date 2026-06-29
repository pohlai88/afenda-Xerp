/**
 * PAS §4.1.10 — canonical tenant enterprise ID → internal uuid PK for RLS/session.
 *
 * Execution and authorization layers keep branded {@link TenantId} (`ten_*`).
 * Database RLS session variables use internal uuid primary keys only.
 */
import type { AfendaDatabase } from "@afenda/database";
import { findTenantByEnterpriseId } from "@afenda/database/tenant-domain";
import { type TenantId, toTenantId } from "@afenda/kernel";

import { ApiRouteError } from "@/server/api/runtime/api-validation";

import { parseRouteTenantId } from "./parse-route-id";

export interface ResolvedTenantPk {
  readonly enterpriseId: TenantId;
  readonly tenantPk: string;
}

/** Parses untrusted tenant wire, then resolves internal uuid PK for RLS/session. */
export async function resolveTenantPkFromWire(input: {
  readonly db?: AfendaDatabase;
  readonly wireTenantId: string;
}): Promise<ResolvedTenantPk> {
  const enterpriseId = parseRouteTenantId(input.wireTenantId);
  const tenantPk = await resolveTenantPkFromCanonicalId(enterpriseId, input.db);

  return {
    enterpriseId,
    tenantPk,
  };
}

/** Resolves an already-parsed canonical tenant ID to the internal uuid PK used by RLS. */
export async function resolveTenantPkFromCanonicalId(
  tenantId: TenantId,
  db?: AfendaDatabase
): Promise<string> {
  const row = await findTenantByEnterpriseId(toTenantId(tenantId), db);

  if (row === null) {
    throw new ApiRouteError("not_found", "Tenant was not found.", {
      tenantId: toTenantId(tenantId),
    });
  }

  return row.id;
}
