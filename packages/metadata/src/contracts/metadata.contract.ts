export const METADATA_LIFECYCLE_STATES = [
  "draft",
  "approved",
  "deprecated",
  "retired",
] as const;

export type MetadataLifecycleState = (typeof METADATA_LIFECYCLE_STATES)[number];

export interface MetadataIdentity {
  readonly id: string;
  readonly lifecycle: MetadataLifecycleState;
  readonly version: string;
}

export interface MetadataContract {
  readonly contractId: "metadata";
  readonly mustNotOwn: readonly ["rendering", "layout", "presentation"];
  readonly owner: "Metadata";
  readonly owns: readonly [
    "metadata vocabulary",
    "metadata identity",
    "metadata lifecycle",
    "metadata governance",
  ];
  readonly purpose: string;
  readonly version: string;
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
  purpose:
    "Own the metadata vocabulary, identity, lifecycle, and governance for Afenda metadata-driven surfaces.",
  version: "0.1.0",
} as const satisfies MetadataContract;
