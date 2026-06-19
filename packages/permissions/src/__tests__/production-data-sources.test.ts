import type { AfendaDatabase } from "@afenda/database";
import { describe, expect, it } from "vitest";

import { createProductionAuthorizationDataSources } from "../database/create-production-data-sources";
import {
  createProductionPermissionDataSource,
  DatabasePermissionDataSource,
} from "../database/database-permission-data-source";
import {
  createProductionPolicyDataSource,
  DatabasePolicyDataSource,
} from "../database/database-policy-data-source";

const testDb = {} as AfendaDatabase;

describe("production authorization data sources", () => {
  it("creates database-backed permission and policy adapters", () => {
    const permissionDataSource = createProductionPermissionDataSource(testDb);
    const policyDataSource = createProductionPolicyDataSource(testDb);

    expect(permissionDataSource).toBeInstanceOf(DatabasePermissionDataSource);
    expect(policyDataSource).toBeInstanceOf(DatabasePolicyDataSource);
    expect(typeof permissionDataSource.findMembershipsForActor).toBe(
      "function"
    );
    expect(typeof policyDataSource.findApplicableRules).toBe("function");
  });

  it("creates paired production authorization data sources", () => {
    const sources = createProductionAuthorizationDataSources(testDb);

    expect(sources.permission).toBeInstanceOf(DatabasePermissionDataSource);
    expect(sources.policy).toBeInstanceOf(DatabasePolicyDataSource);
  });
});
