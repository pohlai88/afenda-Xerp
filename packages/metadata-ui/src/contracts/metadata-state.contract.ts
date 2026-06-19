import type { GovernedState, StatusTone } from "@afenda/design-system";

export const METADATA_SURFACE_STATES = [
  "loading",
  "empty",
  "error",
  "forbidden",
  "invalid",
  "ready",
] as const satisfies readonly GovernedState[];

export type MetadataSurfaceState = (typeof METADATA_SURFACE_STATES)[number];

export interface MetadataStateContract {
  readonly ariaLive: "off" | "polite" | "assertive";
  readonly description: string;
  readonly state: MetadataSurfaceState;
  readonly tone: StatusTone;
}
