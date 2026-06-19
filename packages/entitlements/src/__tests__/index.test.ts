import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  capabilities,
  capabilityList,
  entitlement,
  entitlementDecisionResults,
  entitlementTypes,
  evaluateCapability,
  featureFlag,
  getPackageName,
  governedEntitlementContextExample,
  governedEntitlementsExample,
  governedFeatureFlagsExample,
  governedKillSwitchesExample,
  governedLocalizationsExample,
  governedUsageLimitsExample,
  limit,
  localization,
  PACKAGE_NAME,
  requiredUsageLimitKeys,
} from "../index";

const requiredContractFiles = [
  "entitlement.contract.ts",
  "feature-flag.contract.ts",
  "usage-limit.contract.ts",
  "beta-flag.contract.ts",
  "kill-switch.contract.ts",
  "localization.contract.ts",
  "entitlement-context.contract.ts",
  "entitlement-decision.contract.ts",
  "entitlement-audit.contract.ts",
  "export.contract.ts",
] as const;

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const sourceDirectory = join(currentDirectory, "..");
const enterprisePlanCheckPattern = /plan\s*={2,3}\s*["']enterprise["']/;
const premiumCustomerTypeCheckPattern =
  /customerType\s*={2,3}\s*["']premium["']/;
const proPlanCheckPattern = /plan\s*={2,3}\s*["']pro["']/;

describe("@afenda/entitlements", () => {
  it("exports a governed public package identity", () => {
    expect(PACKAGE_NAME).toBe("@afenda/entitlements");
    expect(getPackageName()).toBe("@afenda/entitlements");
  });

  it("defines required TIP-008 contracts, types, limits, and results", () => {
    for (const fileName of requiredContractFiles) {
      expect(
        existsSync(join(currentDirectory, "..", "contracts", fileName))
      ).toBe(true);
    }

    expect(entitlementTypes).toEqual([
      "module",
      "feature",
      "usage_limit",
      "localization",
      "deployment",
      "support",
      "security",
      "beta",
    ]);
    expect(requiredUsageLimitKeys).toEqual([
      "users.max",
      "companies.max",
      "organizations.max",
      "api.calls.daily",
      "storage.gb.max",
      "ai.tokens.monthly",
      "einvoice.volume.monthly",
      "automation.runs.monthly",
    ]);
    expect(entitlementDecisionResults).toEqual([
      "allow",
      "disabled",
      "beta_required",
      "localization_required",
      "limit_exceeded",
      "not_entitled",
      "kill_switch_active",
    ]);
  });

  it("resolves entitlement, feature flag, limit, and localization APIs", () => {
    expect(
      entitlement("module.accounting.enabled", governedEntitlementsExample, {
        tenantId: "tenant_afenda",
        companyId: "company_afenda",
        environment: "production",
      })
    ).toBe(true);
    expect(
      featureFlag("e_invoice", governedFeatureFlagsExample, {
        tenantId: "tenant_afenda",
        companyId: "company_afenda",
        environment: "production",
      })
    ).toBe(true);
    expect(
      limit("einvoice.volume.monthly", governedUsageLimitsExample)
    ).toEqual(
      expect.objectContaining({ allowed: true, used: 120, maximum: 500 })
    );
    expect(
      localization(
        "vn",
        governedLocalizationsExample,
        governedEntitlementsExample,
        {
          tenantId: "tenant_afenda",
          companyId: "company_afenda",
          environment: "production",
        }
      )
    ).toEqual(expect.objectContaining({ enabled: true }));
  });

  it("allows entitled capabilities and denies missing entitlements with audit evidence", () => {
    const allowedDecision = evaluateCapability({
      capabilityKey: "eInvoice",
      context: governedEntitlementContextExample,
      entitlements: governedEntitlementsExample,
      featureFlags: governedFeatureFlagsExample,
      usageLimits: governedUsageLimitsExample,
      betaFlags: [],
      killSwitches: governedKillSwitchesExample,
      localizations: governedLocalizationsExample,
      evaluatedAt: "2026-06-20T00:00:00.000Z",
      correlationId: "corr_allow",
    });
    const deniedDecision = evaluateCapability({
      capabilityKey: "accounting",
      context: governedEntitlementContextExample,
      entitlements: [],
      featureFlags: [],
      usageLimits: [],
      betaFlags: [],
      killSwitches: [],
      localizations: [],
      evaluatedAt: "2026-06-20T00:00:00.000Z",
      correlationId: "corr_denied",
    });

    expect(allowedDecision).toEqual({
      result: "allow",
      capabilityKey: "eInvoice",
      reason: "Capability is available.",
      audit: null,
    });
    expect(deniedDecision.result).toBe("not_entitled");
    expect(deniedDecision.audit).toEqual(
      expect.objectContaining({
        tenantId: "tenant_afenda",
        feature: "eInvoice",
        reason: "Required entitlement is missing.",
        correlationId: "corr_denied",
      })
    );
  });

  it("blocks exceeded limits, missing beta access, localization gaps, and kill switches", () => {
    const baseInput = {
      context: {
        ...governedEntitlementContextExample,
        feature: "aiCopilot",
      },
      entitlements: [
        ...governedEntitlementsExample,
        {
          key: "module.ai_copilot.enabled",
          type: "module",
          enabled: true,
          scope: "tenant",
          tenantId: "tenant_afenda",
          companyId: null,
          environment: null,
          metadata: {},
        },
      ],
      featureFlags: [
        {
          key: "new_ai_copilot",
          enabled: true,
          rollout: "on",
          environments: ["production"],
          tenantAllowlist: [],
          companyAllowlist: [],
          killSwitchKey: "module.ai_copilot.kill_switch",
          metadata: {},
        },
      ],
      usageLimits: governedUsageLimitsExample,
      betaFlags: [
        {
          key: "ai_recommendations",
          enabled: true,
          tenantAllowlist: [],
          companyAllowlist: [],
          startsAt: null,
          endsAt: null,
          metadata: {},
        },
      ],
      killSwitches: [],
      localizations: governedLocalizationsExample,
      evaluatedAt: "2026-06-20T00:00:00.000Z",
      correlationId: "corr_ai",
    } as const;

    expect(
      evaluateCapability({
        ...baseInput,
        capabilityKey: "aiCopilot",
      }).result
    ).toBe("beta_required");
    expect(
      evaluateCapability({
        ...baseInput,
        capabilityKey: "aiCopilot",
        context: {
          ...baseInput.context,
          betaFlags: ["ai_recommendations"],
        },
      }).result
    ).toBe("limit_exceeded");
    expect(
      evaluateCapability({
        ...baseInput,
        capabilityKey: "eInvoice",
        localizations: [],
      }).result
    ).toBe("localization_required");
    expect(
      evaluateCapability({
        ...baseInput,
        capabilityKey: "aiCopilot",
        killSwitches: [
          {
            key: "module.ai_copilot.kill_switch",
            active: true,
            severity: "critical",
            reason: "incident",
            activatedBy: "ops",
            activatedAt: "2026-06-20T00:00:00.000Z",
          },
        ],
      }).result
    ).toBe("kill_switch_active");
  });

  it("keeps capability registry deterministic and JSON-safe", () => {
    expect(capabilityList).toHaveLength(Object.keys(capabilities).length);
    expect(JSON.parse(JSON.stringify(capabilityList))).toEqual(capabilityList);
    expect(capabilities.accounting.entitlementKey).toBe(
      "module.accounting.enabled"
    );
    expect(capabilities.eInvoice.localizationKey).toBe("vn");
  });

  it("prevents plan-name drift in entitlement source files", () => {
    const sourceText = readSourceFiles(sourceDirectory).join("\n");

    expect(sourceText).not.toMatch(enterprisePlanCheckPattern);
    expect(sourceText).not.toMatch(proPlanCheckPattern);
    expect(sourceText).not.toMatch(premiumCustomerTypeCheckPattern);
  });
});

function readSourceFiles(directory: string): readonly string[] {
  const files: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...readSourceFiles(entryPath));
      continue;
    }

    if (extname(entry.name) === ".ts") {
      files.push(readFileSync(entryPath, "utf8"));
    }
  }

  return files;
}
