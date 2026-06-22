import type { PlatformLifecycleStatus } from "./lifecycle.contract.js";

/**
 * Corporate group authority stub (TIP-008).
 * Serializable contract only — no persistence in this slice.
 */
export interface EntityGroupContext {
  readonly displayName: string;
  readonly entityGroupId: string;
  readonly parentLegalEntityId: string | null;
  readonly slug: string;
  readonly status: PlatformLifecycleStatus;
  readonly tenantId: string;
}
