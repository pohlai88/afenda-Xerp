import { LabRouteLoadingState } from "../../_components/lab-route-loading-state";

export default function SalesDashboardLoading() {
  return (
    <LabRouteLoadingState
      description="The canonical operator route is composing its loader-backed panels and proof surfaces."
      eyebrow="Canonical Route Pattern"
      title="Loading the sales command surface"
      titleId="sales-route-loading-title"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-48 animate-pulse rounded-3xl bg-muted lg:col-span-2" />
        <div className="h-48 animate-pulse rounded-3xl bg-muted" />
        <div className="h-80 animate-pulse rounded-3xl bg-muted" />
        <div className="h-80 animate-pulse rounded-3xl bg-muted lg:col-span-2" />
      </div>
    </LabRouteLoadingState>
  );
}
