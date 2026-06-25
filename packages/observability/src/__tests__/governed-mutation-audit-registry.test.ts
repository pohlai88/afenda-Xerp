import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  GOVERNED_MUTATION_API_AUDIT_MODULES,
  GOVERNED_MUTATION_AUDIT_ENFORCEMENT_MODULE,
  GOVERNED_MUTATION_AUDIT_GATE_SCRIPT,
  GOVERNED_MUTATION_SERVER_ACTION_MODULES,
} from "../surface/governed-mutation-audit-registry.js";

const repoRoot = fileURLToPath(new URL("../../../..", import.meta.url));

describe("governed-mutation-audit-registry", () => {
  it("declares enforcement and gate script paths that exist", () => {
    expect(
      existsSync(join(repoRoot, GOVERNED_MUTATION_AUDIT_ENFORCEMENT_MODULE))
    ).toBe(true);
    expect(
      existsSync(join(repoRoot, GOVERNED_MUTATION_AUDIT_GATE_SCRIPT))
    ).toBe(true);
  });

  it("lists API audit wiring modules with required symbols", () => {
    for (const module of GOVERNED_MUTATION_API_AUDIT_MODULES) {
      const source = readFileSync(join(repoRoot, module.path), "utf8");

      for (const symbol of module.requiredSymbols) {
        expect(source, module.path).toContain(symbol);
      }
    }
  });

  it("lists governed server actions that exist on disk", () => {
    for (const module of GOVERNED_MUTATION_SERVER_ACTION_MODULES) {
      expect(existsSync(join(repoRoot, module.path)), module.path).toBe(true);
    }
  });

  it("requires auditExemptionReason when auditRequired is false", () => {
    for (const module of GOVERNED_MUTATION_SERVER_ACTION_MODULES) {
      if (module.auditRequired) {
        continue;
      }

      expect(
        "auditExemptionReason" in module
          ? module.auditExemptionReason
          : undefined,
        `${module.path} must declare auditExemptionReason`
      ).toBeTruthy();
    }
  });
});
