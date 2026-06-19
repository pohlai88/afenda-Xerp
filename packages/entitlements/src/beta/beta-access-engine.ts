import type { BetaFlagContract } from "../contracts/beta-flag.contract";
import type { BetaFlagKey } from "../contracts/shared.contract";

export interface BetaAccessContext {
  readonly betaFlags: readonly string[];
  readonly companyId: string;
  readonly tenantId: string;
}

export interface BetaAccessResolution {
  readonly betaFlag: BetaFlagContract | null;
  readonly enabled: boolean;
  readonly key: BetaFlagKey;
}

export function beta(
  key: BetaFlagKey,
  betaFlags: readonly BetaFlagContract[],
  context: BetaAccessContext
): BetaAccessResolution {
  return resolveBetaAccess(key, betaFlags, context);
}

export function resolveBetaAccess(
  key: BetaFlagKey,
  betaFlags: readonly BetaFlagContract[],
  context: BetaAccessContext
): BetaAccessResolution {
  const matchingFlag = betaFlags.find((flag) => flag.key === key) ?? null;

  if (!matchingFlag) {
    return { key, enabled: false, betaFlag: null };
  }

  const tenantAllowed = matchingFlag.tenantAllowlist.includes(context.tenantId);
  const companyAllowed = matchingFlag.companyAllowlist.includes(
    context.companyId
  );
  const contextFlagEnabled = context.betaFlags.includes(key);

  return {
    key,
    enabled:
      matchingFlag.enabled &&
      (tenantAllowed || companyAllowed || contextFlagEnabled),
    betaFlag: matchingFlag,
  };
}
