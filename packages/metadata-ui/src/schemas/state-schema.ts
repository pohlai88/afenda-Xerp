import { statePolicy } from "@afenda/design-system";
import type { MetadataStateContract } from "../contracts/metadata-state.contract";

export const metadataStateSchema = statePolicy.states.map((state) => ({
  ariaLive: state.ariaLive,
  description: `Metadata surface ${state.state} state.`,
  state: state.state,
  tone: state.tone,
})) as readonly MetadataStateContract[];

export const resolveMetadataState = (
  state: MetadataStateContract["state"]
): MetadataStateContract => {
  const resolvedState = metadataStateSchema.find(
    (candidate) => candidate.state === state
  );

  if (!resolvedState) {
    throw new Error(`Unsupported metadata surface state "${state}".`);
  }

  return resolvedState;
};
