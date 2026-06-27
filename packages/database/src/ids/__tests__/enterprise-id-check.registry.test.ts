import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  ENTERPRISE_ID_FORMAT_CHECKS_MIGRATION_TAG,
  LIVE_ENTERPRISE_ID_CHECK_REGISTRY,
} from "../enterprise-id-check.registry.js";
import { buildEnterpriseIdCheckPattern } from "../enterprise-id-patterns.js";

const idsDir = fileURLToPath(new URL("..", import.meta.url));

describe("enterprise-id-check.registry", () => {
  it("covers all 16 live platform tables with family-specific patterns", () => {
    expect(LIVE_ENTERPRISE_ID_CHECK_REGISTRY).toHaveLength(16);

    for (const entry of LIVE_ENTERPRISE_ID_CHECK_REGISTRY) {
      expect(entry.checkPattern).toBe(
        buildEnterpriseIdCheckPattern(entry.family)
      );
      expect(entry.constraintName).toBe(`enterprise_id_${entry.family}_format`);
    }
  });

  it("format-checks migration SQL includes every live registry constraint", () => {
    const migrationPath = join(
      idsDir,
      `../migrations/${ENTERPRISE_ID_FORMAT_CHECKS_MIGRATION_TAG}.sql`
    );
    const migrationSql = readFileSync(migrationPath, "utf8");

    for (const entry of LIVE_ENTERPRISE_ID_CHECK_REGISTRY) {
      expect(migrationSql, entry.tableName).toContain(entry.constraintName);
      expect(migrationSql, entry.tableName).toContain(entry.checkPattern);
      expect(migrationSql, entry.tableName).toContain(`"${entry.tableName}"`);
    }
  });
});
