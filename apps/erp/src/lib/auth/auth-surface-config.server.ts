import { resolveSignInProviderSurface } from "@afenda/auth";

import { AUTH_PATHS } from "./auth-path.registry";
import { resolveSafeInternalPath } from "./resolve-safe-internal-path";

export interface AuthSurfaceConfig {
  readonly emailDeliveryEnabled: boolean;
  readonly invitationGateEnabled: boolean;
  readonly nextPath: string;
  readonly passkeyEnabled: boolean;
  readonly socialProviderIds: readonly string[];
  readonly ssoEnabled: boolean;
}

export function resolveAuthSurfaceConfig(input?: {
  readonly next?: string;
}): AuthSurfaceConfig {
  const providerSurface = resolveSignInProviderSurface();

  return {
    emailDeliveryEnabled: providerSurface.emailDeliveryEnabled,
    invitationGateEnabled: providerSurface.invitationGateEnabled,
    nextPath: resolveSafeInternalPath(input?.next, AUTH_PATHS.postAuthComplete),
    passkeyEnabled: providerSurface.passkeyEnabled,
    socialProviderIds: providerSurface.socialProviderIds,
    ssoEnabled: providerSurface.ssoEnabled,
  };
}
