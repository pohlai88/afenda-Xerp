import { describe, expect, it } from "vitest";
import {
  applyFeatureCoverageHardFail,
  applyFeatureManifestOverrides,
  buildDocsFeatureManifests,
} from "@/lib/docs-feature-manifest";
import { DOCS_FEATURE_COVERAGE_HARD_FAIL_THRESHOLD } from "@/lib/docs-feature-manifest.contract";
import { bindOpenApiOperationsToManifests } from "@/lib/docs-openapi-manifest-bindings";
import { mergeFeatureManifestsWithPlatformApi } from "@/lib/docs-openapi-platform-manifests";
import { resolveDocsRepoRoot } from "@/lib/docs-repo-evidence";

describe("docs feature manifest overrides", () => {
  it("merges extra routes without replacing catalog truth", () => {
    const manifests = applyFeatureManifestOverrides(
      [
        {
          id: "inventory",
          kind: "module",
          title: "Inventory",
          audience: "end-user",
          summary: "Summary",
          productRoutes: ["/modules/inventory"],
          permissionKeys: ["inventory.stock_adjust"],
          entitlements: [],
          catalogSources: ["modules"],
        },
      ],
      {
        inventory: {
          extraProductRoutes: ["/modules/inventory/settings"],
        },
      }
    );

    expect(manifests[0]?.productRoutes).toEqual([
      "/modules/inventory",
      "/modules/inventory/settings",
    ]);
  });

  it("promotes warnings to errors when coverage score meets threshold", () => {
    const result = applyFeatureCoverageHardFail(
      {
        warnings: ["inventory: product route missing"],
        errors: [],
      },
      {
        score: DOCS_FEATURE_COVERAGE_HARD_FAIL_THRESHOLD,
        totalChecks: 10,
        failedChecks: 1,
      }
    );

    expect(result.warnings).toEqual([]);
    expect(result.errors).toContain("inventory: product route missing");
  });
});

describe("docs openapi manifest bindings", () => {
  it("binds inventory operations by primary OpenAPI tag", () => {
    const manifests = mergeFeatureManifestsWithPlatformApi({
      catalogManifests: buildDocsFeatureManifests({
        modules: {
          modules: [
            {
              moduleId: "inventory",
              label: "Inventory",
              routePath: "/modules/inventory",
              permissionKey: "inventory.stock_adjust",
              requiredEntitlements: [],
              optionalCapabilities: [],
            },
          ],
        },
        authRoutes: { lanes: [], routes: [] },
        systemAdmin: { sections: [] },
      }),
      root: resolveDocsRepoRoot(),
    });

    const bound = bindOpenApiOperationsToManifests({
      manifests,
      root: resolveDocsRepoRoot(),
    });
    const inventory = bound.manifests.find((manifest) => manifest.id === "inventory");

    expect(inventory?.apiOperations?.length ?? 0).toBeGreaterThan(0);
    expect(
      new Set(
        bound.manifests
          .flatMap((manifest) => manifest.apiOperations ?? [])
          .map((operation) => operation.id)
      ).size
    ).toBe(
      bound.manifests.reduce(
        (count, manifest) => count + (manifest.apiOperations?.length ?? 0),
        0
      )
    );
  });

  it("resolves platform-api manifests for orphan OpenAPI primary tags", () => {
    const manifests = mergeFeatureManifestsWithPlatformApi({
      catalogManifests: buildDocsFeatureManifests({
        modules: {
          modules: [
            {
              moduleId: "inventory",
              label: "Inventory",
              routePath: "/modules/inventory",
              permissionKey: "inventory.stock_adjust",
              requiredEntitlements: [],
              optionalCapabilities: [],
            },
            {
              moduleId: "workspace",
              label: "Workspace",
              routePath: "/modules/workspace",
              permissionKey: "workspace.read",
              requiredEntitlements: [],
              optionalCapabilities: [],
            },
          ],
        },
        authRoutes: { lanes: [], routes: [] },
        systemAdmin: {
          sections: [
            {
              sectionId: "users",
              label: "Users",
              href: "/system-admin/users",
              readPermissionKey: "system_admin.users_read",
            },
            {
              sectionId: "memberships",
              label: "Memberships",
              href: "/system-admin/memberships",
              readPermissionKey: "system_admin.users_read",
            },
            {
              sectionId: "audit",
              label: "Audit",
              href: "/system-admin/audit",
              readPermissionKey: "system_admin.audit_read",
            },
          ],
        },
      }),
      root: resolveDocsRepoRoot(),
    });

    expect(manifests.some((manifest) => manifest.id === "platform-health")).toBe(
      true
    );
    expect(manifests.some((manifest) => manifest.id === "platform-auth")).toBe(true);

    const bound = bindOpenApiOperationsToManifests({
      manifests,
      root: resolveDocsRepoRoot(),
    });

    expect(bound.warnings).toEqual([]);
    expect(
      bound.manifests.find((manifest) => manifest.id === "platform-health")
        ?.apiOperations?.length ?? 0
    ).toBeGreaterThan(0);
  });
});
