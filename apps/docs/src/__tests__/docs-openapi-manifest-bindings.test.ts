import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type { DocsFeatureManifest } from "@/lib/docs-feature-manifest.contract";
import { bindOpenApiOperationsToManifests } from "@/lib/docs-openapi-manifest-bindings";
import { resolveDocsRepoRoot } from "@/lib/docs-repo-evidence";

describe("docs-openapi-manifest-bindings", () => {
  it("binds resource-oriented system-admin routes to admin section manifests", () => {
    const manifests: DocsFeatureManifest[] = [
      {
        apiOperations: [],
        audience: "tenant-admin",
        catalogSources: ["system-admin"],
        entitlements: [],
        id: "admin-users",
        kind: "admin-section",
        permissionKeys: ["system_admin.users_read"],
        productRoutes: ["/system-admin/users"],
        summary: "Users",
        title: "Users",
      },
      {
        apiOperations: [],
        audience: "tenant-admin",
        catalogSources: ["system-admin"],
        entitlements: [],
        id: "admin-memberships",
        kind: "admin-section",
        permissionKeys: ["system_admin.users_read"],
        productRoutes: ["/system-admin/memberships"],
        summary: "Memberships",
        title: "Memberships",
      },
    ];

    const root = resolveDocsRepoRoot();
    const bound = bindOpenApiOperationsToManifests({
      manifests,
      root,
    });

    const users = bound.manifests.find((manifest) => manifest.id === "admin-users");
    const memberships = bound.manifests.find(
      (manifest) => manifest.id === "admin-memberships"
    );

    expect(
      users?.apiOperations?.some(
        (operation) =>
          operation.id === "internal.v1.system-admin.user-invitations.post"
      )
    ).toBe(true);
    expect(
      memberships?.apiOperations?.some(
        (operation) =>
          operation.id ===
          "internal.v1.system-admin.membership-role-assignments.post"
      )
    ).toBe(true);
  });

  it("reads the exported OpenAPI spec from apps/docs/openapi", () => {
    const specPath = join(
      resolveDocsRepoRoot(),
      "apps/docs/openapi/afenda-internal-v1.openapi.json"
    );
    const spec = JSON.parse(readFileSync(specPath, "utf8")) as {
      paths?: Record<string, unknown>;
    };

    expect(spec.paths?.["/system-admin/user-invitations"]).toBeDefined();
    expect(spec.paths?.["/system-admin/membership-role-assignments"]).toBeDefined();
  });
});
