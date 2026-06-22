import type { AfendaDatabase } from "@afenda/database";
import { getDb } from "@afenda/database";

import type { PermissionDataSource } from "../grants/permission-checker.js";
import type { PolicyDataSource } from "../policy-engine.js";
import { createProductionPermissionDataSource } from "./database-permission-data-source.js";
import { createProductionPolicyDataSource } from "./database-policy-data-source.js";

export interface ProductionAuthorizationDataSources {
  readonly permission: PermissionDataSource;
  readonly policy: PolicyDataSource;
}

export function createProductionAuthorizationDataSources(
  db: AfendaDatabase = getDb()
): ProductionAuthorizationDataSources {
  return {
    permission: createProductionPermissionDataSource(db),
    policy: createProductionPolicyDataSource(db),
  };
}
