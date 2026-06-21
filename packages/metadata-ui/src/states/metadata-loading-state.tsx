import type { MetadataRuntimeState } from "@afenda/metadata";

export interface MetadataStateProps {
  readonly title: string;
  readonly message: string;
  readonly state: MetadataRuntimeState;
}

function MetadataStateShell({ title, message, state }: MetadataStateProps) {
  return (
    <div
      aria-label={title}
      aria-live="polite"
      className="metadata-state"
      data-metadata-state={state}
      data-slot="metadata-state"
      role="status"
    >
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
}

export function MetadataLoadingState() {
  return (
    <MetadataStateShell
      message="Loading metadata surface."
      state="loading"
      title="Loading"
    />
  );
}

export function MetadataEmptyState() {
  return (
    <MetadataStateShell
      message="No records match this metadata surface."
      state="empty"
      title="Empty"
    />
  );
}

export function MetadataErrorState() {
  return (
    <MetadataStateShell
      message="Unable to render this metadata surface."
      state="error"
      title="Error"
    />
  );
}

export function MetadataForbiddenState() {
  return (
    <MetadataStateShell
      message="You do not have access to this metadata surface."
      state="forbidden"
      title="Forbidden"
    />
  );
}

export function MetadataInvalidState() {
  return (
    <MetadataStateShell
      message="Metadata configuration is invalid."
      state="invalid"
      title="Invalid"
    />
  );
}

export function MetadataDegradedState() {
  return (
    <MetadataStateShell
      message="Some metadata sections are unavailable."
      state="degraded"
      title="Degraded"
    />
  );
}

export function MetadataPartialState() {
  return (
    <MetadataStateShell
      message="Partial metadata is available."
      state="partial"
      title="Partial"
    />
  );
}

export function MetadataReadonlyState() {
  return (
    <MetadataStateShell
      message="This metadata surface is read-only."
      state="readonly"
      title="Read-only"
    />
  );
}

export function MetadataMaintenanceState() {
  return (
    <MetadataStateShell
      message="This metadata surface is under maintenance."
      state="maintenance"
      title="Maintenance"
    />
  );
}
