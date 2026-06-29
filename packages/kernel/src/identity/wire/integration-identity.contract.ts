/**
 * PAS-001 amendment — integration identity vocabulary (Kernel NS §3.1 · E12).
 *
 * Governed reference to an external or cross-tenant initiator — distinct from human UserId.
 * OAuth/token resolution lives outside kernel — shape and ingress validation only.
 */

import { rejectIfCanonicalEnterpriseId } from "../primitives/primitive-brand.helpers.js";

/** Wire JSON shape — plain strings for provider and external reference. */
export type WireIntegrationIdentity = {
  readonly provider: string;
  readonly externalId: string;
};

/** Trusted integration identity after wire ingress parsing. */
export type IntegrationIdentity = {
  readonly provider: string;
  readonly externalId: string;
};

export function parseIntegrationIdentity(
  input: WireIntegrationIdentity
): IntegrationIdentity {
  const provider = input.provider.trim();
  const externalId = input.externalId.trim();

  if (provider.length === 0) {
    throw new Error("IntegrationIdentity.provider must be non-empty.");
  }

  if (externalId.length === 0) {
    throw new Error("IntegrationIdentity.externalId must be non-empty.");
  }

  rejectIfCanonicalEnterpriseId(externalId, "IntegrationIdentity.externalId");

  return { provider, externalId };
}

export function parseOptionalIntegrationIdentity(
  input: WireIntegrationIdentity | null | undefined
): IntegrationIdentity | undefined {
  if (input == null) {
    return;
  }

  return parseIntegrationIdentity(input);
}

export function serializeIntegrationIdentity(
  identity: IntegrationIdentity
): WireIntegrationIdentity {
  return {
    provider: identity.provider,
    externalId: identity.externalId,
  };
}
