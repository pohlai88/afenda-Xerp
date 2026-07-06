import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";
import { ERP_SRC_ROOT } from "@/__tests__/support/erp-test-paths";

import { PUBLIC_APP_ROUTER_PATH_PREFIXES } from "@/lib/auth/auth-protected-surface.registry";
import {
  ERROR_PAGE_CANONICAL_SURFACES,
  ERROR_PAGE_NOT_FOUND_VARIANT,
  ERROR_PAGE_PUBLIC_PATH_PREFIXES,
  ERROR_PAGE_REDIRECT_ALIASES,
  ERROR_PAGE_SHELL_BLOCK_ID,
  ERROR_PAGE_VARIANTS,
  getErrorPageSurfaceByPath,
  isErrorPageCanonicalPath,
} from "@/lib/presentation/error-page-surface.registry";

describe("error-page-surface.registry", () => {
  it("registers serializable canonical surfaces", () => {
    for (const surface of ERROR_PAGE_CANONICAL_SURFACES) {
      expect(JSON.parse(JSON.stringify(surface))).toEqual(surface);
      expect(ERROR_PAGE_VARIANTS).toContain(surface.variant);
      expect(surface.blockId).toBe(ERROR_PAGE_SHELL_BLOCK_ID);
    }
  });

  it("maps canonical paths to variants", () => {
    expect(getErrorPageSurfaceByPath("/access-denied")?.variant).toBe("403");
    expect(getErrorPageSurfaceByPath("/session-expired")?.variant).toBe(
      "error-session-expired"
    );
    expect(getErrorPageSurfaceByPath("/maintenance")?.variant).toBe(
      "maintenance"
    );
  });

  it("uses not-found variant for framework 404", () => {
    expect(ERROR_PAGE_NOT_FOUND_VARIANT).toBe("404");
    expect(getErrorPageSurfaceByPath("/missing")).toBeUndefined();
  });

  it("keeps canonical paths public in auth-protected-surface registry", () => {
    for (const path of ERROR_PAGE_PUBLIC_PATH_PREFIXES) {
      expect(PUBLIC_APP_ROUTER_PATH_PREFIXES).toContain(path);
    }
  });

  it("does not register numeric aliases as canonical pages", () => {
    for (const alias of ERROR_PAGE_REDIRECT_ALIASES) {
      expect(isErrorPageCanonicalPath(alias.source)).toBe(false);
      expect(ERROR_PAGE_PUBLIC_PATH_PREFIXES).not.toContain(alias.source);
    }
  });

  it("maps each canonical surface to an app route page file", () => {
    const appRoot = join(ERP_SRC_ROOT, "app");

    function findAppPageFile(routePath: string): string | undefined {
      const leaf = join(routePath.replace(/^\//, ""), "page.tsx");
      const direct = join(appRoot, leaf);
      if (existsSync(direct)) {
        return direct;
      }

      for (const routeGroup of ["(auth)", "(protected)", "(public)"] as const) {
        const grouped = join(appRoot, routeGroup, leaf);
        if (existsSync(grouped)) {
          return grouped;
        }
      }

      return undefined;
    }

    for (const surface of ERROR_PAGE_CANONICAL_SURFACES) {
      expect(findAppPageFile(surface.path)).toBeDefined();
    }

    for (const alias of ERROR_PAGE_REDIRECT_ALIASES) {
      expect(findAppPageFile(alias.source)).toBeUndefined();
    }
  });
});
