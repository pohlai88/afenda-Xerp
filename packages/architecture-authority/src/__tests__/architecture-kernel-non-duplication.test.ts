import { describe, expect, it } from "vitest";

import {
  ARCHITECTURE_KERNEL_FORBIDDEN_CONTENT_PATTERNS,
  ARCHITECTURE_KERNEL_FORBIDDEN_FILENAME_PATTERNS,
  scanArchitectureKernelNonDuplication,
} from "../policy/architecture-kernel-non-duplication.policy.js";

describe("architecture-kernel-non-duplication policy", () => {
  it("exports forbidden pattern lists for gate consumers", () => {
    expect(
      ARCHITECTURE_KERNEL_FORBIDDEN_FILENAME_PATTERNS.length
    ).toBeGreaterThan(0);
    expect(
      ARCHITECTURE_KERNEL_FORBIDDEN_CONTENT_PATTERNS.length
    ).toBeGreaterThan(0);
  });

  it("allows business-master-data registry with kernelContractPath strings only", () => {
    const violations = scanArchitectureKernelNonDuplication([
      {
        relativePath:
          "packages/architecture-authority/src/data/business-master-data-authority.registry.ts",
        content: `export const row = {
  runtimeStatus: "authority_only",
  kernelContractPath: "packages/kernel/src/identity/wire/business-reference-wire.contract.ts",
};`,
      },
    ]);

    expect(violations).toEqual([]);
  });

  it("rejects synthetic parseTenantId duplication", () => {
    const violations = scanArchitectureKernelNonDuplication([
      {
        relativePath:
          "packages/architecture-authority/src/policy/evil-identity-parser.ts",
        content:
          "export function parseTenantId(value: string) { return value; }",
      },
    ]);

    expect(violations.some((v) => v.message.includes("parse-tenant-id"))).toBe(
      true
    );
  });

  it("rejects forbidden filename patterns outside allowlist", () => {
    const violations = scanArchitectureKernelNonDuplication([
      {
        relativePath:
          "packages/architecture-authority/src/data/tenant-id-family.registry.ts",
        content: "export const ENTITY = 'customer';",
      },
    ]);

    expect(violations.some((v) => v.rule === "forbidden-filename")).toBe(true);
  });

  it("allows architecture-owned parseIso8601UtcTimestamp export", () => {
    const violations = scanArchitectureKernelNonDuplication([
      {
        relativePath:
          "packages/architecture-authority/src/contracts/iso8601-utc-timestamp.ts",
        content:
          "export function parseIso8601UtcTimestamp(value: string) { return 0; }",
      },
    ]);

    expect(violations).toEqual([]);
  });

  it("allows business-master-data-scaffold policy assert helper (BMD allowlist)", () => {
    const violations = scanArchitectureKernelNonDuplication([
      {
        relativePath:
          "packages/architecture-authority/src/data/business-master-data-scaffold.policy.ts",
        content: `export function assertAuthorityOnlyRuntimeStatus(status: string) {
  if (status !== "authority_only") throw new Error("invalid");
}`,
      },
    ]);

    expect(violations).toEqual([]);
  });
});
