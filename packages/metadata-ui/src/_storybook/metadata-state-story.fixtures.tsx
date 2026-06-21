import type { MetadataStateProps } from "../contracts/state.contract.js";

export const metadataStateWithShellSlotsArgs = {
  message: "You do not have access to release pick wave W-22018.",
  state: "forbidden",
  title: "Forbidden",
  slots: {
    action: (
      <button className="metadata-action-button" type="button">
        Request warehouse access
      </button>
    ),
    detail: (
      <p className="metadata-wrap-anywhere">
        Required capability: warehouse.pick.release · Correlation
        corr_fixture_sample_001
      </p>
    ),
    icon: (
      <span aria-hidden="true" data-shell-marker="forbidden">
        Blocked
      </span>
    ),
  },
} satisfies MetadataStateProps;

export const metadataStateWithoutShellSlotsArgs = {
  message: "Loading fulfillment workspace.",
  state: "loading",
  title: "Loading",
} satisfies MetadataStateProps;

export const metadataStateLatticeArgs = {
  loading: {
    state: "loading",
    title: "Loading",
    message: "Loading fulfillment workspace.",
  },
  empty: {
    state: "empty",
    title: "Empty",
    message: "No orders match the selected warehouse filters.",
  },
  error: {
    state: "error",
    title: "Error",
    message: "Unable to load fulfillment metrics for this shift.",
  },
  forbidden: {
    state: "forbidden",
    title: "Forbidden",
    message: "You do not have access to this fulfillment workspace.",
  },
  degraded: {
    state: "degraded",
    title: "Degraded",
    message: "Attention queue is unavailable. Rail metrics are still current.",
  },
  partial: {
    state: "partial",
    title: "Partial",
    message:
      "Activity feed is delayed. Dominant metric refreshed 2 minutes ago.",
  },
  readonly: {
    state: "readonly",
    title: "Read-only",
    message: "Period close is active. Release actions are disabled.",
  },
  maintenance: {
    state: "maintenance",
    title: "Maintenance",
    message: "Fulfillment telemetry is under maintenance until 06:00 UTC.",
  },
} as const satisfies Record<string, MetadataStateProps>;
