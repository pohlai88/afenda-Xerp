import { describe, expect, it } from "vitest";

import {
  AUTH_INGRESS_CANONICAL_SURFACES,
  AUTH_INGRESS_PUBLIC_PATH_PREFIXES,
  AUTH_OPERATOR_SURFACE_PREVIEW_REDIRECT,
  isAuthIngressCanonicalPath,
} from "../auth-ingress-surface.registry";
import { AUTH_PATHS } from "../auth-path.registry";
import { PUBLIC_APP_ROUTER_PATH_PREFIXES } from "../auth-protected-surface.registry";

const POST_AUTH_WORKSPACE_SELECTION_PATHS = new Set<string>([
  AUTH_PATHS.workspaceSelect,
  AUTH_PATHS.organizationSelect,
  AUTH_PATHS.postAuthComplete,
]);

describe("auth-ingress-surface.registry", () => {
  it("registers serializable canonical auth ingress surfaces", () => {
    for (const surface of AUTH_INGRESS_CANONICAL_SURFACES) {
      expect(JSON.parse(JSON.stringify(surface))).toEqual(surface);
      expect(surface.blockId.length).toBeGreaterThan(0);
    }
  });

  it("does not map pre-login ingress paths to login fallbacks", () => {
    for (const surface of AUTH_INGRESS_CANONICAL_SURFACES) {
      if (surface.path === "/sign-in") {
        continue;
      }

      if (POST_AUTH_WORKSPACE_SELECTION_PATHS.has(surface.path)) {
        continue;
      }

      expect(surface.blockId).not.toMatch(/^login-page-/);
    }
  });

  it("keeps auth ingress paths public in auth-protected-surface registry", () => {
    for (const path of AUTH_INGRESS_PUBLIC_PATH_PREFIXES) {
      expect(
        PUBLIC_APP_ROUTER_PATH_PREFIXES.some(
          (prefix) => path === prefix || path.startsWith(`${prefix}/`)
        )
      ).toBe(true);
    }
  });

  it("marks each canonical ingress path as canonical", () => {
    for (const surface of AUTH_INGRESS_CANONICAL_SURFACES) {
      expect(isAuthIngressCanonicalPath(surface.path)).toBe(true);
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
