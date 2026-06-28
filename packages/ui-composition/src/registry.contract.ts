import { createMetadataGovernanceError } from "./metadata.errors.js";
import type {
  MetadataAuthorityKey,
  MetadataLifecycle,
} from "./metadata.types.js";
import { METADATA_CONTRACT_VERSION } from "./metadata.version.js";

export const REGISTRY_CONTRACT_OWNERSHIPS = [
  "registration-lifecycle",
  "registry-authority",
  "registry-resolution",
  "deprecation-governance",
  "experimental-governance",
] as const;

export type RegistryContractOwnership =
  (typeof REGISTRY_CONTRACT_OWNERSHIPS)[number];

export const REGISTRY_CONTRACT_PROHIBITIONS = [
  "rendering-implementation",
  "renderer-implementation",
  "ui-components",
  "react-components",
  "component-styling",
  "design-tokens",
  "business-logic",
  "database-access",
  "permission-execution",
] as const;

export type RegistryContractProhibition =
  (typeof REGISTRY_CONTRACT_PROHIBITIONS)[number];

declare const registryEntryIdBrand: unique symbol;
declare const registryOwnerPackageBrand: unique symbol;
declare const registryEntryVersionBrand: unique symbol;

/** Branded registry entry identifier — serializable as string at runtime. */
export type RegistryEntryId = string & {
  readonly [registryEntryIdBrand]: true;
};

/** Branded npm/workspace package name for registry ownership. */
export type RegistryOwnerPackage = string & {
  readonly [registryOwnerPackageBrand]: true;
};

/** Branded semver string for an individual registry entry. */
export type RegistryEntryVersion = string & {
  readonly [registryEntryVersionBrand]: true;
};

const REGISTRY_ENTRY_VERSION_PATTERN = /^\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/;

function assertNonEmptyRegistryValue(field: string, value: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw createMetadataGovernanceError({
      code: "metadata-governance.invalid-registry-entry",
      message: `Registry entry ${field} must not be empty.`,
      context: { field },
    });
  }

  return normalized;
}

export function createRegistryEntryId(value: string): RegistryEntryId {
  return assertNonEmptyRegistryValue("id", value) as RegistryEntryId;
}

export function createRegistryOwnerPackage(
  value: string
): RegistryOwnerPackage {
  return assertNonEmptyRegistryValue(
    "ownerPackage",
    value
  ) as RegistryOwnerPackage;
}

export function createRegistryEntryVersion(
  value: string
): RegistryEntryVersion {
  const normalized = assertNonEmptyRegistryValue("version", value);

  if (!REGISTRY_ENTRY_VERSION_PATTERN.test(normalized)) {
    throw createMetadataGovernanceError({
      code: "metadata-governance.invalid-registry-entry",
      message: "Registry entry version must be a semver string.",
      context: { version: normalized },
    });
  }

  return normalized as RegistryEntryVersion;
}

export interface CreateRegistryEntryInput {
  readonly authority: MetadataAuthorityKey;
  readonly deprecated?: boolean;
  readonly experimental?: boolean;
  readonly id: string;
  readonly lifecycle: MetadataLifecycle;
  readonly ownerPackage: string;
  readonly version: string;
}

/**
 * Creates a boundary-safe registry entry with branded identity fields.
 *
 * Accepts plain strings at the boundary; returns governed registry entry types.
 */
export function createRegistryEntry(
  input: CreateRegistryEntryInput
): RegistryEntry {
  return {
    id: createRegistryEntryId(input.id),
    authority: input.authority,
    ownerPackage: createRegistryOwnerPackage(input.ownerPackage),
    lifecycle: input.lifecycle,
    version: createRegistryEntryVersion(input.version),
    ...(input.deprecated === undefined ? {} : { deprecated: input.deprecated }),
    ...(input.experimental === undefined
      ? {}
      : { experimental: input.experimental }),
  };
}

/**
 * Canonical metadata registry entry.
 *
 * Registry entries describe ownership, authority, lifecycle, and compatibility.
 * They must not contain renderer implementation, React components, database
 * access, business logic, or permission execution.
 */
export interface RegistryEntry {
  /** Authority domain that owns this registry entry. */
  readonly authority: MetadataAuthorityKey;

  /** Marks an entry as deprecated while preserving compatibility. */
  readonly deprecated?: boolean;

  /**
   * Marks an entry as experimental.
   *
   * Experimental entries must not become default resolution targets unless
   * explicitly enabled by governance or feature flags.
   */
  readonly experimental?: boolean;
  /**
   * Stable registry identifier.
   *
   * Recommended format:
   * - `surface.page`
   * - `layout.dashboard`
   * - `section.list`
   * - `renderer.table.default`
   */
  readonly id: RegistryEntryId;

  /** Lifecycle state of the registry entry. */
  readonly lifecycle: MetadataLifecycle;

  /**
   * Package responsible for the entry.
   *
   * Example: `@afenda/ui-composition`, `@afenda/metadata-ui`
   */
  readonly ownerPackage: RegistryOwnerPackage;

  /**
   * Entry-level semantic version.
   *
   * May differ from the metadata contract version when an entry evolves
   * independently while remaining contract-compatible.
   */
  readonly version: RegistryEntryVersion;
}

export interface RegistryContract {
  readonly authority: "registry";

  /** Registry contract owns registration lifecycle and registry governance only. */
  readonly owns: readonly RegistryContractOwnership[];

  /** Responsibilities explicitly forbidden from the registry contract. */
  readonly prohibits: readonly RegistryContractProhibition[];
  readonly version: typeof METADATA_CONTRACT_VERSION;
}

export const registryContract = {
  authority: "registry",
  version: METADATA_CONTRACT_VERSION,
  owns: REGISTRY_CONTRACT_OWNERSHIPS,
  prohibits: REGISTRY_CONTRACT_PROHIBITIONS,
} as const satisfies RegistryContract;
