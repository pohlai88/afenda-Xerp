import {
  findOwnershipInterestsByEntityGroup,
  type AfendaDatabase,
} from "@afenda/database";
import type { OwnershipInterestContext } from "@afenda/kernel";

import { toOwnershipInterestContext } from "./to-ownership-interest-context";

export async function loadOperatingContextOwnershipInterests(input: {
  readonly db?: AfendaDatabase;
  readonly effectiveOn?: string;
  readonly entityGroupId: string | null;
  readonly tenantId: string;
}): Promise<readonly OwnershipInterestContext[]> {
  if (!input.entityGroupId) {
    return [];
  }

  const records = await findOwnershipInterestsByEntityGroup(
    {
      tenantId: input.tenantId,
      entityGroupId: input.entityGroupId,
      ...(input.effectiveOn ? { effectiveOn: input.effectiveOn } : {}),
    },
    input.db
  );

  return records.map((record) => toOwnershipInterestContext(record));
}
