import type { Brand } from "../brand/index.js";
import { unbrand } from "../brand/index.js";
import { isCanonicalEnterpriseId } from "../canonical/canonical-id-validator.contract.js";
import { assertUuidV7WireForm } from "../postgres/uuid-v7-format.contract.js";
import { TENANT_HUMAN_REFERENCE_PATTERN } from "../primitives/primitive-brand.helpers.js";

/** Internal PostgreSQL primary key at audit/event trust boundaries (UUID v7 wire form). */
export type InternalEntityPk = Brand<string, "InternalEntityPk">;

export function parseInternalEntityPk(
  value: string,
  label: "TenantPk" | "EntityPk"
): InternalEntityPk {
  const raw = value.trim();

  if (!raw) {
    throw new Error(`${label} is required.`);
  }

  if (isCanonicalEnterpriseId(raw)) {
    throw new Error(`${label} must not be a canonical enterprise ID.`);
  }

  if (TENANT_HUMAN_REFERENCE_PATTERN.test(raw)) {
    throw new Error(`${label} must not be a tenant human reference.`);
  }

  return assertUuidV7WireForm(raw, label) as InternalEntityPk;
}

export function toInternalEntityPk(value: InternalEntityPk): string {
  return unbrand(value);
}
