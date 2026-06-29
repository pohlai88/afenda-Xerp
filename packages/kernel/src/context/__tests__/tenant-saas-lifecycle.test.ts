import { describe, expect, it } from "vitest";

import {
  parseUnknownTenantSaasLifecycleVocabulary,
  serializeTenantSaasLifecycleVocabulary,
} from "../tenant-saas-lifecycle.parser.js";

describe("tenant SaaS lifecycle vocabulary (PAS-001 amendment)", () => {
  it("round-trips wire phases", () => {
    const parsed = parseUnknownTenantSaasLifecycleVocabulary({
      phase: "active",
    });
    expect(serializeTenantSaasLifecycleVocabulary(parsed)).toEqual({
      phase: "active",
    });
  });

  it("rejects invalid phases", () => {
    expect(() =>
      parseUnknownTenantSaasLifecycleVocabulary({ phase: "archived" })
    ).toThrow(/phase must be one of/i);
  });
});
