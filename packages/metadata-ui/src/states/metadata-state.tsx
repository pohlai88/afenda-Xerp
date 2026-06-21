import type { MetadataStateProps } from "../contracts/state.contract.js";
import { resolveMetadataUiGovernedClassName } from "../wiring/governance.js";

const ALERT_RUNTIME_STATES = new Set<MetadataStateProps["state"]>([
  "error",
  "forbidden",
  "invalid",
]);

export function MetadataState({
  title,
  message,
  state,
  slots,
}: MetadataStateProps) {
  const titleId = `metadata-state-${state}-title`;
  const rootClassName = resolveMetadataUiGovernedClassName("state", {
    structuralClassNames: [
      "metadata-container",
      "metadata-state",
      `metadata-state-${state}`,
    ],
  });
  const liveRole = ALERT_RUNTIME_STATES.has(state) ? "alert" : "status";

  return (
    <section
      aria-labelledby={titleId}
      aria-live={liveRole === "alert" ? "assertive" : "polite"}
      className={rootClassName}
      data-metadata-runtime-state={state}
      data-metadata-state={state}
      data-slot="metadata-state"
      role={liveRole}
    >
      <div className="metadata-state-body">
        {slots?.icon ? (
          <div
            className="metadata-state-icon-slot"
            data-slot="metadata-state-icon"
          >
            {slots.icon}
          </div>
        ) : null}
        <h2 className="metadata-state-title" id={titleId}>
          {title}
        </h2>
        <p className="metadata-state-description">{message}</p>
        {slots?.detail ? (
          <div
            className="metadata-state-detail-slot"
            data-slot="metadata-state-detail"
          >
            {slots.detail}
          </div>
        ) : null}
        {slots?.action ? (
          <div
            className="metadata-state-action-slot"
            data-slot="metadata-state-action"
          >
            {slots.action}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export type { MetadataStateProps } from "../contracts/state.contract.js";
