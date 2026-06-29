import { describe, expect, it } from "vitest";

import { parseActiveWorkspaceSelection } from "../parse-active-workspace-selection";

describe("parseActiveWorkspaceSelection", () => {
  it("parses tenant:company:scope workspace wire", () => {
    expect(
      parseActiveWorkspaceSelection("tenant-001:company-001:root")
    ).toEqual({
      tenantId: "tenant-001",
      companyId: "company-001",
      scopeRoot: "root",
    });
  });

  it("returns null for malformed workspace wire", () => {
    expect(parseActiveWorkspaceSelection(null)).toBeNull();
    expect(parseActiveWorkspaceSelection("tenant-only")).toBeNull();
    expect(parseActiveWorkspaceSelection("   ")).toBeNull();
  });
});
