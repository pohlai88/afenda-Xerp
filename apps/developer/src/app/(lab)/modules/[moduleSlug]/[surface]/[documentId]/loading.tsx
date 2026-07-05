import { LabRouteLoadingState } from "../../../../_components/lab-route-loading-state";

export default function ModuleDocumentLoading() {
  return (
    <LabRouteLoadingState
      description="The dynamic module document surface is composing its route-local document overview and promotion proof panels."
      eyebrow="Module Document Surface"
      title="Loading the module document route"
      titleId="module-document-route-loading-title"
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="h-[30rem] animate-pulse rounded-3xl bg-muted" />
        <div className="h-[30rem] animate-pulse rounded-3xl bg-muted" />
      </div>
    </LabRouteLoadingState>
  );
}
