import { describe, expect, it } from "vitest";

import type { ValidationGate } from "../../../packages/architecture-authority/src/contracts/validation-result.contract.ts";
import {
  ARCHITECTURE_REGISTRY_DRIFT_SOURCES,
  MULTI_TENANCY_DEPENDENCY_ENFORCEMENT_LIB,
} from "../../../packages/architecture-authority/src/surface/architecture-authority-surface-registry.ts";
import {
  ARCHITECTURE_VALIDATION_REMEDIATION_BY_GATE,
  formatArchitectureValidationRemediation,
} from "../lib/multi-tenancy-dependency-enforcement.mts";

describe("multi-tenancy-dependency-enforcement lib", () => {
  it("documents shared enforcement lib path in registry", () => {
    expect(MULTI_TENANCY_DEPENDENCY_ENFORCEMENT_LIB).toBe(
      "scripts/governance/lib/multi-tenancy-dependency-enforcement.mts"
    );
  });

  it("maps every validateArchitecture gate to a registry drift source", () => {
    const gates: ValidationGate[] = [
      "registry",
      "ownership",
      "layers",
      "dependencies",
      "forbidden-dependencies",
      "cycles",
      "exceptions",
    ];

    for (const gate of gates) {
      expect(ARCHITECTURE_VALIDATION_REMEDIATION_BY_GATE[gate]).toBeTruthy();
    }
  });

  it("parses unapproved dependency edges into actionable registry edits", () => {
    const hint = formatArchitectureValidationRemediation({
      gate: "dependencies",
      packageName: "@afenda/erp",
      message: "unapproved runtime dependency @afenda/erp → @afenda/example",
    });

    expect(hint).toContain('["@afenda/erp", "@afenda/example"]');
    expect(hint).toContain(ARCHITECTURE_REGISTRY_DRIFT_SOURCES.dependency);
    expect(hint).toContain("pnpm architecture:dependencies");
    expect(hint).toContain("pnpm quality:architecture");
  });

  it("parses missing declared dependency into package.json guidance", () => {
    const hint = formatArchitectureValidationRemediation({
      gate: "dependencies",
      packageName: "@afenda/erp",
      message:
        "declared dependency missing from package.json: @afenda/erp → @afenda/kernel",
    });

    expect(hint).toContain("@afenda/erp");
    expect(hint).toContain("@afenda/kernel");
    expect(hint).toContain("package.json");
  });

  it("routes registry gate drift to package-registry.data.ts", () => {
    const hint = formatArchitectureValidationRemediation({
      gate: "registry",
      message: "package not registered",
    });

    expect(hint).toContain(ARCHITECTURE_REGISTRY_DRIFT_SOURCES.package);
  });
});
