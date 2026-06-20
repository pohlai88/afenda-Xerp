import type { MetadataAuthorityKey } from "./metadata-authority-map.js";

export const REGISTRATION_LIFECYCLE_STATES = [
  "registered",
  "approved",
  "suspended",
  "removed",
] as const;

export type RegistrationLifecycleState =
  (typeof REGISTRATION_LIFECYCLE_STATES)[number];

/**
 * A single registered governance entry.
 * `authority` is constrained to `MetadataAuthorityKey` — entries may only
 * register against known metadata authorities, preventing phantom registrations.
 */
export interface RegistryEntry {
  readonly authority: MetadataAuthorityKey;
  readonly id: string;
  readonly lifecycle: RegistrationLifecycleState;
}

export interface RegistryContract {
  readonly contractId: "registry";
  readonly mustNotOwn: readonly ["rendering implementation"];
  readonly owner: "Metadata";
  readonly owns: readonly [
    "registration lifecycle",
    "registration governance",
    "registry resolution",
  ];
  readonly purpose: string;
  readonly version: string;
}

export const registryContract = {
  contractId: "registry",
  mustNotOwn: ["rendering implementation"],
  owner: "Metadata",
  owns: [
    "registration lifecycle",
    "registration governance",
    "registry resolution",
  ],
  purpose:
    "Own registration lifecycle, registration governance, and registry resolution for metadata authorities.",
  version: "0.1.0",
} as const satisfies RegistryContract;
