import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { LIVE_PLATFORM_ENTITY_TABLES } from "../platform-entity-table-registry.js";
import {
  FORBIDDEN_ENTERPRISE_ID_FK_PATTERNS,
  FORBIDDEN_HUMAN_REFERENCE_FK_PATTERNS,
  SPLIT_ID_COLUMN_EXAMPLES,
} from "../split-id-persistence.contract.js";
import { checkSplitIdPersistenceContract } from "../split-id-persistence.governance.js";

const schemaDir = join(fileURLToPath(new URL("../../schema", import.meta.url)));

describe("split-id-persistence governance", () => {
  it("passes on live platform schemas", () => {
    const violations = checkSplitIdPersistenceContract(schemaDir);
    expect(violations).toEqual([]);
  });

  it("documents three-layer column examples", () => {
    expect(SPLIT_ID_COLUMN_EXAMPLES.length).toBeGreaterThanOrEqual(3);
    for (const example of SPLIT_ID_COLUMN_EXAMPLES) {
      expect(example.internalPk).toContain("uuid");
      expect(example.enterpriseId).toContain("enterprise_id");
    }
  });

  it("covers every live platform entity schema file", () => {
    expect(LIVE_PLATFORM_ENTITY_TABLES.length).toBe(16);
  });

  it("detects enterprise_id FK prohibition patterns", () => {
    const sample = `productId: uuid("product_id").references(() => products.enterpriseId)`;
    expect(
      FORBIDDEN_ENTERPRISE_ID_FK_PATTERNS.some((pattern) =>
        pattern.test(sample)
      )
    ).toBe(true);
  });

  it("detects human reference FK prohibition patterns", () => {
    const samples = [
      `warehouseId: uuid("warehouse_id").references(() => warehouses.warehouseCode)`,
      `skuRef: uuid("sku_id").references(() => products.sku)`,
    ];
    for (const sample of samples) {
      expect(
        FORBIDDEN_HUMAN_REFERENCE_FK_PATTERNS.some((pattern) =>
          pattern.test(sample)
        )
      ).toBe(true);
    }
  });
});
