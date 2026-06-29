import { describe, expect, it, vi } from "vitest";
import { createValidationResult } from "../contracts/validation-result.contract.js";
import type { DiscoveredWorkspace } from "../contracts/workspace.contract.js";
import { validateArchitecture } from "../validators/validate-architecture.js";
import * as validateFoundationDispositionModule from "../validators/validate-foundation-disposition.js";
import * as validateLifecycleModule from "../validators/validate-lifecycle.js";

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

/** ADR-0027 baseline — matches dependency-registry.data.ts (2026-06-29). */
function baselineWorkspaces(): DiscoveredWorkspace[] {
  return [
    workspace("@afenda/accounting-standards", {
      "@afenda/kernel": "workspace:*",
    }),
    workspace("@afenda/auth", {
      "@afenda/database": "workspace:*",
      "@afenda/kernel": "workspace:*",
    }),
    workspace("@afenda/database", { "@afenda/observability": "workspace:*" }),
    workspace("@afenda/shadcn-studio"),
    workspace("@afenda/docs", {
      "@afenda/enterprise-knowledge": "workspace:*",
    }),
    workspace("@afenda/email"),
    workspace("@afenda/enterprise-knowledge"),
    workspace("@afenda/entitlements", { "@afenda/database": "workspace:*" }),
    workspace("@afenda/erp", {
      "@afenda/auth": "workspace:*",
      "@afenda/database": "workspace:*",
      "@afenda/observability": "workspace:*",
      "@afenda/shadcn-studio": "workspace:*",
    }),
    workspace("@afenda/execution", {
      "@afenda/kernel": "workspace:*",
      "@afenda/observability": "workspace:*",
    }),
    workspace("@afenda/feature-flags", {
      "@afenda/entitlements": "workspace:*",
    }),
    workspace("@afenda/kernel"),
    workspace("@afenda/observability"),
    workspace("@afenda/permissions", {
      "@afenda/auth": "workspace:*",
      "@afenda/database": "workspace:*",
      "@afenda/kernel": "workspace:*",
    }),
    workspace("@afenda/storybook", {
      "@afenda/shadcn-studio": "workspace:*",
    }),
    workspace("@afenda/storage"),
    workspace("@afenda/testing"),
    workspace("@afenda/typescript-config"),
    workspace("@afenda/architecture-authority"),
    workspace("@afenda/ai-governance", {
      "@afenda/architecture-authority": "workspace:*",
    }),
  ];
}

describe("validateArchitecture", () => {
  it("passes for the ADR-0027 baseline workspace graph", () => {
    const result = validateArchitecture(baselineWorkspaces());
    expect(result.ok).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it("fails for unregistered packages", () => {
    const result = validateArchitecture([workspace("@afenda/not-registered")]);
    expect(result.ok).toBe(false);
    expect(result.violations.some((v) => v.gate === "registry")).toBe(true);
  });

  it("fails for circular dependencies", () => {
    const result = validateArchitecture([
      workspace("@afenda/kernel", { "@afenda/execution": "workspace:*" }),
      workspace("@afenda/execution", { "@afenda/kernel": "workspace:*" }),
      workspace("@afenda/observability"),
      workspace("@afenda/auth", { "@afenda/database": "workspace:*" }),
      workspace("@afenda/database", { "@afenda/observability": "workspace:*" }),
      workspace("@afenda/docs", {
        "@afenda/enterprise-knowledge": "workspace:*",
      }),
      workspace("@afenda/email"),
      workspace("@afenda/entitlements", { "@afenda/database": "workspace:*" }),
      workspace("@afenda/erp", {
        "@afenda/auth": "workspace:*",
        "@afenda/database": "workspace:*",
        "@afenda/observability": "workspace:*",
        "@afenda/shadcn-studio": "workspace:*",
      }),
      workspace("@afenda/feature-flags", {
        "@afenda/entitlements": "workspace:*",
      }),
      workspace("@afenda/permissions", {
        "@afenda/auth": "workspace:*",
        "@afenda/database": "workspace:*",
        "@afenda/kernel": "workspace:*",
      }),
      workspace("@afenda/storage"),
      workspace("@afenda/testing"),
      workspace("@afenda/typescript-config"),
      workspace("@afenda/shadcn-studio"),
      workspace("@afenda/architecture-authority"),
    ]);
    expect(result.ok).toBe(false);
    expect(result.violations.some((v) => v.gate === "cycles")).toBe(true);
  });

  it("merges foundation disposition failures into composite validation", () => {
    vi.spyOn(
      validateFoundationDispositionModule,
      "validateFoundationDisposition"
    ).mockReturnValue(
      createValidationResult([
        {
          gate: "foundation-disposition",
          message: "TEST: disposition failure",
        },
      ])
    );

    const result = validateArchitecture([workspace("@afenda/kernel")]);
    expect(result.ok).toBe(false);
    expect(
      result.violations.some((v) => v.gate === "foundation-disposition")
    ).toBe(true);

    vi.restoreAllMocks();
  });

  it("merges lifecycle failures into composite validation", () => {
    vi.spyOn(validateLifecycleModule, "validateLifecycle").mockReturnValue(
      createValidationResult([
        {
          gate: "lifecycle",
          message: "TEST: lifecycle failure",
        },
      ])
    );

    const result = validateArchitecture([workspace("@afenda/kernel")]);
    expect(result.ok).toBe(false);
    expect(result.violations.some((v) => v.gate === "lifecycle")).toBe(true);

    vi.restoreAllMocks();
  });
});
