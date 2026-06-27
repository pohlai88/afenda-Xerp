export const PACKAGE_REGISTRY_STATUSES = [
  "active",
  "active-exempt",
  "planned",
  "experimental",
  "deprecated",
  "retired",
] as const;

export type PackageRegistryStatus = (typeof PACKAGE_REGISTRY_STATUSES)[number];

export const ARCHITECTURE_LAYERS = [
  "Platform",
  "Design",
  "Foundation",
  "Metadata",
  "Integration",
  "ERPSpine",
  "Domain",
  "Application",
] as const;

export type ArchitectureLayer = (typeof ARCHITECTURE_LAYERS)[number];

/** ISO-8601 UTC timestamp string (e.g. `2027-06-20T00:00:00.000Z`). */
export type Iso8601UtcTimestamp = string;

export interface PackageDefinition {
  /** Required when `lifecycle === "deprecated"` — ADR-0006 deprecation start for review window. */
  readonly deprecatedAt?: Iso8601UtcTimestamp;
  /** Required when `lifecycle === "experimental"` — ADR-0006 expiry (maps to package-lifecycle `expiresAt`). */
  readonly experimentalExpiresAt?: Iso8601UtcTimestamp;
  /** Required when `lifecycle === "experimental"` — ADR-0006 experiment start (maps to registry start date). */
  readonly experimentalStartedAt?: Iso8601UtcTimestamp;
  readonly filesystemRequired: boolean;
  readonly layer: ArchitectureLayer;
  readonly layerDepExempt: boolean;
  readonly lifecycle: PackageRegistryStatus;
  readonly packageName: string;
  readonly path: string;
  readonly publicApiOwner: string;
  readonly purpose: string;
  readonly registryId: string;
}

export interface PackageContract {
  readonly fingerprint: string;
  readonly packages: readonly PackageDefinition[];
}
