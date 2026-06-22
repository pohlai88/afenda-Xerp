import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const contextRoot = join(import.meta.dirname, "..");

function readContextSource(fileName: string): string {
  return readFileSync(join(contextRoot, fileName), "utf8");
}

describe("ERP context module wiring (post-extraction)", () => {
  it("orchestrator delegates to legal entity and grant scope modules", () => {
    const source = readContextSource("resolve-operating-context.server.ts");

    expect(source).toContain("resolveLegalEntityContext");
    expect(source).toContain("resolveGrantScope");
    expect(source).toContain("verifyProjectSelection");
    expect(source).toContain("denyOperatingContext");
    expect(source).not.toContain("resolveScopedMembership");
    expect(source).not.toContain("resolvePermissionScopeContext");
  });

  it("header resolver uses tenant-domain.server selection builder", () => {
    const source = readContextSource(
      "resolve-operating-context-from-headers.server.ts"
    );

    expect(source).toContain("buildOperatingContextSelectionFromRequest");
    expect(source).not.toContain("TENANT_SLUG_HEADER");
  });

  it("grant scope module delegates to permissions package", () => {
    const source = readContextSource("resolve-grant-scope.server.ts");

    expect(source).toContain("resolvePermissionScopeContext");
    expect(source).toContain("resolveScopedMembership");
    expect(source).toContain("loadActorMemberships");
  });

  it("legal entity module maps company rows without permission engine calls", () => {
    const source = readContextSource("resolve-legal-entity-context.server.ts");

    expect(source).toContain("toLegalEntityContext");
    expect(source).toContain("verifyEntityGroupBoundary");
    expect(source).not.toContain("resolveScopedMembership");
    expect(source).not.toContain("requirePermission");
    expect(source).not.toContain("resolvePermissionScopeContext");
  });
});
