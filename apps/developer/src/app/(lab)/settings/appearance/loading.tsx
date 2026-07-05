import { LabRouteLoadingState } from "../../_components/lab-route-loading-state";

export default function AppearanceSettingsLoading() {
  return (
    <LabRouteLoadingState
      description="The settings surface is assembling guidance and theme composition without introducing ERP persistence or user runtime authority."
      eyebrow="Theme Surface"
      title="Loading the appearance settings review"
      titleId="appearance-route-loading-title"
    >
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <div className="h-72 animate-pulse rounded-3xl bg-muted" />
        <div className="h-96 animate-pulse rounded-3xl bg-muted" />
      </div>
    </LabRouteLoadingState>
  );
}
