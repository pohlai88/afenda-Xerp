import { describe, expect, it } from "vitest";
import {
  brandOptionalId,
  brandRequiredId,
} from "../identity/governance/legacy-brand-boundary.contract.js";
import * as identityPublic from "../identity/index.js";
import * as kernelRoot from "../index.js";

describe("legacy brand boundary isolation (PAS-001 §4.1)", () => {
  it("keeps trim-only legacy helpers off the public identity barrel", () => {
    expect("brandRequiredId" in identityPublic).toBe(false);
    expect("brandOptionalId" in identityPublic).toBe(false);
    expect("brandCustomerId" in identityPublic).toBe(false);
    expect("brandTenantId" in identityPublic).toBe(false);
  });

  it("keeps trim-only legacy helpers off the @afenda/kernel root barrel", () => {
    expect("brandRequiredId" in kernelRoot).toBe(false);
    expect("brandOptionalId" in kernelRoot).toBe(false);
    expect("brandCustomerId" in kernelRoot).toBe(false);
    expect("brandTenantId" in kernelRoot).toBe(false);
  });

  it("documents that legacy helpers do not validate canonical enterprise IDs", () => {
    const unchecked = brandRequiredId("not-a-canonical-id", "customerId");
    expect(brandOptionalId(unchecked, "customerId")).toBe("not-a-canonical-id");
  });
});
