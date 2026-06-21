import type { MetadataRuntimeState } from "@afenda/metadata";

import type {
  MetadataSpecificStateProps,
  MetadataStateCopy,
} from "../contracts/state.contract.js";
import { MetadataState } from "./metadata-state.js";

export { MetadataState } from "./metadata-state.js";
export type {
  MetadataSpecificStateProps,
  MetadataStateCopy,
  MetadataStateProps,
} from "../contracts/state.contract.js";

const LOADING_STATE = "loading" satisfies MetadataRuntimeState;
const EMPTY_STATE = "empty" satisfies MetadataRuntimeState;
const ERROR_STATE = "error" satisfies MetadataRuntimeState;
const FORBIDDEN_STATE = "forbidden" satisfies MetadataRuntimeState;
const INVALID_STATE = "invalid" satisfies MetadataRuntimeState;
const DEGRADED_STATE = "degraded" satisfies MetadataRuntimeState;
const PARTIAL_STATE = "partial" satisfies MetadataRuntimeState;
const READONLY_STATE = "readonly" satisfies MetadataRuntimeState;
const MAINTENANCE_STATE = "maintenance" satisfies MetadataRuntimeState;

const METADATA_LOADING_STATE_COPY = {
  title: "Loading",
  message: "Loading metadata surface.",
} as const satisfies MetadataStateCopy;

const METADATA_EMPTY_STATE_COPY = {
  title: "Empty",
  message: "No records match this metadata surface.",
} as const satisfies MetadataStateCopy;

const METADATA_ERROR_STATE_COPY = {
  title: "Error",
  message: "Unable to render this metadata surface.",
} as const satisfies MetadataStateCopy;

const METADATA_FORBIDDEN_STATE_COPY = {
  title: "Forbidden",
  message: "You do not have access to this metadata surface.",
} as const satisfies MetadataStateCopy;

const METADATA_INVALID_STATE_COPY = {
  title: "Invalid",
  message: "Metadata configuration is invalid.",
} as const satisfies MetadataStateCopy;

const METADATA_DEGRADED_STATE_COPY = {
  title: "Degraded",
  message: "Some metadata sections are unavailable.",
} as const satisfies MetadataStateCopy;

const METADATA_PARTIAL_STATE_COPY = {
  title: "Partial",
  message: "Partial metadata is available.",
} as const satisfies MetadataStateCopy;

const METADATA_READONLY_STATE_COPY = {
  title: "Read-only",
  message: "This metadata surface is read-only.",
} as const satisfies MetadataStateCopy;

const METADATA_MAINTENANCE_STATE_COPY = {
  title: "Maintenance",
  message: "This metadata surface is under maintenance.",
} as const satisfies MetadataStateCopy;

function renderMetadataState(
  state: MetadataRuntimeState,
  defaults: MetadataStateCopy,
  props: Partial<MetadataSpecificStateProps> = {}
) {
  return (
    <MetadataState
      message={props.message ?? defaults.message}
      state={state}
      title={props.title ?? defaults.title}
      {...(props.slots ? { slots: props.slots } : {})}
    />
  );
}

export function MetadataLoadingState(
  props: Partial<MetadataSpecificStateProps> = {}
) {
  return renderMetadataState(LOADING_STATE, METADATA_LOADING_STATE_COPY, props);
}

export function MetadataEmptyState(
  props: Partial<MetadataSpecificStateProps> = {}
) {
  return renderMetadataState(EMPTY_STATE, METADATA_EMPTY_STATE_COPY, props);
}

export function MetadataErrorState(
  props: Partial<MetadataSpecificStateProps> = {}
) {
  return renderMetadataState(ERROR_STATE, METADATA_ERROR_STATE_COPY, props);
}

export function MetadataForbiddenState(
  props: Partial<MetadataSpecificStateProps> = {}
) {
  return renderMetadataState(
    FORBIDDEN_STATE,
    METADATA_FORBIDDEN_STATE_COPY,
    props
  );
}

export function MetadataInvalidState(
  props: Partial<MetadataSpecificStateProps> = {}
) {
  return renderMetadataState(INVALID_STATE, METADATA_INVALID_STATE_COPY, props);
}

export function MetadataDegradedState(
  props: Partial<MetadataSpecificStateProps> = {}
) {
  return renderMetadataState(
    DEGRADED_STATE,
    METADATA_DEGRADED_STATE_COPY,
    props
  );
}

export function MetadataPartialState(
  props: Partial<MetadataSpecificStateProps> = {}
) {
  return renderMetadataState(PARTIAL_STATE, METADATA_PARTIAL_STATE_COPY, props);
}

export function MetadataReadonlyState(
  props: Partial<MetadataSpecificStateProps> = {}
) {
  return renderMetadataState(
    READONLY_STATE,
    METADATA_READONLY_STATE_COPY,
    props
  );
}

export function MetadataMaintenanceState(
  props: Partial<MetadataSpecificStateProps> = {}
) {
  return renderMetadataState(
    MAINTENANCE_STATE,
    METADATA_MAINTENANCE_STATE_COPY,
    props
  );
}
