import { afterEach, describe, expect, it, vi } from "vitest";
import type { PackageOwnership } from "../contracts/ownership.contract.js";
import type { PackageDefinition } from "../contracts/package.contract.js";
import type { DiscoveredWorkspace } from "../contracts/workspace.contract.js";

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

function activePackage(packageName: string): PackageDefinition {
  return {
    registryId: `TEST-${packageName}`,
    packageName,
    path: `packages/${nameToPathSegment(packageName)}`,
    layer: "Platform",
    lifecycle: "active",
    purpose: "Test package",
    publicApiOwner: "Platform Authority",
    layerDepExempt: false,
    filesystemRequired: true,
  };
}

function ownershipEntry(packageName: string): PackageOwnership {
  return {
    packageName,
    ownerDomain: "Platform Authority",
    authorityLevel: "platform",
  };
}

function nameToPathSegment(packageName: string): string {
  const [, scope, name] = packageName.match(/^@([^/]+)\/(.+)$/) ?? [];
  return `${scope}-${name}`;
}

async function importValidateOwnershipWithMocks(options: {
  readonly activePackages: readonly PackageDefinition[];
  readonly ownershipRows: readonly PackageOwnership[];
}) {
  vi.resetModules();

  vi.doMock("../data/package-registry.data.js", () => ({
    packageContract: {
      fingerprint: "test-fingerprint",
      packages: [...options.activePackages],
    },
  }));

  vi.doMock("../data/ownership-registry.data.js", () => {
    const ownershipByPackage = new Map(
      options.ownershipRows.map((entry) => [entry.packageName, entry])
    );

    return {
      ownershipByPackage,
      ownershipContract: {
        packages: [...options.ownershipRows],
      },
    };
  });

  return import("../validators/validate-ownership.js");
}

afterEach(() => {
  vi.doUnmock("../data/package-registry.data.js");
  vi.doUnmock("../data/ownership-registry.data.js");
  vi.resetModules();
});

describe("validateOwnership", () => {
  it("fails when an active registry package has no ownership row even without a discovered workspace", async () => {
    const { validateOwnership } = await importValidateOwnershipWithMocks({
      activePackages: [activePackage("@afenda/missing-owner")],
      ownershipRows: [],
    });

    const result = validateOwnership([]);

    expect(result.ok).toBe(false);
    expect(result.violations).toEqual([
      {
        gate: "ownership",
        packageName: "@afenda/missing-owner",
        message: "no ownership entry for @afenda/missing-owner",
      },
    ]);
  });

  it("keeps workspace ownership checks for discovered packages outside the active registry set", async () => {
    const { validateOwnership } = await importValidateOwnershipWithMocks({
      activePackages: [activePackage("@afenda/owned-active")],
      ownershipRows: [ownershipEntry("@afenda/owned-active")],
    });

    const result = validateOwnership([
      workspace("@afenda/workspace-without-owner"),
    ]);

    expect(result.ok).toBe(false);
    expect(result.violations).toEqual([
      {
        gate: "ownership",
        packageName: "@afenda/workspace-without-owner",
        message: "no ownership entry for @afenda/workspace-without-owner",
      },
    ]);
  });
});
