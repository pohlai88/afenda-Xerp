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

export interface PackageDefinition {
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
