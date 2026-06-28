import { describe, expect, it } from "vitest";
import type { ArchitectureException } from "../contracts/exception.contract.js";
import type { DiscoveredWorkspace } from "../contracts/workspace.contract.js";
import {
  buildDependencySnapshot,
  runtimeEdgesMatch,
} from "../reports/build-dependency-snapshot.js";
import { validateCycles } from "../validators/validate-cycles.js";
import { validateExceptionEntries } from "../validators/validate-exceptions.js";
import { validateForbiddenDependencies } from "../validators/validate-forbidden-dependencies.js";
import { findMissingOwnershipViolations } from "../validators/validate-ownership.js";
import { validateRegistry } from "../validators/validate-registry.js";

function workspace(
  name: string,
  dependencies: Record<string, string> = {}
): DiscoveredWorkspace {
  return {
    packageJson: { name, dependencies },
    packageJsonPath: `/mock/${name}/package.json`,
    root: `/mock/${name}`,
    directoryName: name.split("/").pop() ?? name,
  };
}

function baselineWorkspaces(): DiscoveredWorkspace[] {
  return [
    workspace("@afenda/appshell"),
    workspace("@afenda/auth", { "@afenda/database": "workspace:*" }),
    workspace("@afenda/database", { "@afenda/observability": "workspace:*" }),
    workspace("@afenda/design-system"),
    workspace("@afenda/docs"),
    workspace("@afenda/entitlements", { "@afenda/database": "workspace:*" }),
    workspace("@afenda/erp", {
      "@afenda/appshell": "workspace:*",
      "@afenda/auth": "workspace:*",
      "@afenda/database": "workspace:*",
      "@afenda/observability": "workspace:*",
    }),
    workspace("@afenda/execution", {
      "@afenda/kernel": "workspace:*",
      "@afenda/observability": "workspace:*",
    }),
    workspace("@afenda/feature-flags", {
      "@afenda/entitlements": "workspace:*",
    }),
    workspace("@afenda/kernel"),
    workspace("@afenda/ui-composition"),
    workspace("@afenda/metadata-ui", {
      "@afenda/design-system": "workspace:*",
      "@afenda/permissions": "workspace:*",
    }),
    workspace("@afenda/observability"),
    workspace("@afenda/permissions", {
      "@afenda/auth": "workspace:*",
      "@afenda/database": "workspace:*",
    }),
    workspace("@afenda/storage"),
    workspace("@afenda/testing"),
    workspace("@afenda/typescript-config"),
    workspace("@afenda/ui"),
    workspace("@afenda/architecture-authority"),
  ];
}

function createArchitectureException(
  overrides: Partial<ArchitectureException> = {}
): ArchitectureException {
  return {
    id: "ARCH-EXC-TEST-001",
    status: "active",
    owner: "Architecture Authority",
    evidence: ["docs/adr/ADR-0005-exception-governance.md"],
    adr: "ADR-0005",
    approvedBy: "Architecture Authority",
    expiresAt: "2027-01-01T00:00:00.000Z",
    packageName: "@afenda/example",
    reason: "temporary layer exemption",
    subject: "layer dependency",
    ...overrides,
  };
}

describe("architecture authority negative paths", () => {
  it("registry fails for unregistered workspace packages", () => {
    const result = validateRegistry([workspace("@afenda/not-registered")]);

    expect(result.ok).toBe(false);
    expect(result.violations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          gate: "registry",
          packageName: "@afenda/not-registered",
          message: expect.stringContaining("unregistered workspace package"),
        }),
      ])
    );
  });

  it("registry fails when a filesystem-required package is missing", () => {
    const result = validateRegistry([workspace("@afenda/kernel")]);

    expect(result.ok).toBe(false);
    expect(
      result.violations.some((violation) =>
        violation.message.includes("missing from filesystem")
      )
    ).toBe(true);
  });

  it("ownership fails when a workspace package has no owner entry", () => {
    const violations = findMissingOwnershipViolations(
      ["@afenda/kernel"],
      new Map()
    );

    expect(violations).toEqual([
      {
        gate: "ownership",
        packageName: "@afenda/kernel",
        message: "no ownership entry for @afenda/kernel",
      },
    ]);
  });

  it("forbidden-dependencies fails for design-layer packages depending on foundation", () => {
    const result = validateForbiddenDependencies([
      workspace("@afenda/design-system", {
        "@afenda/execution": "workspace:*",
      }),
    ]);

    expect(result.ok).toBe(false);
    expect(result.violations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          gate: "forbidden-dependencies",
          packageName: "@afenda/design-system",
          message: expect.stringContaining("forbidden layer dependency"),
        }),
      ])
    );
  });

  it("cycles fails when runtime workspace dependencies form a loop", () => {
    const result = validateCycles([
      workspace("@afenda/kernel", { "@afenda/execution": "workspace:*" }),
      workspace("@afenda/execution", { "@afenda/kernel": "workspace:*" }),
    ]);

    expect(result.ok).toBe(false);
    expect(
      result.violations.some((violation) => violation.gate === "cycles")
    ).toBe(true);
  });

  it("exceptions fails when an approved exception is past expiry", () => {
    const expiredException = createArchitectureException({
      expiresAt: "2020-01-01T00:00:00.000Z",
    });

    const result = validateExceptionEntries(
      [expiredException],
      Date.parse("2026-06-20T00:00:00.000Z")
    );

    expect(result.ok).toBe(false);
    expect(result.violations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          gate: "exceptions",
          packageName: "@afenda/example",
          message: expect.stringContaining("expired exception"),
        }),
      ])
    );
  });

  it("exceptions fails when an active exception has blank evidence", () => {
    const result = validateExceptionEntries([
      createArchitectureException({ evidence: ["  "] }),
    ]);

    expect(result.ok).toBe(false);
    expect(result.violations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          gate: "exceptions",
          packageName: "@afenda/example",
          message: expect.stringContaining("requires non-empty evidence"),
        }),
      ])
    );
  });

  it("exceptions fails when an active exception has a blank id", () => {
    const result = validateExceptionEntries([
      createArchitectureException({ id: "   " }),
    ]);

    expect(result.ok).toBe(false);
    expect(result.violations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          gate: "exceptions",
          packageName: "@afenda/example",
          message: expect.stringContaining("has invalid id"),
        }),
      ])
    );
  });

  it("drift snapshot detects when live runtime edges diverge from committed snapshot", () => {
    const baseline = baselineWorkspaces();
    const committed = buildDependencySnapshot(baseline);

    expect(
      runtimeEdgesMatch(
        buildDependencySnapshot(baseline).runtimeEdges,
        committed.runtimeEdges
      )
    ).toBe(true);

    const driftedBaseline = baseline.map((ws) =>
      ws.packageJson.name === "@afenda/kernel"
        ? workspace("@afenda/kernel", { "@afenda/erp": "workspace:*" })
        : ws
    );

    expect(
      runtimeEdgesMatch(
        buildDependencySnapshot(driftedBaseline).runtimeEdges,
        committed.runtimeEdges
      )
    ).toBe(false);
  });
});
