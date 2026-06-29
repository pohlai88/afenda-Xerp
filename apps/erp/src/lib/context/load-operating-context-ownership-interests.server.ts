import {
  type AfendaDatabase,
  findOwnershipInterestsByEntityGroup,
} from "@afenda/database";
import type { OwnershipInterestContext } from "@afenda/kernel";

import { toOwnershipInterestContext } from "./to-ownership-interest-context";

export async function loadOperatingContextOwnershipInterests(input: {
  readonly db?: AfendaDatabase;
  readonly effectiveOn?: string;
  /** Entity group uuid PK for database FK filters. */
  readonly entityGroupPk: string | null;
  /** Tenant uuid PK for database FK filters. */
  readonly tenantPk: string;
}): Promise<readonly OwnershipInterestContext[]> {
  if (!input.entityGroupPk) {
    return [];
  }

  const records = await findOwnershipInterestsByEntityGroup(
    {
      tenantId: input.tenantPk,
      entityGroupId: input.entityGroupPk,
      ...(input.effectiveOn ? { effectiveOn: input.effectiveOn } : {}),
    },
    input.db
  );

  return records.map((record) => toOwnershipInterestContext(record));
}
