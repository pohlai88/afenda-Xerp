export const REGISTRATION_LIFECYCLE_STATES = [
  "registered",
  "approved",
  "suspended",
  "removed",
] as const;

export type RegistrationLifecycleState =
  (typeof REGISTRATION_LIFECYCLE_STATES)[number];

export interface RegistryEntry {
  readonly id: string;
  readonly lifecycle: RegistrationLifecycleState;
  readonly authority: string;
}

export interface RegistryContract {
  readonly contractId: "registry";
  readonly owner: "Metadata";
  readonly owns: readonly [
    "registration lifecycle",
    "registration governance",
    "registry resolution",
  ];
  readonly mustNotOwn: readonly ["rendering implementation"];
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
} as const satisfies RegistryContract;
