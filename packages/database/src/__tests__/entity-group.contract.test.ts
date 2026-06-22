import { describe, expect, it } from "vitest";

import {
  assertEntityGroupSlug,
  buildEntityGroupInsertRow,
} from "@afenda/database";

describe("entity group contract", () => {
  it("normalizes and validates entity group slugs", () => {
    expect(assertEntityGroupSlug("acme-holding")).toBe("acme-holding");
  });

  it("builds governed entity group insert rows", () => {
    const row = buildEntityGroupInsertRow({
      tenantId: "tenant-1",
      slug: "acme-group",
      displayName: "Acme Group",
      parentLegalEntityId: null,
    });

    expect(row.slug).toBe("acme-group");
    expect(row.status).toBe("active");
  });
});
