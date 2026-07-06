import { LabRouteLoadingState } from "../_components/lab-route-loading-state";

export default function ArchitectureMapLoading() {
  return (
    <LabRouteLoadingState
      description="The Integration Map is loading registry snapshot data, layer diagrams, and traceability panels."
      eyebrow="Governance Visualization"
      headingLevel={1}
      title="Integration Map — full-stack traceability mirror"
      titleId="architecture-map-route-loading-title"
    >
      <div className="h-[36rem] animate-pulse rounded-3xl bg-muted" />
    </LabRouteLoadingState>
  );
}
