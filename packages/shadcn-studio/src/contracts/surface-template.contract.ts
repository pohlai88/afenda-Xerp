/**
 * PAS-006D — surface template wire contract (presentation layer).
 */

export type SurfaceTemplateClass =
  | "form"
  | "table"
  | "dashboard"
  | "settings"
  | "approval";

export interface SurfaceTemplateBlockBindingWire {
  readonly blockId: string;
  readonly slotFills: Readonly<Record<string, string>>;
}

export interface SurfaceTemplateContractWire {
  readonly acceptanceRecordIds: readonly string[];
  readonly blockBindings: readonly SurfaceTemplateBlockBindingWire[];
  readonly metadataBindingId: string;
  readonly surfaceTemplateId: string;
  readonly templateClass: SurfaceTemplateClass;
}

export function isSurfaceTemplateContractWire(
  value: unknown
): value is SurfaceTemplateContractWire {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record["surfaceTemplateId"] === "string" &&
    typeof record["templateClass"] === "string" &&
    typeof record["metadataBindingId"] === "string" &&
    Array.isArray(record["blockBindings"]) &&
    Array.isArray(record["acceptanceRecordIds"])
  );
}
