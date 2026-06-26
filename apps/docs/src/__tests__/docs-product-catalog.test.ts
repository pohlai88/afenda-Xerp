import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  CATALOG_FILE_NAMES,
  CATALOG_IDS,
  type CatalogId,
} from "@/lib/docs-product-catalog.contract";
import {
  assertCatalogIdsComplete,
  parseProductCatalog,
} from "@/lib/docs-product-catalog.schema";

const dataDir = join(process.cwd(), "data");

function readCatalogJson(catalogId: CatalogId): unknown {
  const fileName = CATALOG_FILE_NAMES[catalogId];
  const filePath = join(dataDir, fileName);
  expect(existsSync(filePath)).toBe(true);
  return JSON.parse(readFileSync(filePath, "utf8")) as unknown;
}

describe("@afenda/docs product catalog snapshots", () => {
  it("registers a Zod schema for every catalog id", () => {
    expect(() => assertCatalogIdsComplete()).not.toThrow();
  });

  it.each(CATALOG_IDS)("ships %s catalog JSON with catalogId and exportedAt", (catalogId) => {
    const catalog = parseProductCatalog(catalogId, readCatalogJson(catalogId));

    expect(catalog.catalogId).toBe(catalogId);
    expect(catalog.exportedAt.length).toBeGreaterThan(0);
  });

  it("exports auth routes with lanes and segment paths", () => {
    const catalog = parseProductCatalog(
      "auth-routes",
      readCatalogJson("auth-routes")
    );

    if (catalog.catalogId !== "auth-routes") {
      throw new Error("expected auth-routes catalog");
    }

    expect(catalog.lanes.length).toBeGreaterThan(0);
    expect(catalog.routes.some((route) => route.path === "/sign-in")).toBe(true);
    expect(catalog.routes.every((route) => route.lane.length > 0)).toBe(true);
  });

  it("exports permissions without secret values", () => {
    const catalog = parseProductCatalog(
      "permissions",
      readCatalogJson("permissions")
    );

    if (catalog.catalogId !== "permissions") {
      throw new Error("expected permissions catalog");
    }

    expect(catalog.permissions.length).toBeGreaterThan(0);
    expect(
      catalog.permissions.some((entry) => entry.key.includes("system_admin"))
    ).toBe(true);

    const serialized = JSON.stringify(catalog);
    expect(serialized).not.toMatch(/secret|password|token/i);
  });

  it("exports env catalog with names only — no placeholder values", () => {
    const catalog = parseProductCatalog("env", readCatalogJson("env"));

    if (catalog.catalogId !== "env") {
      throw new Error("expected env catalog");
    }

    expect(catalog.variables.some((entry) => entry.name === "BETTER_AUTH_URL")).toBe(
      true
    );
    expect(
      catalog.variables.every((entry) => typeof entry.name === "string")
    ).toBe(true);
    expect(JSON.stringify(catalog)).not.toContain("sb_publishable_");
  });

  it("rejects malformed catalog snapshots", () => {
    expect(() =>
      parseProductCatalog("auth-routes", { catalogId: "auth-routes" })
    ).toThrow(/Invalid auth-routes catalog snapshot/);
  });

  it("generates module stub pages for every modules.catalog.json entry", () => {
    const modules = parseProductCatalog("modules", readCatalogJson("modules"));

    if (modules.catalogId !== "modules") {
      throw new Error("expected modules catalog");
    }

    const modulesDir = join(process.cwd(), "content/docs/en/integrate/modules");

    for (const module of modules.modules) {
      const pagePath = join(modulesDir, `${module.moduleId}.mdx`);
      expect(existsSync(pagePath), pagePath).toBe(true);
    }

    expect(existsSync(join(modulesDir, "index.mdx"))).toBe(true);
    expect(existsSync(join(modulesDir, "meta.json"))).toBe(true);
  });

  it("matches catalogBindings keys used by task articles", () => {
    const bindingKeys = new Set<CatalogId>(CATALOG_IDS);
    const taskArticlesDir = join(process.cwd(), "content/docs/en");
    const taskPaths = [
      "use-erp/sign-in.mdx",
      "configure-tenant/users-and-memberships.mdx",
      "configure-tenant/roles-and-permissions.mdx",
      "operate-tenant/environment-and-auth.mdx",
      "operate-tenant/troubleshooting-login.mdx",
    ];

    for (const relativePath of taskPaths) {
      const source = readFileSync(join(taskArticlesDir, relativePath), "utf8");
      const match = /^catalogBindings:\s*\n((?:\s+-\s+.+\n)+)/m.exec(source);
      expect(match, `${relativePath} missing catalogBindings`).toBeTruthy();

      const bindings = [...(match?.[1] ?? "").matchAll(/-\s+(\S+)/g)].map(
        (entry) => entry[1]
      );

      for (const binding of bindings) {
        expect(bindingKeys.has(binding as CatalogId)).toBe(true);
      }
    }
  });
});
