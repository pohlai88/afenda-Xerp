import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildDocsFeatureManifests } from "@/lib/docs-feature-manifest";
import { docsLocaleContentRoot } from "@/lib/docs-page-path";
import { docsDefaultLocale } from "@/lib/i18n";
import type {
  AuthRoutesCatalog,
  ModulesCatalog,
  SystemAdminCatalog,
} from "@/lib/docs-product-catalog.contract";

const contentRoot = docsLocaleContentRoot(docsDefaultLocale);
const dataDir = join(process.cwd(), "data");

const TASK_ARTICLES = [
  {
    path: "use-erp/sign-in.mdx",
    audience: "end-user",
    catalogBindings: ["auth-routes"],
    relatedManifestIds: ["auth-lane-access", "auth-lane-security", "auth-lane-workspace"],
  },
  {
    path: "configure-tenant/users-and-memberships.mdx",
    audience: "tenant-admin",
    catalogBindings: ["system-admin", "auth-routes"],
    relatedManifestIds: ["admin-users", "admin-memberships"],
  },
  {
    path: "configure-tenant/roles-and-permissions.mdx",
    audience: "tenant-admin",
    catalogBindings: ["permissions", "system-admin"],
    relatedManifestIds: ["admin-permissions", "admin-roles"],
  },
  {
    path: "operate-tenant/environment-and-auth.mdx",
    audience: "tenant-devops",
    catalogBindings: ["env", "auth-routes"],
    relatedManifestIds: ["auth-lane-access", "admin-settings"],
  },
  {
    path: "operate-tenant/troubleshooting-login.mdx",
    audience: "tenant-devops",
    catalogBindings: ["auth-routes"],
    relatedManifestIds: ["auth-lane-access", "auth-lane-security", "auth-lane-recover"],
  },
] as const;

function readTaskArticle(relativePath: string): string {
  return readFileSync(join(contentRoot, relativePath), "utf8");
}

function parseFrontmatterList(source: string, key: string): string[] {
  const match = new RegExp(`^${key}:\\s*\\n((?:\\s+-\\s+.+\n)+)`, "m").exec(source);
  if (!match?.[1]) {
    return [];
  }
  return [...match[1].matchAll(/-\s+(\S+)/g)].map((entry) => entry[1] ?? "");
}

function readCatalog<T>(fileName: string): T {
  return JSON.parse(readFileSync(join(dataDir, fileName), "utf8")) as T;
}

describe("@afenda/docs task articles (ARCH-DOCS-002 Slice 1)", () => {
  it.each(TASK_ARTICLES)(
    "$path publishes audience and catalogBindings frontmatter",
    ({ path, audience, catalogBindings, relatedManifestIds }) => {
      const source = readTaskArticle(path);

      expect(source).toContain(`audience: ${audience}`);
      expect(parseFrontmatterList(source, "catalogBindings")).toEqual([
        ...catalogBindings,
      ]);
      expect(parseFrontmatterList(source, "relatedManifestIds")).toEqual([
        ...relatedManifestIds,
      ]);
      expect(source).toContain("<GeneratedReference");
    }
  );

  it("resolves relatedManifestIds against compiled feature manifests", () => {
    const manifests = buildDocsFeatureManifests({
      modules: readCatalog<ModulesCatalog>("modules.catalog.json"),
      authRoutes: readCatalog<AuthRoutesCatalog>("auth-routes.catalog.json"),
      systemAdmin: readCatalog<SystemAdminCatalog>("system-admin.catalog.json"),
    });
    const manifestIds = new Set(manifests.map((manifest) => manifest.id));

    for (const article of TASK_ARTICLES) {
      for (const manifestId of article.relatedManifestIds) {
        expect(manifestIds.has(manifestId)).toBe(true);
      }
    }
  });

  it("registers all five task articles in section meta.json files", () => {
    const useErp = JSON.parse(
      readFileSync(join(contentRoot, "use-erp/meta.json"), "utf8")
    ) as { pages: string[] };
    const configureTenant = JSON.parse(
      readFileSync(join(contentRoot, "configure-tenant/meta.json"), "utf8")
    ) as { pages: string[] };
    const operateTenant = JSON.parse(
      readFileSync(join(contentRoot, "operate-tenant/meta.json"), "utf8")
    ) as { pages: string[] };

    expect(useErp.pages).toEqual(
      expect.arrayContaining(["index", "sign-in", "auth-lanes", "modules"])
    );
    expect(configureTenant.pages).toEqual(
      expect.arrayContaining(["index", "users-and-memberships", "roles-and-permissions"])
    );
    expect(operateTenant.pages).toEqual(
      expect.arrayContaining([
        "index",
        "environment-and-auth",
        "troubleshooting-login",
      ])
    );
  });
});
