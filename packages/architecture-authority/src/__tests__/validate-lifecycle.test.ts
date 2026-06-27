import { describe, expect, it } from "vitest";
import {
  ARCHITECTURE_VALIDATION_REFERENCE_ISO,
  resolveArchitectureValidationReferenceMs,
} from "../contracts/architecture-authority-version.js";
import type { PackageDefinition } from "../contracts/package.contract.js";
import {
  collectLifecycleViolations,
  validateLifecycle,
} from "../validators/validate-lifecycle.js";

const REFERENCE_DATE_MS = Date.parse(ARCHITECTURE_VALIDATION_REFERENCE_ISO);

function packageFixture(
  overrides: Partial<PackageDefinition> & Pick<PackageDefinition, "lifecycle">
): PackageDefinition {
  return {
    registryId: "PKG-TEST",
    packageName: "@afenda/test",
    path: "packages/test",
    layer: "Platform",
    purpose: "test fixture",
    publicApiOwner: "Test Authority",
    layerDepExempt: false,
    filesystemRequired: false,
    ...overrides,
  };
}

describe("validateLifecycle", () => {
  it("uses baseline reference by default for deterministic CI", () => {
    expect(resolveArchitectureValidationReferenceMs()).toBe(REFERENCE_DATE_MS);

    const result = validateLifecycle();
    expect(result.ok).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it("passes for the committed lifecycle contract and package registry", () => {
    const result = validateLifecycle({ referenceDateMs: REFERENCE_DATE_MS });
    expect(result.ok).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it("fails when lifecycle policy thresholds are non-positive", () => {
    const violations = collectLifecycleViolations(
      { experimentalMaxDays: 0, maxDeprecationMonths: 12 },
      [],
      REFERENCE_DATE_MS
    );

    expect(violations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          gate: "lifecycle",
          message: expect.stringContaining("experimentalMaxDays"),
        }),
      ])
    );
  });

  it("fails when inactive lifecycle rows require filesystem presence", () => {
    const violations = collectLifecycleViolations(
      { experimentalMaxDays: 90, maxDeprecationMonths: 12 },
      [
        packageFixture({
          lifecycle: "planned",
          filesystemRequired: true,
        }),
      ],
      REFERENCE_DATE_MS
    );

    expect(violations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          gate: "lifecycle",
          packageName: "@afenda/test",
          message: expect.stringContaining("filesystemRequired: false"),
        }),
      ])
    );
  });

  it("requires experimentalStartedAt and experimentalExpiresAt", () => {
    const violations = collectLifecycleViolations(
      { experimentalMaxDays: 90, maxDeprecationMonths: 12 },
      [packageFixture({ lifecycle: "experimental", filesystemRequired: true })],
      REFERENCE_DATE_MS
    );

    expect(violations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          gate: "lifecycle",
          message: expect.stringContaining("experimentalStartedAt"),
        }),
        expect.objectContaining({
          gate: "lifecycle",
          message: expect.stringContaining("experimentalExpiresAt"),
        }),
      ])
    );
  });

  it("fails when an experimental package is past experimentalExpiresAt", () => {
    const violations = collectLifecycleViolations(
      { experimentalMaxDays: 90, maxDeprecationMonths: 12 },
      [
        packageFixture({
          lifecycle: "experimental",
          filesystemRequired: true,
          experimentalStartedAt: "2025-10-01T00:00:00.000Z",
          experimentalExpiresAt: "2026-01-01T00:00:00.000Z",
        }),
      ],
      REFERENCE_DATE_MS
    );

    expect(violations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          gate: "lifecycle",
          message: expect.stringContaining("expired"),
        }),
      ])
    );
  });

  it("fails when experimental window exceeds experimentalMaxDays span", () => {
    const violations = collectLifecycleViolations(
      { experimentalMaxDays: 90, maxDeprecationMonths: 12 },
      [
        packageFixture({
          lifecycle: "experimental",
          filesystemRequired: true,
          experimentalStartedAt: "2026-01-01T00:00:00.000Z",
          experimentalExpiresAt: "2026-12-01T00:00:00.000Z",
        }),
      ],
      REFERENCE_DATE_MS
    );

    expect(violations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          gate: "lifecycle",
          message: expect.stringContaining("experimental window"),
        }),
      ])
    );
  });

  it("passes for a valid experimental package within policy span", () => {
    const violations = collectLifecycleViolations(
      { experimentalMaxDays: 90, maxDeprecationMonths: 12 },
      [
        packageFixture({
          lifecycle: "experimental",
          filesystemRequired: true,
          experimentalStartedAt: "2026-06-01T00:00:00.000Z",
          experimentalExpiresAt: "2026-08-01T00:00:00.000+00:00",
        }),
      ],
      REFERENCE_DATE_MS
    );

    expect(violations).toHaveLength(0);
  });

  it("requires deprecatedAt for deprecated packages", () => {
    const violations = collectLifecycleViolations(
      { experimentalMaxDays: 90, maxDeprecationMonths: 12 },
      [packageFixture({ lifecycle: "deprecated" })],
      REFERENCE_DATE_MS
    );

    expect(violations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          gate: "lifecycle",
          message: expect.stringContaining("deprecatedAt"),
        }),
      ])
    );
  });

  it("fails when deprecated longer than maxDeprecationMonths", () => {
    const violations = collectLifecycleViolations(
      { experimentalMaxDays: 90, maxDeprecationMonths: 12 },
      [
        packageFixture({
          lifecycle: "deprecated",
          deprecatedAt: "2024-01-01T00:00:00.000Z",
        }),
      ],
      REFERENCE_DATE_MS
    );

    expect(violations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          gate: "lifecycle",
          message: expect.stringContaining("maxDeprecationMonths"),
        }),
      ])
    );
  });

  it("passes for deprecated package within review window", () => {
    const violations = collectLifecycleViolations(
      { experimentalMaxDays: 90, maxDeprecationMonths: 12 },
      [
        packageFixture({
          lifecycle: "deprecated",
          deprecatedAt: "2026-01-01T00:00:00.000Z",
        }),
      ],
      REFERENCE_DATE_MS
    );

    expect(violations).toHaveLength(0);
  });
});
