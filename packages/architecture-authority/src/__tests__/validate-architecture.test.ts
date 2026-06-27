import { describe, expect, it, vi } from "vitest";
import { createValidationResult } from "../contracts/validation-result.contract.js";
import type { DiscoveredWorkspace } from "../contracts/workspace.contract.js";
import { validateArchitecture } from "../validators/validate-architecture.js";
import * as validateFoundationDispositionModule from "../validators/validate-foundation-disposition.js";

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

describe("validateArchitecture", () => {
  it("passes for the baseline workspace graph", () => {
    const workspaces: DiscoveredWorkspace[] = [
      workspace("@afenda/appshell", {
        "@afenda/ui": "workspace:*",
        "@afenda/kernel": "workspace:*",
      }),
      workspace("@afenda/auth", {
        "@afenda/database": "workspace:*",
        "@afenda/kernel": "workspace:*",
      }),
      workspace("@afenda/database", { "@afenda/observability": "workspace:*" }),
      workspace("@afenda/design-system"),
      workspace("@afenda/docs"),
      workspace("@afenda/email"),
      workspace("@afenda/entitlements", { "@afenda/database": "workspace:*" }),
      workspace("@afenda/erp", {
        "@afenda/appshell": "workspace:*",
        "@afenda/auth": "workspace:*",
        "@afenda/database": "workspace:*",
        "@afenda/design-system": "workspace:*",
        "@afenda/entitlements": "workspace:*",
        "@afenda/execution": "workspace:*",
        "@afenda/feature-flags": "workspace:*",
        "@afenda/kernel": "workspace:*",
        "@afenda/metadata": "workspace:*",
        "@afenda/metadata-ui": "workspace:*",
        "@afenda/observability": "workspace:*",
        "@afenda/permissions": "workspace:*",
        "@afenda/storage": "workspace:*",
        "@afenda/ui": "workspace:*",
      }),
      workspace("@afenda/execution", {
        "@afenda/kernel": "workspace:*",
        "@afenda/observability": "workspace:*",
      }),
      workspace("@afenda/feature-flags", {
        "@afenda/entitlements": "workspace:*",
      }),
      workspace("@afenda/kernel"),
      workspace("@afenda/metadata"),
      workspace("@afenda/metadata-ui", {
        "@afenda/metadata": "workspace:*",
        "@afenda/ui": "workspace:*",
      }),
      workspace("@afenda/observability"),
      workspace("@afenda/permissions", {
        "@afenda/auth": "workspace:*",
        "@afenda/database": "workspace:*",
        "@afenda/kernel": "workspace:*",
      }),
      workspace("@afenda/storybook", {
        "@afenda/appshell": "workspace:*",
        "@afenda/design-system": "workspace:*",
        "@afenda/metadata": "workspace:*",
        "@afenda/metadata-ui": "workspace:*",
        "@afenda/ui": "workspace:*",
      }),
      workspace("@afenda/storage"),
      workspace("@afenda/testing"),
      workspace("@afenda/typescript-config"),
      workspace("@afenda/ui", { "@afenda/design-system": "workspace:*" }),
      workspace("@afenda/architecture-authority"),
      workspace("@afenda/ai-governance", {
        "@afenda/architecture-authority": "workspace:*",
      }),
    ];

    const result = validateArchitecture(workspaces);
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
      workspace("@afenda/appshell", { "@afenda/ui": "workspace:*" }),
      workspace("@afenda/auth", { "@afenda/database": "workspace:*" }),
      workspace("@afenda/database", { "@afenda/observability": "workspace:*" }),
      workspace("@afenda/design-system"),
      workspace("@afenda/docs"),
      workspace("@afenda/email"),
      workspace("@afenda/entitlements", { "@afenda/database": "workspace:*" }),
      workspace("@afenda/erp", {
        "@afenda/appshell": "workspace:*",
        "@afenda/auth": "workspace:*",
        "@afenda/database": "workspace:*",
        "@afenda/design-system": "workspace:*",
        "@afenda/entitlements": "workspace:*",
        "@afenda/execution": "workspace:*",
        "@afenda/feature-flags": "workspace:*",
        "@afenda/kernel": "workspace:*",
        "@afenda/metadata": "workspace:*",
        "@afenda/metadata-ui": "workspace:*",
        "@afenda/observability": "workspace:*",
        "@afenda/permissions": "workspace:*",
        "@afenda/storage": "workspace:*",
        "@afenda/ui": "workspace:*",
      }),
      workspace("@afenda/feature-flags", {
        "@afenda/entitlements": "workspace:*",
      }),
      workspace("@afenda/metadata"),
      workspace("@afenda/metadata-ui", {
        "@afenda/metadata": "workspace:*",
        "@afenda/ui": "workspace:*",
      }),
      workspace("@afenda/permissions", {
        "@afenda/auth": "workspace:*",
        "@afenda/database": "workspace:*",
        "@afenda/kernel": "workspace:*",
      }),
      workspace("@afenda/storage"),
      workspace("@afenda/testing"),
      workspace("@afenda/typescript-config"),
      workspace("@afenda/ui", { "@afenda/design-system": "workspace:*" }),
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
});
