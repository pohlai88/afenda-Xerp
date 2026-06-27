import { text } from "drizzle-orm/pg-core";

import type { EnterpriseIdFamilyKey } from "./enterprise-id-patterns.js";

export type EnterpriseIdColumn = ReturnType<typeof buildEnterpriseIdColumn>;

function buildEnterpriseIdColumn(
  _family: EnterpriseIdFamilyKey,
  columnName = "enterprise_id"
) {
  return text(columnName);
}

/**
 * Kernel-governed canonical enterprise ID column (`enterprise_id text`).
 *
 * ADR-0022: lookup / wire identity — not PK, not FK target.
 * Pair with `enterpriseIdFormatCheck()` and a unique index in the table callback.
 */
export function enterpriseIdColumn(
  family: EnterpriseIdFamilyKey,
  columnName = "enterprise_id"
): EnterpriseIdColumn {
  return buildEnterpriseIdColumn(family, columnName);
}
