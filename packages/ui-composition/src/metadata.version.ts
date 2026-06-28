/**
 * Metadata package version.
 *
 * Purpose:
 * - Tracks the publishable package version of `@afenda/ui-composition`.
 * - Should align with `package.json` during governance releases.
 *
 * Bump when:
 * - The package is published.
 * - Public exports change.
 * - Release notes are produced.
 */
export const METADATA_PACKAGE_VERSION = "0.2.0" as const;

export type MetadataPackageVersion = typeof METADATA_PACKAGE_VERSION;

/**
 * Metadata authority contract version.
 *
 * Purpose:
 * - Tracks metadata governance contract compatibility.
 * - Consumed by authority contracts, validators, snapshots, and downstream packages.
 *
 * Bump when:
 * - Governed arrays change.
 * - Authority ownership changes.
 * - Contract shapes change.
 * - Governance rules change.
 *
 * Do not bump for:
 * - Formatting-only changes.
 * - Documentation-only changes.
 * - Internal test refactors.
 */
export const METADATA_CONTRACT_VERSION = "0.2.0" as const;

export type MetadataContractVersion = typeof METADATA_CONTRACT_VERSION;
