import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";
import {
  AUTH_INGRESS_CANONICAL_SURFACES,
  AUTH_INGRESS_PUBLIC_PATH_PREFIXES,
  AUTH_OPERATOR_SURFACE_PREVIEW_REDIRECT,
  getAuthIngressSurfaceByPath,
  isAuthIngressCanonicalPath,
} from "../auth-ingress-surface.registry";
import { PUBLIC_APP_ROUTER_PATH_PREFIXES } from "../auth-protected-surface.registry";

describe("auth-ingress-surface.registry", () => {
  it("registers serializable canonical auth ingress surfaces", () => {
    for (const surface of AUTH_INGRESS_CANONICAL_SURFACES) {
      expect(JSON.parse(JSON.stringify(surface))).toEqual(surface);
      expect(surface.blockId).toBe("login-page-04");
    }
  });

  it("maps sign-in path to auth sign-in surface template", () => {
    expect(getAuthIngressSurfaceByPath("/sign-in")?.surfaceTemplateId).toBe(
      "surface-template.auth-sign-in"
    );
  });

  it("keeps auth ingress paths public in auth-protected-surface registry", () => {
    for (const path of AUTH_INGRESS_PUBLIC_PATH_PREFIXES) {
      expect(PUBLIC_APP_ROUTER_PATH_PREFIXES).toContain(path);
    }
  });

  it("maps each canonical ingress surface to an app route page file", () => {
    const appRoot = join(process.cwd(), "src", "app");

    for (const surface of AUTH_INGRESS_CANONICAL_SURFACES) {
      expect(isAuthIngressCanonicalPath(surface.path)).toBe(true);
      const pagePath = join(
        appRoot,
        surface.path.replace(/^\//, ""),
        "page.tsx"
      );
      expect(existsSync(pagePath)).toBe(true);
    }
  });

  it("redirects legacy operator preview path to metadata workspace", () => {
    expect(AUTH_OPERATOR_SURFACE_PREVIEW_REDIRECT.source).toBe(
      "/operator/auth/sign-in"
    );
    expect(AUTH_OPERATOR_SURFACE_PREVIEW_REDIRECT.destination).toBe(
      "/metadata-workspace"
    );
  });
});
