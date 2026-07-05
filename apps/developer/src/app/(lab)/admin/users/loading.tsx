import { LabRouteLoadingState } from "../../_components/lab-route-loading-state";

export default function AdminUsersLoading() {
  return (
    <LabRouteLoadingState
      description="The operator-list surface is preparing the promotion-ready user directory contract and route-local review panel."
      eyebrow="Operator List Surface"
      title="Loading the user directory review surface"
      titleId="admin-users-route-loading-title"
    >
      <div className="h-[36rem] animate-pulse rounded-3xl bg-muted" />
    </LabRouteLoadingState>
  );
}
