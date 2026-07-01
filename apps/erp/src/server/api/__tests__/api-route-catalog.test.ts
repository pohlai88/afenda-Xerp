import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { API_CONTRACTS } from "@/server/api/contracts/api-contract-registry";
import {
  buildApiRouteCatalog,
  validateApiRouteCatalogCompleteness,
} from "@/server/api/contracts/api-route-catalog";

const snapshotPath = join(
  import.meta.dirname,
  "../meta-contracts/api-route-catalog.snapshot.json"
);

describe("API route catalog", () => {
  it("builds a serializable catalog for every registered contract", () => {
    const catalog = buildApiRouteCatalog(API_CONTRACTS);

    expect(catalog.schemaVersion).toBe("1.0.0");
    expect(catalog.routes).toHaveLength(API_CONTRACTS.length);
    expect(JSON.parse(JSON.stringify(catalog))).toEqual(catalog);
  });

  it("requires governance metadata on every contract", () => {
    expect(validateApiRouteCatalogCompleteness(API_CONTRACTS)).toEqual([]);
  });

  it("matches the committed snapshot", () => {
    const catalog = buildApiRouteCatalog(API_CONTRACTS);
    const snapshot = JSON.parse(readFileSync(snapshotPath, "utf8"));

    expect(catalog).toEqual(snapshot);
  });
});
