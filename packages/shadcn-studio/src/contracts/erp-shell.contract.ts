/** Serializable ERP operator shell contracts (PAS-006 — boundary-safe for RSC → client). */

export interface ErpNavItemWire {
  readonly href: string;
  readonly isActive?: boolean;
  readonly label: string;
}

export interface ErpNavGroupWire {
  readonly items: readonly ErpNavItemWire[];
  readonly label: string;
}

export interface ErpShellOperatingContextWire {
  readonly legalEntityLabel: string;
  readonly tenantLabel: string;
  readonly workspaceLabel: string;
}

export function isErpNavItemWire(value: unknown): value is ErpNavItemWire {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record["href"] === "string" &&
    typeof record["label"] === "string" &&
    (record["isActive"] === undefined ||
      typeof record["isActive"] === "boolean")
  );
}

export function isErpNavGroupWire(value: unknown): value is ErpNavGroupWire {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record["label"] === "string" &&
    Array.isArray(record["items"]) &&
    record["items"].every(isErpNavItemWire)
  );
}
