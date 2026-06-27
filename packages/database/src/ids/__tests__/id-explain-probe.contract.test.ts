import { describe, expect, it } from "vitest";

import { ID_EXPLAIN_PROBES } from "../database-enterprise-id.contract.js";

describe("id-explain-probe.contract", () => {
  it("defines EXPLAIN spot checks for enterprise_id, tenant list, and FK join", () => {
    expect(ID_EXPLAIN_PROBES).toHaveLength(3);

    const names = ID_EXPLAIN_PROBES.map((probe) => probe.name);
    expect(names).toContain("enterprise_id lookup");
    expect(names).toContain("tenant-scoped product list");
    expect(names).toContain("uuid FK join path");
  });

  it("uses parameterized SQL suitable for live plan verification", () => {
    for (const probe of ID_EXPLAIN_PROBES) {
      expect(probe.sql).toMatch(/^EXPLAIN \(FORMAT JSON\)/);
      expect(probe.expectedIndexFragment.length).toBeGreaterThan(0);
    }
  });
});
