import type { CanonicalEnterpriseId } from "../canonical/canonical-id.contract.js";
import { parseCanonicalId } from "../canonical/canonical-id-parser.contract.js";
import type { TenantId } from "../families/tenant-hierarchy-id.contract.js";
import {
  parseTenantId,
  toTenantId,
} from "../families/tenant-hierarchy-id.contract.js";
import type { EnterpriseIdFamily } from "../registry/id-family.registry.js";
import { serializeCanonicalId } from "./identity-wire.contract.js";
import {
  type InternalEntityPk,
  parseInternalEntityPk,
  toInternalEntityPk,
} from "./internal-entity-pk.contract.js";

/** Trusted audit/event entity identity after wire ingress parsing (PAS-001 §4.1.9). */
export type AuditEntityIdentity<TFamily extends EnterpriseIdFamily> = {
  readonly entityId: CanonicalEnterpriseId<TFamily>;
  readonly entityPk: InternalEntityPk;
  readonly tenantId: TenantId;
  readonly tenantPk: InternalEntityPk;
};

/** Wire JSON shape — plain strings for both canonical and internal PK fields. */
export type WireAuditEntityIdentity = {
  readonly entityId: string;
  readonly entityPk: string;
  readonly tenantId: string;
  readonly tenantPk: string;
};

export function parseAuditEntityIdentity<
  TFamily extends EnterpriseIdFamily,
>(input: {
  readonly entityFamily: TFamily;
  readonly entityId: string;
  readonly entityPk: string;
  readonly tenantId: string;
  readonly tenantPk: string;
}): AuditEntityIdentity<TFamily> {
  return {
    tenantId: parseTenantId(input.tenantId),
    tenantPk: parseInternalEntityPk(input.tenantPk, "TenantPk"),
    entityId: parseCanonicalId(input.entityId, input.entityFamily),
    entityPk: parseInternalEntityPk(input.entityPk, "EntityPk"),
  };
}

export function serializeAuditEntityIdentity<
  TFamily extends EnterpriseIdFamily,
>(identity: AuditEntityIdentity<TFamily>): WireAuditEntityIdentity {
  return {
    tenantId: toTenantId(identity.tenantId),
    tenantPk: toInternalEntityPk(identity.tenantPk),
    entityId: serializeCanonicalId(identity.entityId),
    entityPk: toInternalEntityPk(identity.entityPk),
  };
}
