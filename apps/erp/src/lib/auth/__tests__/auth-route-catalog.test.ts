import { describe, expect, it } from "vitest";
import { AUTH_INGRESS_CANONICAL_SURFACES } from "../auth-ingress-surface.registry";
import { AUTH_PATHS } from "../auth-path.registry";
import {
  AUTH_ROUTE_CATALOG,
  resolveAuthRouteDescription,
  resolveAuthRouteTitle,
} from "../auth-route-catalog";
import {
  assertAuthRouteCatalogAppPagesExist,
  assertAuthRouteCatalogIngressPageLoads,
  assertAuthRouteCatalogIngressSurfaces,
  assertAuthRouteCatalogShellVariants,
} from "./support/auth-route-catalog.harness";

describe("auth-route-catalog SSOT", () => {
  it("covers every ingress surface path", () => {
    expect(AUTH_ROUTE_CATALOG.length).toBe(
      AUTH_INGRESS_CANONICAL_SURFACES.length
    );
  });

  it("maps each catalog path to shell variant, ingress surface, and loader", () => {
    assertAuthRouteCatalogShellVariants();
    assertAuthRouteCatalogIngressSurfaces();
    assertAuthRouteCatalogIngressPageLoads();
    assertAuthRouteCatalogAppPagesExist();
  });

  it("resolves sign-in copy from catalog", () => {
    expect(resolveAuthRouteTitle(AUTH_PATHS.signIn)).toBe("Sign in");
    expect(resolveAuthRouteDescription(AUTH_PATHS.signIn)).toContain(
      "Afenda ERP"
    );
  });
});
