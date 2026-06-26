import type { Metadata } from "next";
import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { OrganizationSelectStubState } from "@/app/(auth)/_components/auth-journey-states";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata: Metadata =
  AUTH_ROUTE_REGISTRY.organizationSelect.metadata;

export default function OrganizationSelectPage() {
  return (
    <AuthEntryPage route="organizationSelect">
      <OrganizationSelectStubState />
    </AuthEntryPage>
  );
}
