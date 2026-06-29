import { describe, expect, it } from "vitest";

import {
  findUntrustedClientAuthorityFields,
  isUntrustedClientAuthorityFieldKey,
  UNTRUSTED_CLIENT_AUTHORITY_FIELD_KEYS,
} from "../untrusted-client-authority.server.js";

describe("untrusted-client-authority.server", () => {
  it("exports the multi-tenancy forbidden authority keys", () => {
    expect(UNTRUSTED_CLIENT_AUTHORITY_FIELD_KEYS).toEqual([
      "tenantId",
      "entityGroupId",
      "legalEntityId",
      "companyId",
      "organizationUnitId",
      "organizationId",
      "teamId",
      "projectId",
    ]);
  });

  it("detects forbidden keys on object bodies", () => {
    expect(
      findUntrustedClientAuthorityFields({
        message: "hello",
        tenantId: "tenant-001",
        companyId: "company-001",
      })
    ).toEqual(["tenantId", "companyId"]);
  });

  it("ignores non-object payloads", () => {
    expect(findUntrustedClientAuthorityFields(null)).toEqual([]);
    expect(findUntrustedClientAuthorityFields("tenantId")).toEqual([]);
    expect(findUntrustedClientAuthorityFields(["tenantId"])).toEqual([]);
  });

  it("narrows known forbidden keys", () => {
    expect(isUntrustedClientAuthorityFieldKey("tenantId")).toBe(true);
    expect(isUntrustedClientAuthorityFieldKey("tenantSlug")).toBe(false);
  });
});
