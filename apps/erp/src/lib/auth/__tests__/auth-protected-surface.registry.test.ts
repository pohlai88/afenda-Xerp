import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  AUTH_PROTECTED_SURFACE_REGISTRY,
  AUTH_SESSION_DELEGATES,
} from "../auth-protected-surface.registry";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..");

function readAppSource(relativePath: string): string {
  return readFileSync(join(appRoot, relativePath), "utf8");
}

describe("auth-protected-surface.registry", () => {
  it("lists every protected integration surface with session and context delegates", () => {
    expect(AUTH_PROTECTED_SURFACE_REGISTRY.length).toBeGreaterThanOrEqual(6);
    expect(AUTH_PROTECTED_SURFACE_REGISTRY.map((entry) => entry.id)).toEqual(
      expect.arrayContaining([
        "protected-layout",
        "protected-api-authorization",
        "protected-server-actions",
        "session-guard",
        "system-admin-context",
        "dashboard-widget-context",
      ])
    );
  });

  it("uses governed session delegates only", () => {
    const allowed = new Set(Object.values(AUTH_SESSION_DELEGATES));

    for (const entry of AUTH_PROTECTED_SURFACE_REGISTRY) {
      expect(allowed.has(entry.sessionDelegate)).toBe(true);
    }
  });

  for (const entry of AUTH_PROTECTED_SURFACE_REGISTRY) {
    it(`${entry.id} wires ${entry.sessionDelegate} in ${entry.module}`, () => {
      const source = readAppSource(entry.module);
      expect(source).toContain(entry.sessionDelegate);
      if ("contextDelegate" in entry && entry.contextDelegate !== undefined) {
        expect(source).toContain(entry.contextDelegate);
      }
      expect(source).not.toMatch(/session\.user\.tenantId/);
      expect(source).not.toMatch(/session\.user\.companyId/);
    });
  }
});
