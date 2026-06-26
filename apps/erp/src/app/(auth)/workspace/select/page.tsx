import type { Metadata } from "next";
import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { WorkspaceSelectStubState } from "@/app/(auth)/_components/auth-journey-states";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata: Metadata = AUTH_ROUTE_REGISTRY.workspaceSelect.metadata;

export default function WorkspaceSelectPage() {
  return (
    <AuthEntryPage route="workspaceSelect">
      <WorkspaceSelectStubState />
    </AuthEntryPage>
  );
}
