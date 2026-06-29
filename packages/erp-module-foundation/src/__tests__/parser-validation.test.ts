import { describe, expect, it } from "vitest";
import {
  buildProcurementFoundationBundle,
  ModuleReadinessAssertionError,
  parseAndValidateErpModuleFoundationBundle,
  parseErpModuleFoundationBundle,
  serializeErpModuleFoundationBundle,
} from "../index.js";

describe("parseAndValidateErpModuleFoundationBundle", () => {
  it("parses valid bundle JSON", () => {
    const bundle = buildProcurementFoundationBundle({
      authority: "docs/PAS/KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md",
      knowledge: "packages/enterprise-knowledge/src/data/atoms.json",
      ownership: "docs/PAS/KERNEL/audit/procurement-foundation-gap-report.md",
      contextSpine:
        "apps/erp/src/lib/context/resolve-operating-context.server.ts",
      permissions:
        "packages/kernel/src/erp-domain/procurement/procurement-permission-vocabulary.contract.ts",
      audit:
        "packages/kernel/src/erp-domain/procurement/procurement-audit-actions.contract.ts",
      tests:
        "packages/erp-module-foundation/src/__tests__/parser-validation.test.ts",
      gates: "scripts/governance/check-erp-module-foundation.mts",
    });

    const parsed = parseAndValidateErpModuleFoundationBundle(
      serializeErpModuleFoundationBundle(bundle)
    );

    expect(parsed.module.slug).toBe("procurement");
  });

  it("rejects invalid bundle after shape parse", () => {
    const bundle = buildProcurementFoundationBundle();
    const broken = JSON.parse(
      serializeErpModuleFoundationBundle(bundle)
    ) as Record<string, unknown>;
    const module = broken["module"] as Record<string, unknown>;
    module["kvId"] = "KV-BROKEN";

    expect(() =>
      parseAndValidateErpModuleFoundationBundle(JSON.stringify(broken))
    ).toThrow(ModuleReadinessAssertionError);
  });

  it("parseErpModuleFoundationBundle accepts shape-only invalid parity", () => {
    const bundle = buildProcurementFoundationBundle();
    const broken = JSON.parse(
      serializeErpModuleFoundationBundle(bundle)
    ) as Record<string, unknown>;
    const knowledge = broken["knowledge"] as Record<string, unknown>;
    knowledge["kvId"] = "KV-BROKEN";

    const parsed = parseErpModuleFoundationBundle(JSON.stringify(broken));
    expect(parsed.knowledge.kvId).toBe("KV-BROKEN");
  });
});
