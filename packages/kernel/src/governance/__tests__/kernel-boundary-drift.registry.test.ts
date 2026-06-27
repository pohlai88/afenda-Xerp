import { describe, expect, it } from "vitest";

import {
  getKernelBoundaryDriftEntry,
  isKernelBoundaryDriftEntryId,
  isKernelBoundaryDriftPath,
  KERNEL_BOUNDARY_CANONICAL_PRIMITIVE_PATHS,
  KERNEL_BOUNDARY_DRIFT_ENTRIES,
  KERNEL_BOUNDARY_DRIFT_ENTRY_IDS,
  KERNEL_BOUNDARY_DRIFT_POLICY,
  listKernelBoundaryDriftEntries,
} from "../kernel-boundary-drift.registry.js";

describe("kernel boundary drift registry (PAS-001 refactor lock)", () => {
  it("registers every drift entry with refactorLock true", () => {
    expect(KERNEL_BOUNDARY_DRIFT_ENTRY_IDS.length).toBeGreaterThan(0);
    expect(KERNEL_BOUNDARY_DRIFT_POLICY.entryCount).toBe(
      KERNEL_BOUNDARY_DRIFT_ENTRY_IDS.length
    );

    for (const entry of listKernelBoundaryDriftEntries()) {
      expect(entry.refactorLock).toBe(true);
      expect(entry.kernelPath.startsWith("packages/kernel/src/")).toBe(true);
      expect(entry.rationale.length).toBeGreaterThan(20);
    }
  });

  it("marks legacy brand shims for removal", () => {
    expect(
      getKernelBoundaryDriftEntry("contracts-brand-shim").disposition
    ).toBe("remove_after_migration");
    expect(
      getKernelBoundaryDriftEntry("legacy-brand-boundary").refactorStatus
    ).toBe("completed");
  });

  it("quarantines forbidden platform-floor fiscal IDs", () => {
    const entry = getKernelBoundaryDriftEntry(
      "accounting-id-forbidden-floor-symbols"
    );
    expect(entry.disposition).toBe("quarantine_subpath_only");
    expect(entry.ownerTarget).toContain("@afenda/accounting");
  });

  it("confirms CountryCode primitive belongs in kernel", () => {
    expect(KERNEL_BOUNDARY_CANONICAL_PRIMITIVE_PATHS).toContain(
      "packages/kernel/src/identity/primitives/country-code.contract.ts"
    );
    expect(
      isKernelBoundaryDriftPath(
        "packages/kernel/src/identity/primitives/country-code.contract.ts"
      )
    ).toBe(false);
  });

  it("resolves drift paths for folder and file entries", () => {
    expect(
      isKernelBoundaryDriftPath(
        "packages/kernel/src/contracts/business-reference-identity/index.ts"
      )
    ).toBe(true);
    expect(
      getKernelBoundaryDriftEntry("permission-scope-context-transitional")
        .refactorStatus
    ).toBe("completed");
    expect(
      getKernelBoundaryDriftEntry("business-master-data-id-boundary-overlap")
        .ownerTarget
    ).toContain("identity/wire/business-reference-wire.contract.ts");
    expect(
      getKernelBoundaryDriftEntry("contracts-brand-shim").refactorStatus
    ).toBe("completed");
  });

  it("lookup helpers are stable", () => {
    expect(isKernelBoundaryDriftEntryId("contracts-brand-shim")).toBe(true);
    expect(isKernelBoundaryDriftEntryId("unknown-entry")).toBe(false);
    expect(KERNEL_BOUNDARY_DRIFT_ENTRIES["contracts-brand-shim"].id).toBe(
      "contracts-brand-shim"
    );
  });
});
