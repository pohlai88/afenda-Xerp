import { describe, expect, it } from "vitest";
import {
  isFoundationAttestationStatus,
  PROCUREMENT_FOUNDATION_BUNDLE,
  resolveModuleReadinessVerdict,
} from "../index.js";

describe("module-readiness-attestation", () => {
  it("identifies foundation_authorized as foundation attestation only", () => {
    expect(
      isFoundationAttestationStatus(
        PROCUREMENT_FOUNDATION_BUNDLE.module.runtimeStatus
      )
    ).toBe(true);
  });

  it("maps Pass to Foundation Pass for foundation_authorized bundles", () => {
    expect(
      resolveModuleReadinessVerdict(PROCUREMENT_FOUNDATION_BUNDLE, "Pass")
    ).toBe("Foundation Pass");
    expect(
      resolveModuleReadinessVerdict(PROCUREMENT_FOUNDATION_BUNDLE, "Fail")
    ).toBe("Fail");
  });
});
