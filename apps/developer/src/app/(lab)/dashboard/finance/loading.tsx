import { LabRouteLoadingState } from "../../_components/lab-route-loading-state";

export default function FinanceDashboardLoading() {
  return (
    <LabRouteLoadingState
      description="The secondary dashboard route is composing finance-specific panels with the same route-law boundary as the canonical surface."
      eyebrow="Secondary Route Pattern"
      title="Loading the finance readiness view"
      titleId="finance-route-loading-title"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-3xl bg-muted" />
        <div className="h-64 animate-pulse rounded-3xl bg-muted" />
        <div className="h-72 animate-pulse rounded-3xl bg-muted lg:col-span-2" />
      </div>
    </LabRouteLoadingState>
  );
}
