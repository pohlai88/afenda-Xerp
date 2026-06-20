export const METADATA_LIFECYCLE_STATES = [
  "draft",
  "approved",
  "deprecated",
  "retired",
] as const;

export type MetadataLifecycleState = (typeof METADATA_LIFECYCLE_STATES)[number];

export interface MetadataIdentity {
  readonly id: string;
  readonly version: string;
  readonly lifecycle: MetadataLifecycleState;
}

export interface MetadataContract {
  readonly contractId: "metadata";
  readonly owner: "Metadata";
  readonly owns: readonly [
    "metadata vocabulary",
    "metadata identity",
    "metadata lifecycle",
    "metadata governance",
  ];
  readonly mustNotOwn: readonly ["rendering", "layout", "presentation"];
}

export const metadataContract = {
  contractId: "metadata",
  mustNotOwn: ["rendering", "layout", "presentation"],
  owner: "Metadata",
  owns: [
    "metadata vocabulary",
    "metadata identity",
    "metadata lifecycle",
    "metadata governance",
  ],
} as const satisfies MetadataContract;
