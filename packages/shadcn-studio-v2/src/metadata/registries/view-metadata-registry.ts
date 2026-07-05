import type { StudioMetadataViewKind } from "../contracts/view-metadata";

export interface StudioMetadataLaneRegistration {
  readonly description: string;
  readonly kind: StudioMetadataViewKind;
}

export const studioMetadataLaneRegistry = [
  {
    description: "Authentication-shaped composition metadata.",
    kind: "auth",
  },
  {
    description: "Generic page surface composition metadata.",
    kind: "page",
  },
  {
    description: "Widget composition metadata.",
    kind: "widget",
  },
] as const satisfies readonly StudioMetadataLaneRegistration[];
