import { createEntitlementAuditEvent } from "../audit/entitlement-audit";
import { resolveBetaAccess } from "../beta/beta-access-engine";
import type { BetaFlagContract } from "../contracts/beta-flag.contract";
import type { EntitlementContract } from "../contracts/entitlement.contract";
import type { EntitlementContextContract } from "../contracts/entitlement-context.contract";
import type { EntitlementDecisionContract } from "../contracts/entitlement-decision.contract";
import type { FeatureFlagContract } from "../contracts/feature-flag.contract";
import type { KillSwitchContract } from "../contracts/kill-switch.contract";
import type { LocalizationContract } from "../contracts/localization.contract";
import type { UsageLimitContract } from "../contracts/usage-limit.contract";
import { resolveFeatureFlag } from "../flags/feature-flag-engine";
import { resolveKillSwitch } from "../flags/kill-switch-engine";
import { resolveUsageLimit } from "../limits/usage-limit-engine";
import { resolveLocalizationAccess } from "../localization/localization-engine";
import { getCapability } from "./capability-registry";
import { resolveEntitlement } from "./entitlement-engine";

export interface EvaluateCapabilityInput {
  readonly betaFlags: readonly BetaFlagContract[];
  readonly capabilityKey: string;
  readonly context: EntitlementContextContract;
  readonly correlationId: string;
  readonly entitlements: readonly EntitlementContract[];
  readonly evaluatedAt: string;
  readonly featureFlags: readonly FeatureFlagContract[];
  readonly killSwitches: readonly KillSwitchContract[];
  readonly localizations: readonly LocalizationContract[];
  readonly usageLimits: readonly UsageLimitContract[];
}

export function evaluateCapability(
  input: EvaluateCapabilityInput
): EntitlementDecisionContract {
  const capability = getCapability(input.capabilityKey);

  if (!capability) {
    return deny(input, "disabled", "Capability is not registered.", [
      {
        key: "capabilityKey",
        expected: "registered",
        actual: input.capabilityKey,
      },
    ]);
  }

  if (capability.killSwitchKey) {
    const killSwitchResolution = resolveKillSwitch(
      capability.killSwitchKey,
      input.killSwitches
    );

    if (killSwitchResolution.active) {
      return deny(input, "kill_switch_active", "Kill switch is active.", [
        {
          key: capability.killSwitchKey,
          expected: false,
          actual: true,
        },
      ]);
    }
  }

  if (capability.featureFlagKey) {
    const flagResolution = resolveFeatureFlag(
      capability.featureFlagKey,
      input.featureFlags,
      input.context
    );

    if (!flagResolution.enabled) {
      return deny(input, "disabled", "Feature flag is disabled.", [
        {
          key: capability.featureFlagKey,
          expected: true,
          actual: false,
        },
      ]);
    }
  }

  const entitlementResolution = resolveEntitlement(
    capability.entitlementKey,
    input.entitlements,
    input.context
  );

  if (!entitlementResolution.enabled) {
    return deny(input, "not_entitled", "Required entitlement is missing.", [
      {
        key: capability.entitlementKey,
        expected: true,
        actual: false,
      },
    ]);
  }

  if (capability.localizationKey) {
    const localizationResolution = resolveLocalizationAccess(
      capability.localizationKey,
      input.localizations,
      input.entitlements,
      input.context
    );

    if (!localizationResolution.enabled) {
      return deny(
        input,
        "localization_required",
        "Localization entitlement is missing.",
        [
          {
            key: capability.localizationKey,
            expected: true,
            actual: false,
          },
        ]
      );
    }
  }

  if (capability.betaFlagKey) {
    const betaResolution = resolveBetaAccess(
      capability.betaFlagKey,
      input.betaFlags,
      input.context
    );

    if (!betaResolution.enabled) {
      return deny(input, "beta_required", "Beta access is required.", [
        {
          key: capability.betaFlagKey,
          expected: true,
          actual: false,
        },
      ]);
    }
  }

  if (capability.limitKey) {
    const limitResolution = resolveUsageLimit(
      capability.limitKey,
      input.usageLimits
    );

    if (!limitResolution.allowed) {
      return deny(input, "limit_exceeded", "Usage limit is exceeded.", [
        {
          key: capability.limitKey,
          expected: limitResolution.maximum,
          actual: limitResolution.used,
        },
      ]);
    }
  }

  return {
    result: "allow",
    capabilityKey: input.capabilityKey,
    reason: "Capability is available.",
    audit: null,
  };
}

function deny(
  input: EvaluateCapabilityInput,
  result: EntitlementDecisionContract["result"],
  reason: string,
  evidence: Parameters<typeof createEntitlementAuditEvent>[0]["evidence"]
): EntitlementDecisionContract {
  return {
    result,
    capabilityKey: input.capabilityKey,
    reason,
    audit: createEntitlementAuditEvent({
      context: input.context,
      result,
      reason,
      evaluatedAt: input.evaluatedAt,
      correlationId: input.correlationId,
      evidence,
    }),
  };
}
