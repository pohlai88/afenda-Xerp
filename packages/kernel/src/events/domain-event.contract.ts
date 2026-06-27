import type { JsonObject } from "../contracts/json-wire.contract.js";
import type { CorrelationId, TenantId } from "../identity/index.js";

/** Domain event envelope — dispatch/outbox/retry owned by @afenda/execution. */
export interface DomainEvent<TPayload extends JsonObject = JsonObject> {
  readonly causationId: string | null;
  readonly correlationId: CorrelationId;
  readonly eventId: string;
  readonly eventName: string;
  readonly occurredAt: string;
  readonly payload: TPayload;
  readonly schemaVersion: number;
  readonly tenantId: TenantId | null;
}
