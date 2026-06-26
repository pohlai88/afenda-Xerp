import type { Metadata } from "next";
import { AuthEntryPage } from "@/app/(auth)/_components/auth-entry-page";
import { ResetPasswordSuccessState } from "@/app/(auth)/_components/auth-journey-states";
import { AUTH_ROUTE_REGISTRY } from "@/lib/auth/auth-route.registry";

export const metadata: Metadata =
  AUTH_ROUTE_REGISTRY.resetPasswordSuccess.metadata;

export default function ResetPasswordSuccessPage() {
  return (
    <AuthEntryPage route="resetPasswordSuccess">
      <ResetPasswordSuccessState />
    </AuthEntryPage>
  );
}
