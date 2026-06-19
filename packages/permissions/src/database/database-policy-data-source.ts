import { type AfendaDatabase, getDb, policies } from "@afenda/database";
import { and, eq, isNull, or } from "drizzle-orm";

import type { PolicyContract } from "../policy.contract.js";
import { policyRuleMatches } from "../policy.contract.js";
import type { PolicyDataSource } from "../policy-engine.js";
import { toPolicyContract } from "./contract-mappers.js";

/** Postgres-backed `PolicyDataSource` for production policy evaluation. */
export class DatabasePolicyDataSource implements PolicyDataSource {
  private readonly db: AfendaDatabase;

  constructor(db: AfendaDatabase = getDb()) {
    this.db = db;
  }

  async findApplicableRules(
    input: Parameters<PolicyDataSource["findApplicableRules"]>[0]
  ): Promise<readonly PolicyContract[]> {
    const rows = await this.db
      .select({
        id: policies.id,
        tenantId: policies.tenantId,
        key: policies.key,
        name: policies.name,
        description: policies.description,
        scope: policies.scope,
        effect: policies.effect,
        priority: policies.priority,
        condition: policies.condition,
        status: policies.status,
      })
      .from(policies)
      .where(
        and(
          eq(policies.status, "active"),
          or(isNull(policies.tenantId), eq(policies.tenantId, input.tenantId))
        )
      );

    return rows
      .map(toPolicyContract)
      .filter((rule) => policyRuleMatches(rule, input));
  }
}

export function createProductionPolicyDataSource(
  db: AfendaDatabase = getDb()
): DatabasePolicyDataSource {
  return new DatabasePolicyDataSource(db);
}
