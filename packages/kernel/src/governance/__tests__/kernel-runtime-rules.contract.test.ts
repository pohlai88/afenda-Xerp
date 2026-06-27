import { describe, expect, it } from "vitest";
import {
  getKernelRuntimeRule,
  isKernelRuntimeRuleId,
  KERNEL_APPROVED_RUNTIME_PRIMITIVES,
  KERNEL_RUNTIME_RULE_IDS,
  KERNEL_RUNTIME_RULES,
  KERNEL_RUNTIME_RULES_AUTHORITY,
  KERNEL_RUNTIME_RULES_POLICY,
  listKernelRuntimeRules,
} from "../index.js";

const PAS_SECTION_10_LABELS = [
  "It has zero external dependencies.",
  "It does not access database, HTTP, filesystem, auth, permission engine, observability sink, UI runtime, or environment secrets.",
  "It supports cross-package execution safety.",
  "It is tested for isolation.",
  "It fails closed.",
  "It has no application-specific behavior.",
  "It carries only kernel-approved context frame fields.",
] as const;

describe("kernel runtime rules (PAS §10)", () => {
  it("registers exactly seven PAS rules", () => {
    expect(KERNEL_RUNTIME_RULE_IDS).toHaveLength(7);
    expect(KERNEL_RUNTIME_RULES_POLICY.ruleCount).toBe(7);
    expect(listKernelRuntimeRules()).toHaveLength(7);
  });

  it("matches PAS §10 labels verbatim and in order", () => {
    const labels = listKernelRuntimeRules().map((rule) => rule.label);
    expect(labels).toEqual([...PAS_SECTION_10_LABELS]);
  });

  it("maps every rule id to a registry row with stable order", () => {
    for (const [index, id] of KERNEL_RUNTIME_RULE_IDS.entries()) {
      const rule = KERNEL_RUNTIME_RULES[id];
      expect(rule.id).toBe(id);
      expect(rule.order).toBe(index + 1);
      expect(isKernelRuntimeRuleId(id)).toBe(true);
      expect(getKernelRuntimeRule(id).label.length).toBeGreaterThan(0);
    }
  });

  it("registers the async context propagation primitive only", () => {
    expect(KERNEL_RUNTIME_RULES_POLICY.approvedPrimitiveCount).toBe(1);
    expect(
      KERNEL_APPROVED_RUNTIME_PRIMITIVES["async-context-propagation"].label
    ).toBe("Async context propagation only.");
    expect(
      KERNEL_APPROVED_RUNTIME_PRIMITIVES["async-context-propagation"].apiSurface
    ).toEqual(["kernelContext.run", "kernelContext.get", "kernelContext.fork"]);
  });

  it("rejects unknown rule ids", () => {
    expect(isKernelRuntimeRuleId("zero-external-dependencies")).toBe(true);
    expect(isKernelRuntimeRuleId("database-access")).toBe(false);
  });

  it("remains JSON-serializable for documentation and drift gates", () => {
    const serialized = JSON.parse(
      JSON.stringify({
        authority: KERNEL_RUNTIME_RULES_AUTHORITY,
        policy: KERNEL_RUNTIME_RULES_POLICY,
        rules: listKernelRuntimeRules(),
        primitive:
          KERNEL_APPROVED_RUNTIME_PRIMITIVES["async-context-propagation"],
      })
    ) as {
      authority: typeof KERNEL_RUNTIME_RULES_AUTHORITY;
      policy: typeof KERNEL_RUNTIME_RULES_POLICY;
      rules: ReturnType<typeof listKernelRuntimeRules>;
      primitive: (typeof KERNEL_APPROVED_RUNTIME_PRIMITIVES)["async-context-propagation"];
    };

    expect(serialized.authority).toBe("PAS-001 §10");
    expect(serialized.policy.pasSection).toBe("10");
    expect(serialized.rules).toHaveLength(7);
    expect(serialized.primitive.label).toBe("Async context propagation only.");
  });
});
